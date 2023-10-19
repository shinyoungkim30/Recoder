import React, { useEffect, useState } from "react";
import Table_HJ from "./Table_HJ";
import axios from "axios";
import { useNavigate } from "react-router";
import "../css/in01.css";
import DatePicker from './Stock/DatePicker'
import StockDropDown from './Stock/StockDropDown'

function In_HJ({selectWhSeq,setSelectWhSeq}) {
  const [value, setValue] = useState('5개씩 보기');

  const nav = useNavigate();

  // 로그인 데이터 정보
  const id = "smart";
  const wh_seq = 1;
  const com_seq = 1;

  const [bcData, setBcData] = useState([]);

  // 저장한 바코드 리스트 서버로 보내기
  const getBcList = () => {
    console.log("페이지전환");
    // const barCode = inputItem.map((item) => item.title);
    // const barCode = ["001", "002", "003"];
    const inData = {
      com_seq: com_seq,
    };
    axios
      .post("http://localhost:8000/in/create", inData)
      .then((response) => {
        console.log("바코드찍힌 리스트 가져오기 성공", response.data);
        setBcData(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.log(error);
        }
        // 오류 처리
      });
  };

  const handleBarcode = (record) => {
    console.log("클릭", record);
    const pickBc = {
      barcode: record.stock_barcode,
      com_seq: com_seq,
      stock_seq: record.stock_seq,
    };
    axios
      .post("http://localhost:8000/in/send/loading", pickBc)
      .then((res) => {
        console.log(res.data[0]);
        if (res.data[0] > 0) {
          console.log("새로고침");
          window.location.href = "http://localhost:3000/in/create";
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const title = "입고예정";
  const items = [];
  //tb 목록
  const columns = [
    {
      title: "ID",
      dataIndex: "stock_seq",
      key: "stock_seq",
      render: (text, data, idx) => (
        <span style={{ color: "darkgray" }}>{text}</span>
      ),
    },
    {
      title: "제품명",
      dataIndex: "stock_name",
      key: "stock_name",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
    {
      title: "종류",
      dataIndex: "stock_kind",
      key: "stock_kind",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
    {
      title: "가격",
      dataIndex: "stock_price",
      key: "stock_price",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
    {
      title: "거래처",
      dataIndex: "cl_seq",
      key: "cl_seq",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
    {
      title: "바코드",
      dataIndex: "stock_barcode",
      key: "stock_barcode",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
    {
      title: "유통기한",
      dataIndex: "stock_expired",
      key: "stock_expired",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
    {
      title: "수량",
      dataIndex: "stock_bal",
      key: "stock_bal",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
    {
      title: "등록",
      dataIndex: "in_btn",
      key: "in_btn",
      render: (text, record) => (
        <button
          style={{
            color: "black",
            backgroundColor: "white",
            width: 60,
            fontSize: 13,
            height: 32,
            paddingRight: 14,
            paddingLeft: 14,
            borderRadius: 6,
            borderColor: "darkgray",
          }}
          onClick={() => handleBarcode(record)} // 여기서 함수를 호출하지 않고 클릭 시 실행되도록 콜백으로 전달합니다.
        >
          등록
        </button>
      ),
    },
  ];

  const data = bcData.map((item, idx) => ({
    key: idx + 1,
    stock_seq: item.stock_seq,
    stock_name: item.Stock?.stock_name,
    stock_kind: item.Stock?.stock_kind,
    stock_price: item.Stock?.stock_price,
    cl_seq: item.Stock?.cl_seq,
    stock_barcode: item.Stock?.stock_barcode,
    stock_expired: item.Stock?.stock_expired.substring(0, 10),
    stock_bal: item.Stock?.stock_balance_cnt,
    in_btn: "등록",
  }));

  // const data = [

  //     {
  //         key: 1,
  //         stock_id: '1',
  //         stock_name: 'Product 1',
  //         stock_kind: 'Type 1',
  //         stock_price: 10.99,
  //         cl_seq: 'Company A',
  //         stock_barcode: '123456',
  //         stock_expired: '2023-09-09',
  //         stock_bal: 100,
  //         in_btn: '등록',
  //         description: 'My name is John Brown'
  //     },
  //     {
  //         key: 2,
  //         stock_id: '2',
  //         stock_name: 'Product 1',
  //         stock_kind: 'Type 1',
  //         stock_price: 10.99,
  //         cl_seq: 'Company A',
  //         stock_barcode: '123456',
  //         stock_expired: '2023-09-09',
  //         stock_bal: 100,
  //         in_btn: '등록',
  //         description: 'My name is John Brown'
  //     },
  //     {
  //         key: 3,
  //         stock_id: '3',
  //         stock_name: 'Product 1',
  //         stock_kind: 'Type 1',
  //         stock_price: 10.99,
  //         cl_seq: 'Company A',
  //         stock_barcode: '123456',
  //         stock_expired: '2023-09-09',
  //         stock_bal: 100,
  //         in_btn: '등록',
  //         description: 'My name is John Brown'
  //     },
  //     {
  //         key: 4,
  //         stock_id: '4',
  //         stock_name: 'Product 1',
  //         stock_kind: 'Type 1',
  //         stock_price: 10.99,
  //         cl_seq: 'Company A',
  //         stock_barcode: '123456',
  //         stock_expired: '2023-09-09',
  //         stock_bal: 100,
  //         in_btn: '등록',
  //         description: 'My name is John Brown'
  //     },
  //     {
  //         key: 5,
  //         stock_id: '5',
  //         stock_name: 'Product 1',
  //         stock_kind: 'Type 1',
  //         stock_price: 10.99,
  //         cl_seq: 'Company A',
  //         stock_barcode: '123456',
  //         stock_expired: '2023-09-09',
  //         stock_bal: 100,
  //         in_btn: '등록',
  //         description: 'My name is John Brown'
  //     },
  //     {
  //         key: 6,
  //         stock_id: '6',
  //         stock_name: 'Product 1',
  //         stock_kind: 'Type 1',
  //         stock_price: 10.99,
  //         cl_seq: 'Company A',
  //         stock_barcode: '123456',
  //         stock_expired: '2023-09-09',
  //         stock_bal: 100,
  //         in_btn: '등록',
  //         description: 'My name is John Brown'
  //     },
  // ];

  // useEffect(() => {
  //     const data = dataSet();
  //     console.log('data', data);
  //   }, [getBcList]);

  useEffect(() => {
    getBcList();
  }, []);

  return (
    <div id="in-container">
      <div id="in-header">
        <span>입고 예정</span>
      </div>
      <div id='stock-filter'>
        {/* <DatePicker />
        <StockDropDown value={ value } setValue={ setValue } /> */}
      </div>
      <div>
        <Table_HJ columns={columns} data={data} />
      </div>
    </div>
  );
}

export default In_HJ;
