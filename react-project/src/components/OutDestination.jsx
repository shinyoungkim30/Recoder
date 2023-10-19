import React, { useEffect, useState } from "react";
import Table_HJ from "./Table_HJ";
import axios from "axios";
import { useNavigate } from "react-router";
import TopBoard from "./Out/TopBoard";
import OutDesAdd from "./Out/OutDesAdd";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import "chartjs-plugin-datalabels";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import DatePicker from './Stock/DatePicker'
import StockDropDown from './Stock/StockDropDown'

function OutDestination({selectWhSeq}) {
  const [value, setValue] = useState('5개씩 보기');

  const id = "smart";
  const wh_seq = 1;
  const com_seq = 1;

  Chart.register(ArcElement);
  //  출고품 리스트 관리
  const [desData, setDesData] = useState([]);

  // 테이블 sort상태 관리
  const [isSort, setIsSort] = useState(true);

  // 출고품 리스트 가져와서 페이지 렌더링 하기
  const desNameList = async () => {
    const userData = {
      com_seq: com_seq,
      wh_seq: wh_seq,
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/out/des/name",
        userData
      );
      if (response.status === 200) {
        console.log("출고항목", response.data);
        setDesData(response.data);
      }
    } catch (error) {
      console.log("출고항목 가져오기 실패", error);
    }
  };

  const labels = "빨강";
  const percentData = 100;

  const title = "";
  const items = [];

  //tb 목록
  const columns = [
    {
      title: "제품명",
      dataIndex: "stock_name",
      key: "stock_name",
      render: (text, data, idx) => (
        <span style={{ color: "darkgray" }}>{text}</span>
      ),
    },
    {
      title: "출고량",
      dataIndex: "total_loading_cnt",
      key: "total_loading_cnt",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
      sorter: (a, b) => a.total_loading_cnt - b.total_loading_cnt, // 큰 순서대로 정렬
      sortOrder: isSort ? "descend" : "ascend", // isSort 값에 따라 정렬 방향 변경
      onHeaderCell: () => ({
        onClick: () => setIsSort(!isSort), // 클릭 시 정렬 방향 변경
      }),
    },
    {
      title: "최근 출고일",
      dataIndex: "out_created_at",
      key: "out_created_at",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
  ];

  const data1 = desData.map((item) => item.Racks);
  const data2 = data1.map((racks) => racks.map((rack) => rack.Loadings));
  const data3 = data2.flat(2); // Loadings 배열을 평탄화

  const data = data3
    .map((loading, idx) => ({
      key: idx + 1,
      stock_name: loading.Stock.stock_name,
      total_loading_cnt: loading.total_loading_cnt,
      out_created_at: loading.out_created_at.substring(0, 10),
      description: <OutDesAdd wSeq={wh_seq} sName={loading.Stock.stock_name} />,
    }))
    .flat(1);

  useEffect(() => {
    desNameList();
  }, [isSort]);

  useEffect(() => {
    desNameList();
  }, [isSort]);

  return (
    <div className="out-container">
      <div className="out-header">
        <span>출고품 관리</span>
      </div>
      <div id='stock-filter'>
        {/* <DatePicker />
        <StockDropDown value={ value } setValue={ setValue } /> */}
      </div>
      <Table_HJ
        // rowKey="stock_name"
        // onRow={(record, rowIdx) => ({
        // })}
        columns={columns}
        data={data}
      />
      {/* <div id="in_comtainer">
        <div id="in01_top" style={{ height: 200 }}>
          <TopBoard title={title} items={items} />
        </div>
        <div id="in01_bottom"></div>
      </div> */}
    </div>
  );
}

export default OutDestination;
