import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import App from "../three/inWare";
import axios from "axios";
import "../css/wareDetail.css";
import io from 'socket.io-client'

const Warehouse = () => {
  let { wh_seq, stock_seq } = useParams();

  const nav = useNavigate(); 

  const inSocket = io.connect('http://13.124.126.209:80/in', {
    path: '/socket.io'
  });
  inSocket.on('updateIn', (data) => {
    if (data === '입고완료') {
      if (updateIn) {
        setUpdateIn(false)
      } else {
        setUpdateIn(true)
      }
    }
  });
  const outSocket = io.connect('http://13.124.126.209:80/out', {
    path: '/socket.io'
  });
  outSocket.on('updateOut', (data) => {
    if (data === '출고완료') {
      if (updateOut) {
        setUpdateOut(false)
      } else {
        setUpdateOut(true)
      }
    }
  });

  // 변수
  const [updateIn, setUpdateIn] = useState(true)
  const [updateOut, setUpdateOut] = useState(true)
  const [stockName, setStockName] = useState("");
  const [warehouseWidth, setWarehouseWidth] = useState(null);
  const [warehouseLength, setWarehouseLength] = useState(null);
  const [rackWidth, setRackWidth] = useState(null);
  const [rackLength, setRackLength] = useState(null);
  const [rackFloor, setRackFloor] = useState(null);
  const [rackX, setRackX] = useState(null);
  const [rackZ, setRackZ] = useState(null);

  const [itemX, setItemX] = useState(0);
  const [itemY, setItemY] = useState(0);
  const [itemZ, setItemZ] = useState(0);
  const [rack_seq, setRack_seq] = useState(0);
  const [clickRackSeq, setClickRackSeq] = useState({
    rack_seq: rack_seq
  });
  const [getItem, setGetItem] = useState({
    itemX: itemX,
    itemY: itemY,
    itemZ: itemZ,
  });
  const [strGetItem, setStrGetItem] = useState("");

  const [warehouseData, setWarehouseData] = useState({});

  const [canAddItem, setCanAddItem] = useState(false); // 짐 추가 가능 여부
  const [canAddRack, setCanAddRack] = useState(false); // 선반 추가 가능 여부
  const [canMoveItem, setCanMoveItem] = useState(false);

  const appInstance = useRef(null);

  useEffect(() => {
    Promise.all([
      axios.get(`http://13.124.126.209:80/warehouse/${wh_seq}`),
      axios.get(`http://13.124.126.209:80/rack/${wh_seq}`),
      axios.get(`http://13.124.126.209:80/stock/show/${wh_seq}`),
    ])
      .then(([warehouseRes, rackRes, stockRes]) => {
        const racks = rackRes.data.map((rack) => ({
          rackFloor: parseInt(rack.rack_floor),
          rackWidth: parseInt(rack.rack_width),
          rackLength: parseInt(rack.rack_length),
          rackX: parseInt(rack.rack_x),
          rackZ: parseInt(rack.rack_z),
          seq: rack.rack_seq,
        }));


  // 1006수정
  const stocks = stockRes.data[0].Racks.flatMap(rack => {
    return rack.Loadings.map(stock => {
      const [pos1, pos2] = stock.loading_position ? stock.loading_position.split(',').map(Number) : [0, 0];
      // const stockName = stock.Stock.stock_name;
      // const stockPrice = stock.Stock.stock_price;
      // const stockIndate = stock.created_at;
      return {
        loadingFloor: rack.rack_floor-1,
        loadingPosition1: pos1,
        loadingPosition2: pos2,
        // stockName: stockName,
        // stockPrice: stockPrice,
        // stockIndate: stockIndate
      };
    });
  });

        setWarehouseData({
          warehouseWidth: parseInt(warehouseRes.data.wh_width),
          warehouseLength: parseInt(warehouseRes.data.wh_length),
          racks,
          stocks,
          getItem,
          clickRackSeq,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [wh_seq, updateIn, updateOut]);

  // useEffect -> warehouseData
  useEffect(() => {
    if (Object.keys(warehouseData).length > 1) {

      appInstance.current = new App(
        warehouseData.warehouseWidth,
        warehouseData.warehouseLength,
        warehouseData.racks,
        warehouseData.stocks,
        warehouseData.getItem,
        warehouseData.clickRackSeq
      );
    } else {
      console.error("error");
    }
  }, [warehouseData]);

  function addLoading() {
    setCanAddItem((prevState) => {
      // 여기서 prevState를 사용하여 이전 상태를 기반으로 새로운 상태를 계산
      const newCanAddItem = !prevState;
      if (!prevState) {
        setCanAddRack(false);
        setCanMoveItem(false);
      }

      appInstance.current._setupMouseEvents(
        newCanAddItem,
        canAddRack,
        canMoveItem
      );
      return newCanAddItem; // return으로 canAddItem설정
    });
  }

  function moveLoading() {
    setCanMoveItem((prevState) => {
      const newCanMoveItem = !prevState;
      if (!prevState) {
        setCanAddItem(false);
        setCanAddRack(false);
      }

      appInstance.current._setupMouseEvents(
        canAddItem,
        canAddRack,
        newCanMoveItem
      );
      return newCanMoveItem;
    });
  }

  // 입고페이지에서 선택한 상품 정보 요청
  useEffect(() => {
    axios
      .get(`http://13.124.126.209:80/stock/ware/${stock_seq}`)
      .then((res) => {
        setStockName(res.data.stock_name);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const inPositionClick = () => {
    let positionData = {
      stock_seq: stock_seq,
      x: getItem.itemX,
      z: getItem.itemZ,
      y: getItem.itemY,
      rack_seq: clickRackSeq.rack_seq
    }
    if (clickRackSeq.rack_seq !== 0) {
      axios.patch('http://13.124.126.209:80/in/position', positionData)
      .then((res) => {
        if (res.data === 'ok') {
          nav('/in/loading')
        } else {
          alert('입고 실패! 다시 시도해주세요')
        }
      })
      .catch((err) => {
        console.error(err);
      })
    }
  }

  return (
    <div className="warehouse1">
      <div id="waredetail-container" />
      <div className="button-container">
        <button className='stock_btn'type="button" onClick={addLoading}>
          {canAddItem ? "짐 추가중" : "짐 추가"}
        </button>
        <button className='stock_btn' type="button"> 선반 추가 </button>
        <button className='stock_btn' type="button" onClick={moveLoading}>
          {canMoveItem ? "짐 이동중" : "짐 이동"}
        </button>
        <div id="info">
          <strong>입고할 상품 정보</strong> <br />
          <span>상품 ID | {stock_seq}</span> <br />
          <span>상품명 | {stockName}</span> <br />
          <button style={{width:100,backgroundColor:"white"}} className='stock_btn' onClick={inPositionClick}>위치 선택 완료</button>
        </div>
      </div>
    </div>
  );
};

export default Warehouse;
