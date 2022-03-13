/* import { useState, useRef } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import axios from 'axios';

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
  const onClick = () => {
    axios
      .get('http://localhost:5000/thirds/data',{
        headers:{
            Authorization : 'akfafjalfjasdkfjaslkdjflja'
          }
      })
      .then((response) => {
        
      });
  };
  return (
      <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white">
          <button onClick={handleSign}
            className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
          >
            Sign message
          </button>
          <ErrorMessage message={error} />
      </div>
  );
}
 */