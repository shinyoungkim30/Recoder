import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
// import App from '../three/show_warehouse'
import App from "../three/test_show_warehouse";
import axios from "axios";
import "../css/wareDetail.css";

const Warehouse = () => {
	let { wh_seq } = useParams();
	//console.log("wh_seq 값", wh_seq);

	// const [warehouseInfo, setWarehouseInfo] = useState(null);



	// 변수
  // const [selectedName, setSelectedName] = useState('')
  // const [selectedPrice, setSelectedPrice] = useState('')
  // const [selectedIndate, setSelectedIndate] = useState('')
	const [warehouseWidth, setWarehouseWidth] = useState(null);
	const [warehouseLength, setWarehouseLength] = useState(null);
	const [rackWidth, setRackWidth] = useState(null);
	const [rackLength, setRackLength] = useState(null);
	const [rackFloor, setRackFloor] = useState(null);
	const [rackX, setRackX] = useState(null);
	const [rackZ, setRackZ] = useState(null);

	const [warehouseData, setWarehouseData] = useState({});
  const [selectedName, setSelectedName] = useState(""); // 이름
  const [selectedPrice, setSelectedPrice] = useState(0); // 가격
  const [selectedIndate, setSelectedIndate] = useState(0); // 입고일


	const [canAddItem, setCanAddItem] = useState(false); // 짐 추가 가능 여부
	const [canAddRack, setCanAddRack] = useState(false); // 선반 추가 가능 여부
	const [canMoveItem, setCanMoveItem] = useState(false);

	const appInstance = useRef(null);

	// useEffect -> wh_seq
	useEffect(() => {
		Promise.all([
			axios.get(`http://localhost:8000/warehouse/${wh_seq}`),
			axios.get(`http://localhost:8000/rack/${wh_seq}`),
			// axios.get(`http://localhost:8000/stock/${wh_seq}`),
			// axios.get(`http://localhost:8000/stock/show/${comSeq}`)
			axios.get(`http://localhost:8000/stock/show/${wh_seq}`)
		])
			.then(([warehouseRes, rackRes, stockRes]) => {
				console.log("랙 데이터 배열", rackRes.data);
				const racks = rackRes.data.map((rack) => ({
					rackFloor: parseInt(rack.rack_floor),
					rackWidth: parseInt(rack.rack_width),
					rackLength: parseInt(rack.rack_length),
					rackX: parseInt(rack.rack_x),
					rackZ: parseInt(rack.rack_z),
          seq: rack.rack_seq,
				}));

				console.log("warehouse", warehouseRes.data.wh_width)
				console.log("racks 찍어보자", racks);

				console.log("상품 데이터 배열", stockRes);

        console.log("stockRes", stockRes.data[0]);
        console.log("뭘가져오는지 보자", stockRes.data[0].Racks[0].Loadings);
        console.log("뭘가져오는지 보자", stockRes.data[0].Racks[0].Loadings[0].Stock);

				console.log("true/false", Array.isArray(stockRes.data[0].Racks[0].Loadings));


        // const stocks = stockRes.data[0].Racks[27].Loadings.map(stock => {
        //   // const [pos1, pos2] = stock.loading_position.split(',').map(Number);
        //   const [pos1, pos2] = stock.loading_position ? stock.loading_position.split(',').map(Number) : [0, 0];
        //   const stockName = stock.Stock.stock_name
        //   const stockPrice = stock.Stock.stock_price
        //   const stockIndate = stock.created_at
        //   return {
        //     loadingFloor: stock.loading_floor,
        //     loadingPosition1: pos1,
        //     loadingPosition2: pos2,
        //     stockName: stockName,
        //     stockPrice: stockPrice,
        //     stockIndate: stockIndate
        //   }
        // })

        // 1006수정
        const stocks = stockRes.data[0].Racks.flatMap(rack => {
          return rack.Loadings.map(stock => {
            const [pos1, pos2] = stock.loading_position ? stock.loading_position.split(',').map(Number) : [0, 0];
            const stockName = stock.Stock.stock_name;
            const stockPrice = stock.Stock.stock_price;
            const stockIndate = stock.created_at;
            return {
              loadingFloor: rack.rack_floor-1,
              loadingPosition1: pos1,
              loadingPosition2: pos2,
              stockName: stockName,
              stockPrice: stockPrice,
              stockIndate: stockIndate
            };
          });
        });

				// console.log("stock 가져오니라", stocks);

				setWarehouseData({
					warehouseWidth: parseInt(warehouseRes.data.wh_width),
					warehouseLength: parseInt(warehouseRes.data.wh_length),
					racks,
					stocks
				});

				console.log("stock 가져오니라", stocks);

			})
			.catch((error) => {
				console.log(error);
			});
	}, [wh_seq]);

	// useEffect -> warehouseData
	useEffect(() => {
		console.log("지금!");
		if (Object.keys(warehouseData).length >= 1) {
			console.log("지금!222222222");
			console.log(warehouseData);
			console.log(Object.keys(warehouseData));
			console.log(`warehouseData ${JSON.stringify(warehouseData)}`)

			appInstance.current = new App(
				warehouseData.warehouseWidth,
				warehouseData.warehouseLength,
				warehouseData.racks,
				warehouseData.stocks,
			);
		}
		else {
			console.log("error");
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
		}); // state일때의 state 콜백

		// setCanAddItem(!canAddItem);
		// setCanAddRack(!canAddItem);
		console.log("짐 추가 클릭");
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

  return (
    <div className="warehouse1">
      <div id="waredetail-container" onClick={() => {
        setSelectedName(localStorage.getItem("selectedMesh_name") == undefined ? "" : localStorage.getItem("selectedMesh_name"))
        setSelectedPrice(localStorage.getItem("selectedMesh_price") == undefined ? "-" : localStorage.getItem("selectedMesh_price"))
        setSelectedIndate(localStorage.getItem("selectedMesh_indate") == undefined ? "-" : localStorage.getItem("selectedMesh_indate"))
      }} />

      <div className="button-container">
        <button className='stock2'type="button" onClick={addLoading}>
          {canAddItem ? "짐 추가중" : "짐 추가"}
        </button>
        <button className='stock2' type="button"> 선반 추가 </button>
        <button className='stock2' type="button" onClick={moveLoading}>
          {canMoveItem ? "짐 이동중" : "짐 이동"}
        </button>
      </div>

      <div className="modal-top">
        <p>제품명 : {selectedName}</p>
        <p>가격 : {selectedPrice}</p>
        <p>입고일 : {selectedIndate}</p>

      </div>

		</div>
	);
};
export default Warehouse;
