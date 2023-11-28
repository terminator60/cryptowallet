const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const utils = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");


app.use(cors());
app.use(express.json());

const balances = {
  "0x8527747abab82a9620f14c647f9fe03bcc94694d": 200,
  "0xae9348013578554dadc3d731a00929d3aaa11f98": 550,
  "0xeca5233fc63a1a030267269572f7ac9a69121775": 375,
};

const nonces = {
  "0x8527747abab82a9620f14c647f9fe03bcc94694d": 5,
  "0xae9348013578554dadc3d731a00929d3aaa11f98": 3,
  "0xf08eae278173cca9129ee0827b926958d4b8b237": 0,
};

app.get("/wallet/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  const nonce = nonces[address] || 0;
  res.send({ balance, nonce });
});

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.get("/nonce/:address", (req, res) => {
  const { address } = req.params;
  const nonce = nonces[address] || 0;
  res.send({ nonce });
});

app.post("/send", (req, res) => {
  console.log("Transfer Transaction Start")
  const { signature, sender, recipient, amount } = req.body;
  setInitialBalance(sender);
  setInitialNonce(sender);
  setInitialBalance(recipient);

  const dataHash = keccak256(utils.utf8ToBytes(recipient + amount + nonces[sender]))
  /* console.log(`Recipient - ${recipient}\nAmount - ${amount}\nNonce - ${nonces[sender]}`)
  console.log(`Hash - ${toHex(dataHash)}`) */
  const recoveryBit = +signature.slice(signature.length - 1)
  const sign = signature.slice(0, signature.length - 1)
  const publicKey = secp.recoverPublicKey(dataHash, sign, recoveryBit);
  const isValid = secp.verify(sign, dataHash, publicKey)
  const address = `0x${toHex(keccak256(publicKey.slice(1)).slice(-20))}`              
    if (sender === address && isValid) {
      if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
      } else {
        balances[sender] -= amount;
        balances[recipient] += amount;
        nonces[sender]++;
        res.send({ balance: balances[sender], nonce: nonces[sender], message: `Txn of ${amount || 0} ETH to ${recipient} has been Processed` });
        //console.log("Transfer Transaction Processed\n")
      }
    } else {
      /* console.log(`Sent Address - ${sender}\nRecovered Address - ${address}`)
      console.log("Transfer Transaction Failed\n") */
      res.status(400).send({ message: "Invalid Transaction!" });
    }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function setInitialNonce(address) {
  if (!nonces[address]) {
    nonces[address] = 0;
  }
}