import React, { useEffect, useState } from "react";
import "../css/warehouse.css";
import axios from "axios";
import WareCardItem2 from "./Warehouse/WareCardItem2";
import { Link } from "react-router-dom";

const WareManageSelect = ({ comSeq, selectWhSeq, setSelectWhSeq,wareName,setWareName}) => {
  const [warehouseList, setWarehouseList] = useState([]);

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
    <div id="ware-container" style={{margin:30}}>
      <div id="ware-header"style={{marginBottom:30}}>
        <span>창고 선택</span>
      </div>
      <div id="ware-item-box">
        {warehouseList.length > 0 ? (
          warehouseList.map((item, index) => (
            <WareCardItem2
              selectWhSeq={selectWhSeq}
              setSelectWhSeq={setSelectWhSeq}
              wareName={wareName}setWareName={setWareName}
              key={index}
              wh_name={item.wh_name}
              wh_seq={item.wh_seq}
              index={index}
              racks={item.Racks}
            ></WareCardItem2>
          ))
        ) : (
          <div>
            창고가 없습니다 <br />
            <Link to={"/main"}>메인으로 이동</Link> <br />
            { !comSeq && <div>기업을 아직 등록하지 않으셨습니다.<br /><Link to={"/mypage"}>기업 등록하기</Link></div> }
          </div>
        )}
      </div>
    </div>
  );
};

export default WareManageSelect;