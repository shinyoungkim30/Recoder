import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/warehouse.css";
import axios from "axios";
import WareCardItem2 from "./Warehouse/WareCardItem2";
import AddIcon from '@mui/icons-material/Add';

const WareManageSelect = ({ comSeq ,selectWhSeq,setSelectWhSeq}) => {
  const nav = useNavigate();
  const [warehouseList, setWarehouseList] = useState([]);
  const [testlist, setTestlist] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/ware/manage/${comSeq}`)
      .then((res) => {
        setWarehouseList(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div id="ware-container">
      <div id="ware-header">
        <span>창고 선택</span>
      </div>
      <div id="ware-create-button">
        <Link to={'/ware/create'}>
          <AddIcon />
          <button>창고 생성</button>
        </Link>
      </div>
      <div id="ware-item-box">
        {warehouseList.length > 0
          ? warehouseList.map((item, index) => (
              <WareCardItem2 selectWhSeq={selectWhSeq} setSelectWhSeq={setSelectWhSeq}
                key={index}
                wh_name={item.wh_name}
                wh_seq={item.wh_seq}
                index={index}
              ></WareCardItem2>
            ))
          : "창고가 없습니다"}
      </div>
    </div>
  );
};

export default WareManageSelect;