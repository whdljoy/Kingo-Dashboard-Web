import { VStack, HStack, Text, useMediaQuery } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie } from "recharts";
import { useWeb3React } from "@web3-react/core";
import axios from 'axios';



function PointPieChart() {
    const [pointArr, setPointArr] = useState([]);
    const {account} = useWeb3React();

    useEffect(() => {
        let isSubscribed = true
        axios.get("http://localhost:5000/api/userInfo", { params: { id: account } })
            .then(function(response){
                if(isSubscribed){
                setPointArr(pointArr.concat(response.data.pointA,response.data.pointB,response.data.pointC,response.data.pointD));
                }
            });
            return () => isSubscribed = false
    }, []) 

    const data = [
        {
            name: "Group A",
            value: pointArr[0],
        },
        {
            name: "Group B",
            value: pointArr[1],
        },
        {
            name: "Group C",
            value: pointArr[2],
        },
        {
            name: "Group D",
            value: pointArr[3],
        },
    ];

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
                포인트 비율
            </Text>
            <ResponsiveContainer width="95%" height={180} debounce={1}>
                <PieChart width={730} height={250}>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#82ca9d"
                    />
                </PieChart>
            </ResponsiveContainer>
        </VStack>
    );
}

export default PointPieChart;
