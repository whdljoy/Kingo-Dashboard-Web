import { useWeb3React } from '@web3-react/core';
import { injectedConnector } from '../connector';
import Web3 from 'web3';
import { useState } from 'react';

const Sign = () => {
  const [signature, setSignature] = useState();
  const privateKey = '0x8cafa33df8c1740720bc4815ce7c7cd61d18aaf396bb2a3da5e197f0c7b85aff';

  var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
  const { activate, active, account } = useWeb3React();
  console.log(active);
  const onClick = () => {
    activate(injectedConnector);
  };

  const onSign = async () => {
    var message = 'Some string';
    let signature = web3.eth.accounts.sign(message, privateKey);
    let messageHash = web3.eth.accounts.hashMessage(message);
    console.log(signature);
    console.log(messageHash);
    let recover_1 = web3.eth.accounts.recover({
      messageHash: messageHash,
      v: signature.v,
      r: signature.r,
      s: signature.s,
    });
    console.log(recover_1);
  };

  const onsign = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    const asd = await web3.eth.personal.sign('me', accounts[0], accounts[0]);
    console.log(asd);
    web3.eth.personal.ecRecover('me', asd).then(console.log);
  };

  return (
    <div>
      <button onClick={onClick}>로그인</button>
      <div>{account}</div>
      <button onClick={onsign}>서명하기</button>
    </div>
  );
};

export default Sign;
