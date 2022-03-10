import React, { useState } from 'react';
import { QUIZZES } from './question';

import './App.css';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import axios from 'axios';
import { injectedConnector } from './connector';

function App() {
  const web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
  const { activate, account } = useWeb3React();
  const [sign, setSign] = useState(null);
  const [currentNo, setCurrentNo] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [lose, setLose] = useState(0);
  const [select, setSelect] = useState(0);
  const handleClick = (isCorrect) => {
    if (isCorrect) {
      setScore((score) => score + 10);
    } else {
      setLose((lose) => lose + 5);
    }
    if (currentNo === QUIZZES.length - 1) {
      setShowResult(true);
    } else {
      setCurrentNo((currentNo) => currentNo + 1);
    }
  };
  const selectClick = (value) => {
    setSelect(value);
  };
  const total = score - lose;

  const sendTransaction = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    const _signedTransaction = await web3.eth.personal.sign(JSON.stringify({ _from: '0x1233.....', _to: '0x5ead....', _point: '3' }), accounts[0], accounts[0]);

    console.log(_signedTransaction);

    axios
      .post('http://localhost:5000/api/createTx', {
        _from: accounts[0],
        _to: '0x3bb2401344B03Ac9E13B80DFBF4676eCC662Fb9F',
        _point: '2',
        _signedTransaction: _signedTransaction,
      })
      .then(console.log);
  };

  return (
    <>
      <div className="container">
        {select === 0 ? (
          <div className="app">
            <h1 className="select-header">What do you want?</h1>
            <button onClick={() => selectClick(1)}>Get point</button>
            <button onClick={() => selectClick(2)}>Spend point</button>
            <button onClick={() => activate(injectedConnector)}>connect metamask</button>
          </div>
        ) : select === 1 ? (
          <div className="container">
            {showResult ? (
              <div className="app">
                <h1 className="result-header">You get point</h1>
                <p className="result-score">{total}</p>
              </div>
            ) : (
              <div className="app">
                <div className="question-section">
                  <h1 className="question-header">
                    <span>{QUIZZES[currentNo].id}</span>/{QUIZZES.length}
                  </h1>
                  <div className="question-text">{QUIZZES[currentNo].question}</div>
                </div>
                <div className="answer-section">
                  {QUIZZES[currentNo].answers.map((answer) => (
                    <button value={answer.text} onClick={() => handleClick(answer.isCorrect)}>
                      {answer.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="container">
            {showResult ? (
              <div className="app">
                <h1 className="result-header">You get point</h1>
                <p className="result-score">{total}</p>
              </div>
            ) : (
              <div className="app">
                <div className="question-section">
                  <h1 className="question-header">
                    <span>{QUIZZES[currentNo].id}</span>/{QUIZZES.length}
                  </h1>
                  <div className="question-text">{QUIZZES[currentNo].question}</div>
                </div>
                <div className="answer-section">
                  {QUIZZES[currentNo].answers.map((answer) => (
                    <button value={answer.text} onClick={() => handleClick(answer.isCorrect)}>
                      {answer.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <button style={{ width: '300px' }} onClick={async () => await activate(injectedConnector)}>
        메타마스크 로그인하기
      </button>
      <span>{account}</span>
      <button style={{ width: '300px' }} onClick={sendTransaction}>
        트랜잭션 서명하기
      </button>
    </>
  );
}

export default App;
