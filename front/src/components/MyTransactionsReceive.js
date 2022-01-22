import styled from "styled-components";
import kakaoTalk from "../assets/kakaoTalk.png";
import { HStack, Text } from "@chakra-ui/layout";
import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import axios from 'axios';

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
  margin-left: 10px;
`;

const Time = styled.td`
  color: #aeb4c4;
  text-align: center;
`;


export default function MyTransactionsReceive() {
  const [fromListState, setFromListState] = useState(["Not Found"]);
  const [toListState, setToListState] = useState(["Not Found"]);
  const [typeListState, setTypeListState] = useState(["Not Found"]);
  const [valueListState, setValueListState] = useState(["Not Found"]);
  const [dateListState, setDateListState] = useState(["Not Found"]);
  const [hashListState, setHashListState] = useState(["Not Found"]);

  const {account} = useWeb3React();

  useEffect(() =>{
    const fromList = [];
    const toList = [];
    const typeList = [];
    const valueList = [];
    const dateList = [];
    const hashList = [];
    axios.get("http://localhost:5000/api/viewAll").then(function(response){
      console.log(response.data[1]._from);
      for (let i = 1; i <= response.data.length; i++) {
        if (response.data[i]?._to == account) {
          fromList.push(response.data[i]._from);
          typeList.push(response.data[i]._type);
          valueList.push(response.data[i]._point);
          dateList.push(response.data[i]._date);
          hashList.push(response.data[i]._hash);
        }
      }
      setFromListState(fromList);
      setTypeListState(typeList);
      setValueListState(valueList);
      setDateListState(dateList);
      setHashListState(hashList)
    }) 
  },[])
  const createTransactionTable = () => {
    const displayedTable = [];
    for(let i = 0; i < valueListState.length; i++) {
      displayedTable.push(
        <tr>
          <Td>
            <HStack justifyContent="center">
              <Icon src={kakaoTalk} />
              <Text>kakaoPay</Text>
            </HStack>
          </Td>
          <Time>{dateListState[i]}</Time>
          <Td>{fromListState[i]}</Td>
          <Td>{valueListState[i]}</Td>
          <Td>{hashListState[i]}</Td>
        </tr>
      )
    }
    return(
      <Table>
      <thead>
        <tr>
          <Th>플랫폼</Th>
          <Th>시간</Th>
          <Th>FROM</Th>
          <Th>금액</Th>
          <Th>HASH</Th>
        </tr>
      </thead>

      <tbody>
        {displayedTable}
      </tbody>
    </Table>
    )
  }

  return (
    <>
      {createTransactionTable()}
    </>
  );
}
