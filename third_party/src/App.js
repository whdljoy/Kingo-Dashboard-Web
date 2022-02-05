import React, { useState } from "react";
import { QUIZZES } from "./question";
import "./App.css";

function App() {
	const [currentNo, setCurrentNo] = useState(0);
	const [showResult, setShowResult] = useState(false);
	const [score, setScore] = useState(0);
    const [lose, setLose] = useState(0)
	const [select, setSelect] = useState(0);
	const handleClick = (isCorrect) => {
		if (isCorrect) {
			setScore((score) => score + 10);
		}
        else{
            setLose((lose) => lose + 5);
        }
		if (currentNo === QUIZZES.length - 1) {
			setShowResult(true);
		} else {
			setCurrentNo((currentNo) => currentNo + 1);
		}
	};
	const selectClick =(value) =>{
		setSelect(value);
	}
    const total = score - lose;
	return (
		<div className="container">
			{select === 0 ?(
				<div className="app">
					<h1 className="select-header">What do you want?</h1>
						<button onClick={() => selectClick(1)}>Get point</button>
						<button onClick={() => selectClick(2)}>Spend point</button>
				</div>
			) : (select === 1 ?(
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
									<button
										value={answer.text}
										onClick={() => handleClick(answer.isCorrect)}
									>
										{answer.text}
									</button>
								))}
							</div>
						</div>
					)}					
				</div>
				):(
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
										<button
											value={answer.text}
											onClick={() => handleClick(answer.isCorrect)}
										>
											{answer.text}
										</button>
									))}
								</div>
							</div>
					)} 
					</div>	
					)
				)}
		{/* {showResult ? (
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
							<button
								value={answer.text}
								onClick={() => handleClick(answer.isCorrect)}
							>
								{answer.text}
							</button>
						))}
					</div>
				</div>
			)} */}
		</div>
	);
}

export default App;