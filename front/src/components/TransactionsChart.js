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
    const [pointArr, setPointArr] = useState([]);
    const {account} = useWeb3React();
    const currentTime = new Date().getTime();  //current unix timestamp
    const execTime = new Date().setHours(11,29,0,0);  //API call time = today at 20:00
    let timeLeft;
    if(currentTime < execTime) {
      //it's currently earlier than 20:00
      timeLeft = execTime - currentTime;
      
    }
    else {
        //it's currently later than 20:00, schedule for tomorrow at 20:00
        timeLeft = execTime + 86400000 - currentTime
    }
    /*setTimeout(() => {
      setInterval(() => {
            let isSubscribed = true
            axios.get("http://localhost:5000/api/userinfo",{ 
                params:{
                        id:account}
                    })
                .then(function(response){
                    alert("correct")
                    console.log('12345678');
                    if(isSubscribed){
                    setPointArr(pointArr.concat(response.data[0]._pointA,response.data[0]._pointB,response.data[0]._pointC,response.data[0]._pointD));
                    const sumTotalPoint = () => {
                        let sumPoint = 0
                        for (let i = 0; i < pointArr.length; i++) {
                            sumPoint += pointArr[i]
                        }
                        for(let j=0;j< data.length-1;j++){
                            data[j].date=data[j+1].date;
                            data[j].point=data[j+1].point;
                        }
                        data[data.length-1].date=todayFormal();
                        data[data.length-1].point=sumPoint;
                        return sumPoint
                    }
                    const sumPoint = sumTotalPoint()
                    }
                });
                return () => isSubscribed = false
 
      }, 86400000);  
    }, timeLeft);*/
    useEffect(() => {
        let isSubscribed = true
        axios.get("http://localhost:5000/api/userinfo",{ 
            params:{
                    id:account}
                })
            .then(function(response){
                console.log(response.data);
                if(isSubscribed){
                    setPointArr(pointArr.concat(response.data[0]._pointA,response.data[0]._pointB,response.data[0]._pointC,response.data[0]._pointD));
                }
            });
            const todayFormal = () => {
                let now = new Date();
                let todayYear = now.getFullYear();
                let todayMonth = (now.getMonth()+1) >9? (now.getMonth()+1) : '0' + (now.getMonth()+1);
                let todayDate = now.getDate()>9 ? now.getDate() : '0' +now.getDate();
                return todayYear+'-'+todayMonth+'-'+todayDate;
            }
            const sumTotalPoint = () => {
                let sumPoint = 0
                for (let i = 0; i < pointArr.length; i++) {
                    sumPoint += pointArr[i]
                }
                for(let j=0;j< data.length-1;j++){
                    data[j].date=data[j+1].date;
                    data[j].point=data[j+1].point;
                }
                return sumPoint
            }
            data[data.length-1].date=todayFormal();
            data[data.length-1].point=sumTotalPoint();
            return () => isSubscribed = false
    }, [])   


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
