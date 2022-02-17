import { HStack, Text } from "@chakra-ui/layout";
import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Link,Box } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import moment from 'moment';
import Moment from 'react-moment';
import 'moment/locale/ko';
import { useInterval } from 'react-use';

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

export default function Clock() {


  const LiveTimeContainer = () => {
    const [minutes, setMinutes] = useState(59);
    const [seconds, setSeconds] = useState(0);
  
    useEffect(() => {
      const countdown = setInterval(() => {
        if (parseInt(seconds) > 0) {
          setSeconds(parseInt(seconds) - 1);
        }
        if (parseInt(seconds) === 0) {
          if (parseInt(minutes) === 0) {
            clearInterval(countdown);
          } else {
            setMinutes(parseInt(minutes) - 1);
            setSeconds(59);
          }
        }
      }, 1000);
      return () => clearInterval(countdown);
    }, [minutes, seconds]);
  
    return (
        <>
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </>
    )
  }

  return <>{LiveTimeContainer()}</>;
}
