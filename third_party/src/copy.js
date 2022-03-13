/* import { useState, useRef } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";

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

export default function SignMessage() {
  const resultBox = useRef();
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
    <form className="m-4" onSubmit={handleSign}>
      <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white">
        <main className="mt-4 p-4">
          <h1 className="text-xl font-semibold text-gray-700 text-center">
            Sign messages
          </h1>
          <div className="">
          </div>
        </main>
        <footer className="p-4">
          <button
            type="submit"
            className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
          >
            Sign message
          </button>
          <ErrorMessage message={error} />
        </footer>
        {signatures.map((sig, idx) => {
          return (
            <div className="p-2" key={sig}>
              <div className="my-3">
                <p>
                  Message {idx + 1}: {sig.message}
                </p>
                <p>Signer: {sig.address}</p>
                <textarea
                  type="text"
                  readOnly
                  ref={resultBox}
                  className="textarea w-full h-24 textarea-bordered focus:ring focus:outline-none"
                  placeholder="Generated signature"
                  value={sig.signature}
                />
              </div>
            </div>
          );
        })}
      </div>
    </form>
  );
}

import { BrowserRouter, Route, Redirect } from "react-router-dom";
import styled from "styled-components";
import { Container, Flex } from "@chakra-ui/react";
import Main from "./main";
import SignMessage from "./second";
import { useWeb3React } from "@web3-react/core";

const AppWrap = styled.div`
  font-size: 12px;
  font-family: "Poppins", sans-serif;
`;

function App() {
  const { active } = useWeb3React();
  return (
    <AppWrap>
      <Container maxW="full" bg="#E5E5E5" p={0}>
        <Flex minH="100vh" h="full">
          <BrowserRouter>
		 	{active ? <Redirect to="/"/> : <Redirect to="/"/>}
            <Route exact path="/" component={Main} />
            <Route exact path="/sign" component={SignMessage} />
          </BrowserRouter>
        </Flex>
      </Container>
    </AppWrap>
  );
}
{active ? <button style={{ width: "300px" }} onClick={async () => await activate(injectedConnector)}>Get Point</button> : 
export default App;
 */