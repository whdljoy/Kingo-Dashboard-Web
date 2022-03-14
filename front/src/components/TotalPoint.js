import { Text, HStack, Box, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";

function TotalPoint() {
  // 모든 플랫폼의 포인트의 합을 보여주는 컴포넌트

  const [pointArr, setPointArr] = useState([]);
  const { account } = useWeb3React();

  useEffect(() => {
    let isSubscribed = true;
    axios
      .get("http://localhost:5000/api/userinfo", {
        params: {
          id: account,
        },
      })
      .then(function (response) {
        console.log(response.data);
        if (isSubscribed) {
          setPointArr(
            pointArr.concat(
              response.data[0]._pointA,
              response.data[0]._pointB,
              response.data[0]._pointC,
              response.data[0]._pointD
            )
          );
        }
      });
    return () => (isSubscribed = false);
  }, []);

  const sumTotalPoint = () => {
    let sumPoint = 0;
    for (let i = 0; i < pointArr.length; i++) {
      sumPoint += pointArr[i];
    }
    return sumPoint;
  };

  const sumPoint = sumTotalPoint();

  return (
    <VStack
      justify="space-between"
      p={5}
      m={3}
      backgroundImage="linear-gradient(#532DFB,#868CFF)"
      w="full"
      h="204px"
      borderRadius={15}
    >
      <HStack w="full" justify="space-between">
        <Text color="white" fontWeight="700" fontSize="3xl">
          총 보유 포인트
        </Text>
        <Box />
      </HStack>
      <HStack w="full" justify="space-between">
        <Box />
        <Text color="white" fontWeight="700" fontSize="5xl">
          {sumPoint} point
        </Text>
      </HStack>
    </VStack>
  );
}

export default TotalPoint;