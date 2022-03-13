/* import React, { useState } from "react";
import "./App.css";
import { useWeb3React } from "@web3-react/core";
import { injectedConnector } from "./connector/index.js";

const signMessage = async ({ setError, message }) => {
	try {
	  console.log({ message });
	  if (!window.ethereum)
		throw new Error("No crypto wallet found. Please install it.");
  
	  await window.ethereum.send("eth_requestAccounts");
	  const provider = new ethers.providers.Web3Provider(window.ethereum);
	  const signer = provider.getSigner();
	  const signature = await signer.signMessage(message);
	  const address = await signer.getAddress();
  
	  return {
		message,
		signature,
		address
	  };
	} catch (err) {
	  setError(err.message);
	}
  };

function Main() {
	const { activate, active } = useWeb3React();
    console.log(active);
    const onClick = () => {
        activate(injectedConnector);
    };
	const [signatures, setSignatures] = useState([]);
	const [error, setError] = useState();
	const score= Math.floor(Math.random() * 101);
	const handleSign = async (e) => {
	  e.preventDefault();
	  setError();
	  const sig = await signMessage({
		setError,
		message: "manager gives you "+score
	  });
	  if (sig) {
		setSignatures([...signatures, sig]);
	  }
	};
	return (
		<div className="container">
				<div className="app">
					<h1 className="select-header">What do you want?</h1>
						<button onClick={active ? handleSign: onClick}>Get point</button>
						<button >Spend point</button>
				</div>
		</div>
	);
}

export default Main; */