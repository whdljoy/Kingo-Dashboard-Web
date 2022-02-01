import { HStack, Text } from "@chakra-ui/layout";
import styled from "styled-components";
import kakaoTalk from "../assets/kakaoTalk.png";
import {useEffect, useState} from "react";
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
  alt: "kakao";
`;

const Time = styled.td`
  color: #aeb4c4;
  text-align: center;
`;


export default function LatestTransactions() {
  const [tran, setTran] = useState();
  // setTran(props.tran);
    const [fromList, setFromListState] = useState(["Not Found"]);
    const [toList, setToListState] = useState(["Not Found"]);
    const [typeList, setTypeListState] = useState(["Not Found"]);
    const [valueList, setValueListState] = useState(["Not Found"]);
    const [dateList, setDateListState] = useState(["Not Found"]);
    const [hashList, setHashListState] = useState(["Not Found"]);


   
    useEffect(() => {
      let isSubscribed = true
      const fromList = [];
      const toList = [];
      const typeList = [];
      const valueList = [];
      const dateList = [];
      const hashList = [];
      axios.get("http://localhost:5000/api/viewAll").then(function(response){
            console.log(response.data);
            for(let i = 1; i <= response.data.length; i++) {
                fromList.push(response.data[i]?._from);
                toList.push(response.data[i]?._to);
                typeList.push(response.data[i]?._type);
                valueList.push(response.data[i]?._point);
                dateList.push(response.data[i]?._date);
                hashList.push(response.data[i]?._hash);
            }
            if(isSubscribed){
              setFromListState(fromList);
              setToListState(toList);
              setTypeListState(typeList);
              setValueListState(valueList);
              setDateListState(dateList);
              setHashListState(hashList);
            }
          });
          return () => isSubscribed = false
    }, [])



  
  const view = ()=>{
    const result = [];
    const realResult=[];
    
    realResult.push(
    <thead>
      <tr>
        <Th>플랫폼</Th>
        <Th>시간</Th>
        <Th>FROM</Th>
        <Th>TO</Th>
        <Th>금액</Th>
        <Th>HASH</Th>
      </tr>
    </thead>
    );
    if(typeof dateList === "object"){
      for(let i=0;i<dateList.length;i++){
        result.push(
          <tr>
            <Td>
              <HStack justifyContent="center">
                <Icon src={kakaoTalk} />
                <Text>{typeList[i]}</Text>
              </HStack>
            </Td>
            <Time>{dateList[i]}</Time>
            <Td>{fromList[i]}...</Td>
            <Td>{toList[i]}...</Td>
            <Td>{valueList[i]}</Td>
            <Td>{hashList[i]}</Td>
          </tr>
        )
      }
    }
    realResult.push(<tbody>{result}</tbody>);

    return <Table>{realResult}</Table>
  }
  return (
    <>
      {view()}
    </>
  );
}
