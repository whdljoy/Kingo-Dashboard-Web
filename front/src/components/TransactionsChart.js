import {useState, useEffect} from "react"
import { useWeb3React } from "@web3-react/core";
import axios from 'axios';
import data from "../assets/data.json";
import {
    LineChart,
    Line,
    Tooltip,
    YAxis,
    XAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

export default function TransactionsChart() {
    const [pointArr, setPointArr] = useState(0);
    const {account} = useWeb3React();

    const getPosts = async () => {
        let isSubscribed = true
        try {
            axios.get("http://localhost:5000/api/userinfo",{ 
            params:{
                    id:account}
                })
            .then(function(response){
                console.log(response.data);
                if(isSubscribed){
                    setPointArr(response.data[0]._pointA+response.data[0]._pointB+response.data[0]._pointC+response.data[0]._pointD);
                }
                changeChart(response.data[0]._pointA+response.data[0]._pointB+response.data[0]._pointC+response.data[0]._pointD)
            }); 
        } catch (err) {
          console.error(err.message);
        }
        return () => isSubscribed = false
      };
    const changeChart = (point) => {
        if(data[data.length-1].point == 0){
            data[data.length-1].point = point;
            data[data.length-1].date=new Date()
        }
        else{
            for (let j = 0; j < data.length-1; j++) {
                data[j].point=data[j+1].point;
                data[j].date=data[j+1].date;
            }
            data[data.length-1].point=point;
            data[data.length-1].date=new Date()
        }
    }
    useEffect(()=>{    
        getPosts()
        const interval=setInterval(()=>{
          getPosts()

         },86400000)
         return()=>clearInterval(interval)
    },[])

    return (
        <ResponsiveContainer width="95%" height={210} debounce={1}>
            <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 15, bottom: 2 }}
            >
                <XAxis
                    dataKey="date"
                />
                <YAxis />
                <Tooltip
                    itemStyle={{ fontSize: "5px" }}
                    contentStyle={{ fontSize: "0px" }}
                    wrapperStyle={{ padding: 0, border: "none" }}
                />
                <Line
                    dot={true}
                    type="line"
                    dataKey="point"
                    stroke="#4318ff"
                />
                
            </LineChart>
        </ResponsiveContainer>
    );
}

