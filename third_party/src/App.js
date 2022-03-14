import React, { useState } from "react";
import "./App.css";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import axios from "axios";
import { injectedConnector } from "./connector";
import api_key from "./config/config.js"

function App() {
  const web3 = new Web3(
    Web3.givenProvider || "ws://some.local-or-remote.node:8546"
  );
  const { activate, account } = useWeb3React();
  const [sign, setSign] = useState(null);
  const sendTransaction = async () => {
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      const _signedTransaction = await web3.eth.personal.sign(
        JSON.stringify({
          _from: accounts[0],
          _to: "0xb04822f6A15a9507B1bcD96FFD1B7Dcf83764Aef",
          _point: "2",
        }),
        accounts[0],
        accounts[0]
      );

      console.log(_signedTransaction);

      const address = web3.eth.personal.ecRecover(
        JSON.stringify({
          _from: accounts[0],
          _to: "0xb04822f6A15a9507B1bcD96FFD1B7Dcf83764Aef",
          _point: "2",
        }),
        _signedTransaction
      );

      address.then((res) => console.log(res));

      axios
        .post("http://localhost:5000/api/createTx",
        {
          _skkuid: "skystar234556",
          _from: accounts[0],
          _to: "0xb04822f6A15a9507B1bcD96FFD1B7Dcf83764Aef",
          _point: "2",
          _signedTransaction: _signedTransaction,
        },
        {
          headers: {
              authorization : api_key.JWT_SECRET
          }
        }
        )
        .then(console.log);
  };

  return (
    <>
      <button style={{ width: "300px" }}onClick={async () => await activate(injectedConnector)} >
        메타마스크 로그인하기
      </button>
      <button style={{ width: "300px" }} onClick={sendTransaction}>Get Point</button>
      <span>{account}</span>
      <button style={{ width: "300px" }} onClick={sendTransaction}>
        Send Point
      </button>
    </>
  );
}

export default App;