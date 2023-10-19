import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import 'chartjs-plugin-datalabels'
import '../../css/outDes.css'
import { BoldOutlined } from '@ant-design/icons';

function OutDesAdd({sName,wSeq}) {

    Chart.register(ArcElement, Tooltip, Legend);

    
    const [charData,setCharData] = useState([])
// 항목에 대한 데이터 다시 불러오기
const stockNameData = async () => {

    const stock_name = {
        stock_name : sName,
        wh_seq:wSeq
    }

    console.log('조회할데이터',stock_name);
    try {
      const response = await axios.post('http://localhost:8000/out/des/count', stock_name)
  
      if (response.status === 200) {
  
        console.log("특정제품 데이터..", response.data)
        setCharData(response.data)
  
      };
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("데이터 출력 실패")
  
      }
    }
  }
  



    const labels = charData.map(item => item.Loading.stock_shipping_des);
    const cntData = charData.map(item => item.total_loading_cnt);
    const total = cntData.reduce((acc, value) => acc + parseInt(value, 10), 0); // 데이터 배열의 합계 계산
    const percentData = cntData.map(value => ((parseInt(value, 10) / total) * 100).toFixed(2)); // 각 데이터 항목의 퍼센트 계산

  
  // 총합 계산
//   const total = Object.values(cntData).reduce((acc, value) => acc + value, 0);
  
//   // 백분율 계산
//   const percentData = Object.entries(cntData).map(([des, cnt]) => ({
//     stock_shipping_des: des,
//     percent: ((cnt / total) * 100).toFixed(2)
//   }));
  

    const data = {
        labels: labels,
        datasets: [
            {
                labels: labels,
                data: percentData,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                ],
            },
        ]

    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true, // 라벨 표시 활성화
                position: 'top', // 라벨 위치 설정 (top, bottom, left, right 등)
            },
            datalabels: {
                display: true, // 라벨 표시 활성화
                // color: 'white', // 라벨 텍스트 색상 설정
                font: {
                    size: 14, // 라벨 텍스트 크기 설정
                },
                formatter: (value) => {
                    return value + '%'; // 라벨 텍스트 형식 지정 (예: '10%')
                },
            },
        },
    };

useEffect(()=>{
    stockNameData()
},[])

    return (
        <div id='out_des_container'>
            <div id='doughnut_1'  style={{height:300}}> <Doughnut data={data} options={options} /></div>
            <div id='des_div'  style={{margin:20, width:200}}>
                <table id='des_table'>
                    <thead style={{fontSize:17}}>
                    <tr>
                        <td>배송지</td>
                        <td>판매량</td>
                    </tr>
                    </thead>
                    <tbody>
                    {charData.map((item, idx) => (
                                    <tr key={idx} >
                                      <td >{item.Loading.stock_shipping_des}</td>
                                      <td >{item.total_loading_cnt}</td>
                                    </tr>
                                  ))}
                 </tbody>
                </table>
            </div>

        </div>
    )
}

export default OutDesAdd