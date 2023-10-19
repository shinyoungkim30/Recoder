import React, { useEffect, useState } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import WareTable from "./WareTable";
import axios from 'axios'
import { Link } from 'react-router-dom'

const WareList = ({ comSeq }) => {
  const [warehouseList, setWarehouseList] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/ware/shortList/${comSeq}`)
    .then((res) => {
      console.log(res.data);
      setWarehouseList(res.data);
    })
    .catch((err) => {
      console.error(err);
    })
  }, [])

  const columns = [
    {
      title: "창고명",
      dataIndex: "wh_name",
      key: "wh_name",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
    {
      title: "",
      dataIndex: "wh_seq",
      key: "wh_seq",
      render: (record) => (
        <Link to={`/warehouse/${record}`}><button
          style={{
            background: "transparent",
            border: "none",
            boxShadow: "0 0 0 1px #e3e5e8, 0 1px 2px 0 rgba(0,0,0,.04)",
            borderRadius: 4,
            padding: 4,
          }}
        >
          창고 보기
        </button></Link>
      ),
    },
  ];

  const data = warehouseList.map((item, idx) => ({
    key: idx + 1,
    wh_name: item.wh_name,
    wh_seq: item.wh_seq
  }));  

  return (
    <div id="dashboard-warelist">
      <div id="warelist-header" className="dashboard-item-header">
        <span>나의 창고</span>
        <Link to="/ware/manage" style={{ color: "black" }}>
          <OpenInNewIcon />
        </Link>
      </div>
      <div>
        <WareTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default WareList;
