import "./App.css";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { cav, IPFSCONTRACT, ipfs } from "./variables";
import DEPLOYED_ABI from "./contractinfo/deployedABI.json";
import DEPLOYED_ADDRESS from "./contractinfo/deployedAddress.json";
function App() {
  const [database, setDatabase] = useState();
  useEffect(() => {}, []);
  const metadata = {
    title: "Asset Metadata",
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "videoId",
      },
      description: {
        type: "object",
        description: database,
      },
      image: {
        type: "string",
        description: "imgUrl",
      },
    },
  };

  // const getWallet = () => {
  //   if (cav.klay.accounts.wallet.length) {
  //     return cav.klay.accounts.wallet[0];
  //   }
  // };

  const call = async () => {
    const sender = cav.klay.accounts.wallet.add(
      //클레이튼 개인키로 추가해줍니다.(추후에 이는 메타마스크로 교체될 예정입니다.)
      // 지갑은 https://wallet.klaytn.com/에서 만들수 있으며(이때 네트워크를 메인넷이 아닌 바오밥 네트워크로 설정해주세요), faucet에서 24시간마다 한번씩 5KLAY를 받을 수 있습니다.(baobab네트워크 한정)
      "0xa586d00a7fbf04975306623520ff08f05fea8ef2bd3cee8e91d6dc79681eac5d"
    );
    const feePayer = cav.klay.accounts.wallet.add(
      //클레이튼 개인키로 추가해줍니다.
      "0x8cafa33df8c1740720bc4815ce7c7cd61d18aaf396bb2a3da5e197f0c7b85aff"
    );
    let res = await ipfs.add(Buffer.from(JSON.stringify(metadata)));
    //metadata의 내용이 ipfs에 추가됩니다. 그리고 res값이 반환되는데, 이때 res[0].hash가 ipfs의 hash값 주소를 의미합니다.
    const url = "https://ipfs.infura.io/ipfs/" + res[0].hash;
    console.log("https://ipfs.infura.io/ipfs/" + res[0].hash);

    const { rawTransaction: senderRawTransaction } =
      // /contracts/Ipfs.sol 파일을 보면 setIpfsAddress라는 함수가 있는데 블록체인상에
      //정보를 올리는 것이기 때문에 가스비가 필요합니다. 그러므로 아래와 같이 코드를 짜줍니다.
      await cav.klay.accounts.signTransaction(
        //트랜잭션에 서명합니다.
        {
          type: "FEE_DELEGATED_SMART_CONTRACT_EXECUTION", //해당 트랜잭션의 타입은 대납 트랜잭션이고, 함수를 호출하는 사람이 가스비를 지불하는 것이 아니라 다른 사람이 대신 낼 수 있다는 것을 의미합니다.
          from: sender.address, // sender는 함수를 호출하는 사람입니다.
          to: DEPLOYED_ADDRESS["key"], // contract에게 요청합니다.
          data: IPFSCONTRACT.methods.setIpfsAddress("today", url).encodeABI(), //내용은 setIpfsAddress를 통해
          //mapping(string=>string) ipfsAddress;를 등록합니다.(추후에 "today"는 변수로 바꿀 예정입니다.)
          gas: "500000",
          value: cav.utils.toPeb("0", "KLAY"),
        },
        sender.privateKey
      );
    cav.klay
      .sendTransaction({
        //트랜잭션을 전송합니다.(결제는 sender가 아닌 feePayer가 합니다.)
        senderRawTransaction: senderRawTransaction,
        feePayer: feePayer.address,
      })
      .then(function (receipt) {
        if (receipt.transactionHash) {
          console.log(receipt.transactionHash); //트랜잭션의 해시값입니다. 이를 통해 https://baobab.scope.klaytn.com/ 에 트랜잭션 해시값을 넣으면 내용을 확인할 수 있습니다.
        }
      });
  };
  const call1 = async () => {
    // 이미 구현된 api에 모든 트랜잭션 정보를 불러옵니다.(추후에 날짜별로 가져오도록 수정합니다.)
    axios
      .get("http://localhost:3001/api/viewAll")
      .then((res) => res.data)
      .then((res) => {
        console.log(res);
        setDatabase(res);
      });
  };

  const call2 = async () => {
    const vari = await IPFSCONTRACT.methods.getIpfsAddress("today").call(); // IPFScONTRACT에서 getIpfsAddress를 호출하는데
    // getIpfsAddress는 view 함수이므로 가스가 들지 않기때문에 위와같이 불러올 수 있습니다.(setIpfsAddress와 다릅니다.)
    console.log(vari);
  };

  return (
    <div className="App">
      <Button onClick={() => call()}>2번</Button>
      <Button onClick={() => call1()}>1번</Button>
      <Button onClick={() => call2()}>3번</Button>
    </div>
  );
}

export default App;
