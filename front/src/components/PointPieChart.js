import { VStack, HStack, Text, useMediaQuery } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie } from "recharts";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";

function PointPieChart() {
  // 플랫폼(type) 별로 보유한 포인트와 그것들의 비율을 한 눈에 볼 수 있도록 원 그래프 형식으로 표현한 컴포넌트
  const [pointArr, setPointArr] = useState([]);
  const { account } = useWeb3React();

  useEffect(() => {
    let isSubscribed = true;
    axios
      .get("http://localhost:5000/api/userInfo", { params: { id: account } })
      .then(function (response) {
        console.log(response);
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
