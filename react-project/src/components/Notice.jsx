import React, { useEffect, useState } from "react";
import Table_HJ from "./Table_HJ";
import axios from "axios";
import DatePicker from "./Stock/DatePicker";
import "../css/in01.css";
import StockDropDown from "./Stock/StockDropDown";
import "../css/notice.css";
import { Button, Modal } from "antd";
import { Pagination } from "antd";

function Notice({ selectWhSeq, setSelectWhSeq }) {
  const [stockCount, setStockCount] = useState(0);
  const [intValue, setIntValue] = useState(5);
  const [pageNum, setPageNum] = useState(1);
  const [value, setValue] = useState("5개씩 보기");
  const id = "smart";
  const wh_seq = 1;
  const com_seq = 1;
  const user_seq = 1;

  // 모달

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
    changeAlaram();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [changeName, setChangeName] = useState({
    user_seq: user_seq,
    stock_name: "",
    notice_content: "",
  });

  // 재고량 수정 버튼
  const changeCnt = (record, text) => {
    setIsModalOpen(true);

    console.log("크크킄클릭", record.stock_name);
    console.log("클릭된 아이템의text:", text);
    setChangeName({ ...changeName, stock_name: record.stock_name });
  };

  // 재고 데이터 조회
  const [cntData, setCntData] = useState([]);

  // 알람내용 조회
  const [alarm, setAlarm] = useState([]);

  const getNameList = () => {
    const userData = {
      com_seq: com_seq,
      wh_seq: wh_seq,
      user_seq: user_seq,
    };

    axios
      .all([
        axios.post("http://localhost:8000/notice/create", userData),
        axios.post("http://localhost:8000/notice/alarm", userData),
      ])
      .then(
        axios.spread((res1, res2) => {
          console.log("res1",res1.data);
          console.log('alarm',res2.data);
          setCntData(res1.data);
          setStockCount(res1.data.length);
          setAlarm(res2.data);
        })
      )
      .catch((err) => {
        console.error(err);
      });
  };

  // 알림내용 변경 함수
  const changeAlaram = () => {
    axios
      .post("http://localhost:8000/notice/change", changeName)
      .then((response) => {
        // 페이지 새로고침 해주기
        window.location.href = "http://localhost:3000/notice/create";
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.log(error);
        }
        // 오류 처리
      });
  };

  const flatAlarm = alarm.map((item) => ({
    notice_content: item.notice_content,
    stock_name: item.Stock.stock_name,
    notice_seq: item.notice_seq,
  }));

  const columns = [
    {
      title: "제품명",
      dataIndex: "stock_name",
      key: "stock_name",
      render: (text, idx) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
    {
      title: "적정 재고량",
      dataIndex: "stock_bal_cnt",
      key: "stock_bal_cnt",
      render: (text, data, record, idx) => {
        const matchingItem = flatAlarm.find(
          (item) => item.stock_name === data.stock_name
        );
        if (matchingItem) {
          const noticeContent = parseFloat(matchingItem.notice_content);
          const currentStock = parseFloat(data.stock_cnt);

          if (noticeContent > currentStock || data.stock_cnt == null) {
            return (
              <span style={{ color: "red" }}>
                {matchingItem.notice_content} (부족)
              </span>
            );
          } else if(noticeContent <= currentStock) {
            return (
              <span style={{ color: "darkgreen" }}>
                {matchingItem.notice_content} (적정)
              </span>
            );
          }
        } else {
          return (
            <span style={{ color: "darkgray" }}>설정 재고량이 없습니다</span>
          );
        }
      },
    },

    {
      title: "현재 재고량",
      dataIndex: "stock_cnt",
      key: "stock_cnt",
      render: (text, data) => {
        if (text == null) {
          return (<span style={{ color: "darkgray" }}>{0}</span>)
        } else {
          return (<span style={{ color: "darkgray" }}>{text}</span>)
        }
      }
    },
    {
      title: "수정",
      dataIndex: "stock_cnt",
      key: "stock_cnt",

      render: (text, record) => (
        <button
          onClick={() => changeCnt(record, text)}
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
        >
          수정
        </button>
      ),
    },
  ];

  const data = cntData.map((item, idx) => ({
    key: idx + 1,
    stock_name: item.Stock.stock_name,
    stock_cnt: item.total_loading_cnt,
  }));

  useEffect(() => {
    getNameList();
  }, []);

  return (
    <div id="stock-container">
      <div id="stock-header">
        <span>재고 수량 관리</span>
      </div>
      <div id="stock-filter">
        {/* <DatePicker />
        <StockDropDown value={value} setValue={setValue} /> */}
      </div>
      {/* <div id="notice_top">
        <div>재고 수량 관리</div>
        <span>제품명</span>
        <select type='select'>
          {cntData.map((item,idx)=>(
              <option key={idx} value = {item.Stock.stock_name}>
                {item.Stock.stock_name}
                </option>
          ))}
          </select><br/>
      </div> */}
      <div id="notice_table">
        <Table_HJ columns={columns} data={data} />
      </div>
      <Modal
        title="재고량 수정"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <input
            onChange={(e) => {
              setChangeName({ ...changeName, notice_content: e.target.value }); // value 속성으로 수정
            }}
            style={{ margin: 20, width: 150 }}
            type="text"
          ></input>
        </div>
      </Modal>
    </div>
  );
}

export default Notice;
