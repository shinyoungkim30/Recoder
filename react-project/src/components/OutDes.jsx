import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import '../css/outDes.css'
import 'chartjs-plugin-datalabels'








function OutDes() {

  const id = 'smart';
    const wh_seq = 1;
    const com_seq = 1;



  const [desData, setDesData] = useState([])


  //  💥출고품 리스트 정보 가져오기
  const desDetailTest = async () => {
    const userData = {
      com_seq: com_seq,
      wh_seq: wh_seq

    }
    try {
      const response = await axios.post('http://localhost:8000/out/des/name', userData)

      if (response.status === 200) {
        console.log('출고품 정보 가져오기 성공');

        console.log("out/des/test", response.data)

        setDesData(response.data)
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("데이터 출력 실패")

      }
    }
  }





  // 테이블 클릭 이벤트
  const [rowOutTable, setRowOutTable] = useState([].fill(false));

  // 클릭한 품목 데이터 저장 함수
  const [charData, setCharData] = useState([])



  // 차트항목 클릭 이벤트 작동
  const handleRowClick = (idx, item) => {
    console.log('클릭  인덱스', idx);
    setRowOutTable((prevRowOutTable) => {
      const newRowOutTable = [...prevRowOutTable];
      newRowOutTable[idx] = !newRowOutTable[idx];
      return newRowOutTable;
    });
    console.log('클릭한 항목', item);
    let stock_name = {
      wh_seq: wh_seq,
      stock_name: item
    }

    // 항목에 대한 데이터 다시 불러오기
    const stockNameData = async () => {

      try {
        const response = await axios.post('http://localhost:8000/out/des/count', stock_name)

        if (response.status === 200) {

          console.log("특정제품 데이터", response.data)
          setCharData(response.data)

        };
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("데이터 출력 실패")

        }
      }
    }
    stockNameData();


  };




  const [dateData, setDateData] = useState({
    day1: '',
    day2: ''
  })
  // 기간 설정 함수
  const sDate = (e) => {
    if (e.target.name == 'day1') {
      console.log("시작", e.target.value);
      setDateData({ ...dateData, day1: e.target.value })
    } else {
      console.log("끝", e.target.value);
      setDateData({ ...dateData, day2: e.target.value })
    }

  }

  // 기간 조회 버튼 클릭
  const reSdate = () => {
    console.log('조회기간', dateData);
  }

  const labels = charData.map(item => item.Loading.stock_shipping_des);
  const cntData = charData.map(item => item.total_loading_cnt);
  const total = cntData.reduce((acc, value) => acc + value, 0); // 데이터 배열의 합계 계산

  const percentData = cntData.map(value => ((value / total) * 100).toFixed(2)); // 각 데이터 항목의 퍼센트 계산

  // 차트 데이터
  Chart.register(ArcElement, Tooltip, Legend);


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




  useEffect(() => {

    // desDetail();
    desDetailTest();
  }, [])




  return (
    <div id='out_all'>

      <div id='des_top'>
        <span id="des_title">품목 관리</span>
        <TopBoard title={'출고 이력'} items={items} />
        <br />
        <span >기간 설정</span>
        <br />

        <input onChange={sDate} name='day1' type='date' id="aa" />
        <span style={{ margin: 20 }}>~</span>
        <input onChange={sDate} name='day2' type='date' id="bb" />
        <button onClick={reSdate} className="custom-btn btn-1">조회</button>
      </div>

      <div className="out_table">
        <table className="container">
          <thead>
            <tr>
              <th>
                <h1>제품명</h1>
              </th>
              <th>
                <h1>총 출고량</h1>
              </th>
              <th>
                <h1>마지막 출고일</h1>
              </th>
            </tr>
          </thead>
          {desData.map((whItem, whIdx) => (
            <React.Fragment key={whIdx}>
              {whItem.Racks.map((rackItem, rackIndex) => (
                <React.Fragment key={rackIndex}>
                  {rackItem.Loadings.map((item, idx) => (
                    <React.Fragment key={idx}>

                      <tbody>
                        <tr>
                          <td id='des_td' onClick={() => handleRowClick(idx, item.Stock.stock_name)}
                            className={rowOutTable[idx] ? 'selected' : ''} >{item.Stock.stock_name}</td>

                          <td>{item.total_loading_cnt}</td>
                          <td>{item.out_created_at.substring(0, 10)}</td>
                        </tr>
                      </tbody>
                      {rowOutTable[idx] && (
                        <tr id='doughnut_tr'>
                          <td id='doughnut_td' colSpan={3}>
                            <div id='des_table_fold' >
                              <div id='doughnut1'>
                                <div id='doughnut_1'> <Doughnut data={data} options={options} /></div>
                              </div>
                              <div id='des_div'>
                                <table id='des_table'>
                                  <tr>
                                    <td>배송지</td>
                                    <td>판매량</td>
                                  </tr>
                                  {charData.map((item, idx) => (
                                    <tr key={idx} >
                                      <td >{item.Loading.stock_shipping_des}</td>
                                      <td >{item.total_loading_cnt}</td>
                                    </tr>
                                  ))}

                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </table>

      </div>
    </div>
  )
}
export default OutDes;