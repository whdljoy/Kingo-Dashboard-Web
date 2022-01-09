import { VStack, HStack, Text, useMediaQuery } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import axios from 'axios';


function PointStatus() {
    const [pointArr, setPointArr] = useState([]);
    const {account} = useWeb3React();

    useEffect(() => {
        let isSubscribed = true
        axios.get("http://localhost:5000/api/userInfo", { params: { id: account } })
            .then(function(response){
                if(isSubscribed){
                setPointArr(pointArr.concat(response.data[0]._pointA,response.data[0]._pointB,response.data[0]._pointC,response.data[0]._pointD));
                }
            });
            return () => isSubscribed = false
    }, []) 
 

    const [isLessThan1195] = useMediaQuery("(max-width:1195px)");
    return (
        <VStack
            borderRadius={15}
            bg="white"
            p={10}
            align="flex-start"
            h="355px"
            w={isLessThan1195 ? "full" : "45%"}
            m={3}
        >
            <Text fontSize="3xl" fontWeight="700">
                포인트 현황
            </Text>
            <VStack spacing={10} w="full">
                <HStack w="full" justify="space-between">
                    <Text fontSize="lg">Service A</Text>
                    <Text fontSize="lg">{pointArr[0]}</Text>
                </HStack>
                <HStack w="full" justify="space-between">
                    <Text fontSize="lg">Service B</Text>
                    <Text fontSize="lg">{pointArr[1]}</Text>
                </HStack>
                <HStack w="full" justify="space-between">
                    <Text fontSize="lg">Service C</Text>
                    <Text fontSize="lg">{pointArr[2]}</Text>
                </HStack>
                <HStack w="full" justify="space-between">
                    <Text fontSize="lg">Service D</Text>
                    <Text fontSize="lg">{pointArr[3]}</Text>
                </HStack>
            </VStack>
        </VStack>
    );
}

export default PointStatus;
