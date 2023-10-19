import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import App from "../../three/previewWarehouse";
import { Link, useNavigate} from "react-router-dom";

const WareCardItem2 = ({
  index,
  wh_name,
  wh_seq,
  selectWhSeq,
  setSelectWhSeq,
  wareName,setWareName, 
  racks,
}) => {
  const [stockName, setStockName] = useState(
    racks[0]?.Loadings[0]?.Stock.stock_name
  );
  const [stockNum, setStockNum] = useState(0);
  const [stockPercent, setStockPercent] = useState(0);

  const [warehouseInfo, setWarehouseInfo] = useState(null);
  const [warehouseWidth, setWarehouseWidth] = useState(null);
  const [warehouseLength, setWarehouseLength] = useState(null);
  const [rackWidth, setRackWidth] = useState(1);
  const [rackLength, setRackLength] = useState(1);
  const [rackFloor, setRackFloor] = useState(1);

  const nav = useNavigate();

  const appInstance = useRef(null);

  const selectWh = () => {
    console.log("창고선택클릭", wh_seq);
    setSelectWhSeq(wh_seq);
    setWareName(wh_name)
    nav("/main");
  };

  // 보유 상품 갯수 구하기
  const getStockCnt = () => {
    let stockCnt = 0;
    for (let i = 0; i < racks.length; i++) {
      stockCnt += racks[i]?.Loadings.length;
    }
    setStockNum(stockCnt);
  };

  // 적재율 구하기
  const getRackPercent = () => {
    let totalPercent = 0;
    let usePercent = 0;
    for (let i = 0; i < racks.length; i++) {
      totalPercent += parseInt(racks[i]?.rack_length) * parseInt(racks[i]?.rack_width) * parseInt(racks[0]?.rack_floor);
      usePercent += racks[i]?.Loadings.length;
    }
    setStockPercent(parseInt((usePercent / totalPercent) * 100));
  };

  // 화면 렌더링 될 때
  useEffect(() => {
    getStockCnt();
    getRackPercent();
  }, []);

  // wh_seq를 가지고 해당 창고 정보 불러오기
  useEffect(() => {
    axios
      .get(`http://localhost:8000/warehouse/${wh_seq}`)
      .then((res) => {
        setWarehouseInfo(res.data);
        // console.log(res.data);
        // console.log(parseInt(res.data.wh_width));
        setWarehouseWidth(parseInt(res.data.wh_width));
        setWarehouseLength(parseInt(res.data.wh_length));
        // console.log("warehouseWidth 값", warehouseWidth);
        // console.log("warehouseLength 값", warehouseLength);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [wh_seq]);

  useEffect(() => {
    if (warehouseWidth !== null && warehouseLength !== null) {
      new App(warehouseWidth, warehouseLength, rackWidth, rackLength, index);
    }
  }, [warehouseWidth, warehouseLength]);

  return (
    <div id="ware-cardlist-item">
      <div id="ware-preview">
        <div>
          <div
            id={`webgl-container-${index}`}
            style={{ position: "relative" }}
          ></div>
        </div>
      </div>
      <div id="ware-detail">
        <div>
          <span>창고 이름 | </span>
          <Link to={`/warehouse/${wh_seq}`}>{wh_name}</Link>
        </div>
        <div>
          <span>보유 상품 | </span>
          <span>
            {stockName} 외 {stockNum}종
          </span>
        </div>
        { !stockPercent ? 
          <div>적재율 | 0%</div> :
          <div>적재율 | {stockPercent}%</div> }
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <div className="ware-select-button">
            <button onClick={selectWh}>창고선택</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WareCardItem2;
