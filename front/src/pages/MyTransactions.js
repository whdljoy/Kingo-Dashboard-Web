import { Flex, HStack, Text, VStack, Box } from "@chakra-ui/layout";
import { useState } from "react";
import MyTransactionsAll from "../components/MyTransactionsAll";
import MyTransactionsSend from "../components/MyTransactionsSend";
import MyTransactionsReceive from "../components/MyTransactionsReceive";
import TransactionsChart from "../components/TransactionsChart";

function MyTransactions() {
  // 내 트랜잭션의 모든 내역, 받은 내역, 사용 내역을 볼 수 있는 페이지
  const [index, setIndex] = useState(0);
  return (
    <Flex m={10} flexDirection="column" w="full">
      <Text fontSize="3xl" fontWeight="700">
        My Point 현황
      </Text>
      <VStack
        w="full"
        backgroundColor="white"
        borderRadius="5px"
        p={5}
        marginBottom={5}
        marginTop={5}
      >
        <TransactionsChart />
      </VStack>
      <HStack>
        <Box
          as="button"
          backgroundColor={index === 0 ? "#4318FF" : "white"}
          color={index === 0 ? "white" : "black"}
          borderRadius="3px"
          width="60px"
          fontWeight="bold"
          onClick={() => {
            setIndex(0);
          }}
        >
          ALL
        </Box>
        <Box
          as="button"
          backgroundColor={index === 1 ? "#4318FF" : "white"}
          color={index === 1 ? "white" : "black"}
          borderRadius="3px"
          width="60px"
          fontWeight="bold"
          onClick={() => {
            setIndex(1);
          }}
        >
          사용 내역
        </Box>
        <Box
          as="button"
          backgroundColor={index === 2 ? "#4318FF" : "white"}
          color={index === 2 ? "white" : "black"}
          borderRadius="3px"
          width="60px"
          fontWeight="bold"
          onClick={() => {
            setIndex(2);
          }}
        >
          받은 내역
        </Box>
      </HStack>

      <VStack
        w="full"
        backgroundColor="white"
        borderRadius={20}
        p={5}
        marginTop={5}
      >
        {index === 0 && <MyTransactionsAll />}
        {index === 1 && <MyTransactionsSend />}
        {index === 2 && <MyTransactionsReceive />}
      </VStack>
    </Flex>
  );
}

export default MyTransactions;
