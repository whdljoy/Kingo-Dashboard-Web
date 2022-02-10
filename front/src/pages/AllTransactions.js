import { Flex, HStack, Text, VStack, Box } from "@chakra-ui/layout";
import LatestTransactions from "../components/LatestTransactions";
import { useState } from "react";

function AllTransactions() {
  const [modalOn, setModalOn] = useState(false);

  const onOpenModal = () => {
    setModalOn(!modalOn);
  };
  return (
    <Flex m={10} flexDirection="column" w="full">
      <Text fontSize="3xl" fontWeight="700">
        Transaction 현황
      </Text>

      {/* graph */}
      {/* 
            <VStack
                w="full"
                backgroundColor="white"
                borderRadius="5px"
                p={5}
                marginTop={5}
            >
                <HStack justifyContent="space-between" w="full">
                    <Text color="#4318FF" fontWeight={700} fontSize="lg">
                        Latest Blocks
                    </Text>
                    <Box
                        as="button"
                        backgroundColor="#4318FF"
                        color="white"
                        borderRadius="3px"
                        width="60px"
                        fontWeight="bold"
                    >
                        + More
                    </Box>
                </HStack>

                <LatestBlock />
            </VStack> */}

      <VStack
        w="full"
        backgroundColor="white"
        borderRadius="5px"
        p={5}
        marginTop={5}
      >
        <HStack justifyContent="space-between" w="full">
          <Text color="#4318FF" fontWeight={700} fontSize="lg">
            Latest Transaction
          </Text>
          <Box
            as="button"
            backgroundColor="#4318FF"
            color="white"
            borderRadius="3px"
            width="60px"
            fontWeight="bold"
            onClick={onOpenModal}
          >
            + More
            {modalOn ? <LatestTransactions /> : ""}
          </Box>
        </HStack>

        <LatestTransactions />
      </VStack>
      <VStack
        w="half"
        backgroundColor="white"
        borderRadius="5px"
        p={5}
        marginTop={5}
      >
        <HStack justifyContent="center" w="full">
          <Text color="#4318FF" fontWeight={700} fontSize="2xl">
            다음 Transaction 까지
          </Text>
        </HStack>
        <HStack justifyContent="center" w="full">
          <Text color="#4318FF" fontWeight={700} fontSize="9xl">
            11:20:00
          </Text>
        </HStack>
      </VStack>
    </Flex>
  );
}

export default AllTransactions;
