import { useState } from "react";
import server from "./server";
import {keccak256} from "ethereum-cryptography/keccak";
import {toHex, utf8ToBytes} from "ethereum-cryptography/utils";


function Transfer({ address, nonce, setBalance, setNonce }) {
  const [sendAmount, setSendAmount] = useState("");
  const [callData, setCallData] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signature, setSignature] = useState("");

  const setValue = (setter) => (evt) => {
    setter(evt.target.value)
  };

  async function generateCallData(){
    if (sendAmount && recipient){
      const dataHash = keccak256(utf8ToBytes(recipient + sendAmount + nonce))
      setCallData(toHex(dataHash))
    } else {
      setCallData("")
    }
    
  }

  async function transfer(evt) {
    evt.preventDefault();
    if (signature) { 
      if (recipient) {
        /* const dataHash = keccak256(utf8ToBytes(recipient + sendAmount + nonce))
        let signature = secp.signSync(dataHash, privateKey, {recovered: true});
        signature = toHex(signature[0]) + signature[1]; */

        try {
          const response = await server.post(`send`, {
            signature: signature,
            sender: address,
            amount: parseInt(sendAmount),
            recipient
          });
          
          if (response && response.data && response.data.balance !== undefined) {
            const { balance, nonce, message } = response.data;
            setBalance(balance);
            setNonce(nonce);
            setCallData("");
            alert(message);
          } else {
            alert(`Txn Reverted`);
          }
        } catch (ex) {
          alert(ex.response.data.message);
        }
      } else{
        alert("Please enter correct recipient address")
      }
    } else{
      alert("Please enter signature")
    }
    
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        CallData
        <input
          value={callData} readOnly
        ></input>
      </label>
      <input type="button" className="button" value="Generate CallData" onClick={generateCallData} />
      <label>
        Signature
        <input
          placeholder="Type an valid signature"
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>
      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
