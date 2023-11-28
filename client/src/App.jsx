import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import WalletLoad from "./WalletLoad";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [nonce, setNonce] = useState(0);

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        nonce={nonce}
        setNonce={setNonce}
      />
      <Transfer address={address} nonce={nonce} setBalance={setBalance} setNonce={setNonce}  />
      <WalletLoad privateKey={privateKey} setPrivateKey={setPrivateKey} setAddress={setAddress} setNonce={setNonce} setBalance={setBalance} />
    </div>
  );
}

export default App;
