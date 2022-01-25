import {useState, useEffect} from "react"
import { useHistory } from "react-router";
import { useLocation } from "react-router";
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
import TotalPoint from "./TotalPoint";

export default function TransactionsChart() {
    const history = useHistory()
    const location = useLocation();
    const [pointArr, setPointArr] = useState(0);
    const {account} = useWeb3React();
    const getData = async () => {
        let isSubscribed = true
        try {
            await axios.get("http://localhost:5000/api/userinfo",{ 
            params:{
                    id:account}
                })
            .then(function(response){
                console.log(response.data);
                if(isSubscribed){
                    setPointArr(response.data[0]._pointA+response.data[0]._pointB+response.data[0]._pointC+response.data[0]._pointD);
                    postData(response.data[0]._pointA+response.data[0]._pointB+response.data[0]._pointC+response.data[0]._pointD);
                    history.push(`/my-transactions`);
                   //location.reload();
                }
            }); 
        } catch (err) {
          console.error(err.message);
        }
        return () => isSubscribed = false
      };
    const postData = async (total_P) => {
        console.log(total_P);
        let isSubscribed = true
        const form = new FormData();
        form.append('_point', total_P);
        try {
            await axios.post("http://localhost:5000/api/createGraph",{ 
                params:{
                    id: account},
                data:{
                    form}
                })
            .then(function(response){
                console.log(response.data);
            }); 
        } catch (err) {
          console.error(err.message);
        }
        return () => isSubscribed = false
      };
    const RegetData = async () => {
        let isSubscribed = true
        try {
            await axios.get("http://localhost:5000/api/graph",{ 
            params:{
                    id:account}
                })
            .then(function(response){
                console.log(response.data);
                if(isSubscribed){
            
                }
            }); 
        } catch (err) {
          console.error(err.message);
        }
        return () => isSubscribed = false
      };
    useEffect(()=>{    
        getData()
        RegetData()
        const interval=setInterval(()=>{
          getData()
          RegetData()
         },20000)
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

