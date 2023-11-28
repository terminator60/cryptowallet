import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { utf8ToBytes, toHex, hexToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { useState } from "react";

function WalletLoad({privateKey, setPrivateKey, setAddress, setNonce, setBalance}) {
    const [callData, setCallData] = useState("");
    const [signature, setSignature] = useState("");
    async function onWalletKeyChange(evt) {
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

    async function onCallDataChange(evt) {
        const callData = evt.target.value;
        setCallData(callData)
        if(callData){
            let signature = secp.signSync(hexToBytes(callData), privateKey, {recovered: true});
            signature = toHex(signature[0]) + signature[1];
            setSignature(signature);
        } else {
            setSignature("");
        }
        
    }

    return (
        <div className="container wallet">
            <h1>Wallet Load & Sign</h1>
            <label>
                Wallet Private Key
                <input placeholder="Type an valid private key" value={privateKey} onChange={onWalletKeyChange}></input>
            </label>

            <label>
                CallData
                <input placeholder="Type an valid calldata" value={callData} onChange={onCallDataChange}></input>
            </label>

            <label>
                Signature
                <input value={signature} readOnly></input>
            </label>
        </div>
    )
}

export default WalletLoad;