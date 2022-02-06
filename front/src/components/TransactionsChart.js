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
    var chartdata;
    var moment = require('moment');
    var now = new Date().getDate();	// 현재 날짜 및 시간
    function change_date(published_at){
        const publish_date = moment(published_at).format('YYYY년 MM월 DD일')
        return publish_date
    }
    var Today =change_date(new Date());
    var Date1 =change_date(new Date(new Date().setDate(now - 1)))
    var Date2 =change_date(new Date(new Date().setDate(now - 2)))
    var Date3 =change_date(new Date(new Date().setDate(now - 3)))
    var Date4 =change_date(new Date(new Date().setDate(now- 4)))
    var Date5 =change_date(new Date(new Date().setDate(now - 5)))
    var Date6 =change_date(new Date(new Date().setDate(now - 6)))
    const [Day6State, setDay6State] = useState(0);
    const [Day5State, setDay5State] = useState(0);
    const [Day4State, setDay4State] = useState(0);
    const [Day3State, setDay3State] = useState(0);
    const [Day2State, setDay2State] = useState(0);
    const [Day1State, setDay1State] = useState(0);
    const [TodayState, setTodayState] = useState(0);
    const {account} = useWeb3React();
    useEffect(() => {
        const Day6List = [];
        const Day5List = [];
        const Day4List = [];
        const Day3List = [];
        const Day2List = [];
        const Day1List = [];
        axios.get("http://localhost:5000/api/graph",{ 
        params:{
                id:account}
        }).then(function(response){
                console.log(response.data);
                setDay6State(response.data[0].Day_6);
                setDay5State(response.data[0].Day_5);
                setDay4State(response.data[0].Day_4);
                setDay3State(response.data[0].Day_3);
                setDay2State(response.data[0].Day_2);
                setDay1State(response.data[0].Day_1);
                setTodayState(response.data[0].Today);
            });
        }, [])
        chartdata=[
            {
                "date": Date6,
                "point": Day6State
            },
            {
                "date": Date5,
                "point": Day5State
            },
            {
                "date": Date4,
                "point": Day4State
            },
            {
                "date": Date3,
                "point": Day3State
            },
            {
                "date": Date2,
                "point": Day2State
            },
            {
                "date": Date1,
                "point": Day1State
            },
            {
                "date": Today,
                "point": TodayState
            }
        ]    
    return (
        <ResponsiveContainer width="95%" height={210} debounce={1}>
            <LineChart
                data={chartdata}
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

