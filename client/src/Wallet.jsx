import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";


function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, nonce, setNonce }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    if (privateKey) {
      if (privateKey.length == 64) {
        const publicKey = secp.getPublicKey(privateKey, false);
        const address = `0x${toHex(keccak256(publicKey.slice(1)).slice(-20))}`
        setAddress(address);

        if (address) {
          const {
            data: { balance, nonce },
          } = await server.get(`wallet/${address}`);
          setBalance(balance);
          /* const {
            data: { nonce },
          } = await server.get(`nonce/${address}`); */
          setNonce(nonce);

        } else {
          setAddress("");
          setBalance(0);
          setNonce(0);
        }
      } else {
        setAddress("");
        setBalance(0);
        setNonce(0);
      }

    } else {
      setPrivateKey("");
      setAddress("");
      setBalance(0);
      setNonce(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <div className="balance">Public Address: {address}</div>
      <div className="balance">Balance: {balance}</div>
      <div className="balance">Nonce: {nonce}</div>
      {/* <label>
        Wallet Private Key
        <input placeholder="Type an valid private key" value={privateKey} onChange={onChange}></input>
      </label> */}
    </div>
  );
}

export default Wallet;
