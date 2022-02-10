import { HStack, Text } from "@chakra-ui/layout";
import styled from "styled-components";
import kakaoTalk from "../assets/kakaoTalk.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Link } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
const Table = styled.table`
  width: 100%;
`;

const Td = styled.td`
  text-align: center;
  padding: 5px;
`;

const Th = styled.th`
  font-weight: 800;
  color: #4318ff;
  text-align: center;
  border-bottom: 2px solid #4318ff;
`;

const Icon = styled.img`
  src: ${(props) => props.src};
  width: 20px;
  alt: "kakao";
`;

const Time = styled.td`
  color: #aeb4c4;
  text-align: center;
`;

export default function LatestTransactions() {
  const [hash, setHash] = useState([]);
  const [hashUrl, setHashUrl] = useState([]);
  const [index, setIndex] = useState([]);
  const { account } = useWeb3React();

  useEffect(async () => {
    let urlList = [];
    let arr = [];
    let _hash;
    await axios
      .get(`http://localhost:5000/api/getHash?address=${account}`)
      .then((res) => {
        _hash = res.data;
        setHash(_hash);
        arr = Array.from({ length: res.data.length }, (v, i) => i);
        setIndex(arr);
      });
    for (let i = 0; i < _hash.length; i++) {
      await axios
        .get(`http://localhost:5000/api/result/${_hash[i]}`)
        .then((res) => urlList.push(res.data));
    }
    setHashUrl(urlList);
  }, []);

  const view = () => {
    const result = [];
    const realResult = [];

    realResult.push(
      <thead>
        <tr>
          <Th>id</Th>
          <Th>HASH</Th>
          <Th> IPFS HASH URL </Th>
        </tr>
      </thead>
    );

    for (let i = 0; i < index.length; i++) {
      result.push(
        <tr>
          <Td>
            <HStack justifyContent="center">
              <Text>{index[i]}</Text>
            </HStack>
          </Td>
          <Td>{hash[i]}</Td>

          <Td>
            <Button size="xs" as={Link} isExternal href={hashUrl[i]}>
              {hashUrl[i]}
            </Button>
          </Td>
        </tr>
      );
    }

    realResult.push(<tbody>{result}</tbody>);

    return <Table>{realResult}</Table>;
  };
  return <>{view()}</>;
}
