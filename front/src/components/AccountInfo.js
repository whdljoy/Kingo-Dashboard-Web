//DashBoard page에 사용됨
//내 지갑 주소와 클릭시 해당 주소의 클레이튼 스코프로 연결시켜주는 부분 
import {VStack,Box,Flex,Text,Button,Link,useMediaQuery, Tooltip,} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";

function AccountInfo() {
  const [isLessThan1195] = useMediaQuery("(max-width:1195px)");
  const { account } = useWeb3React();
  const parseAccount =
    account && account?.substring(0, 10) + "..." + account?.substring(32, 40);
  const parseAccountForColor = "#" + account?.substring(2, 8);
  const etherscanAccount = `https://baobab.scope.klaytn.com/account/${account}?tabId=txList`;
  //klaythn scope 에서 내 계정에 관한 리스트

  console.log(parseAccountForColor);
  return (
    <VStack
      borderRadius={15}
      bg="white"
      p={10}
      h="355px"
      w={isLessThan1195 ? "full" : "45%"}
      m={3}
      justify="center"
      spacing={5}
    >
      <Flex
        backgroundColor={parseAccountForColor}
        borderRadius={100}
        w="110px"
        h="110px"
        align="center"
        justify="center"
        fontFamily="'Pacifico', cursive"
        fontSize="3xl"
      >
        {account?.substring(2, 6)}
      </Flex>
      <Text fontSize="lg">내 지갑 주소 : </Text>
      <Tooltip label={account}>
        <Text>{parseAccount}</Text>
      </Tooltip>
      {account && (
        <Button as={Link} isExternal href={etherscanAccount}>
          View on klaytn scope
        </Button>
      )}
    </VStack>
  );
}

export default AccountInfo;
