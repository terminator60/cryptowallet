const secp = require("ethereum-cryptography/secp256k1");
const utils = require("ethereum-cryptography/utils");
const {keccak256} = require("ethereum-cryptography/keccak");


const privateKey = secp.utils.randomPrivateKey();
const publicKey =  secp.getPublicKey(privateKey, false);
const address = keccak256(publicKey.slice(1)).slice(-20);
//console.log(privateKey);
console.log(utils.toHex(privateKey));
console.log(utils.toHex(publicKey));
console.log(`0x${utils.toHex(address)}`);