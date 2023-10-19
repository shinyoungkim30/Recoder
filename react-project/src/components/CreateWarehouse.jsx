import React, { useState, useEffect, useRef, useCallback } from "react";
import "../Sidebar.css";
import "../App.css";
import App from "../three/create_warehouse";
// import '../three/02-geometry.css'
import axios from "axios";
import "../css/CreateWarehouse.css";
import { useNavigate } from "react-router";

// let meshArr = []
// const initApp = new App( 1, 1, 1, 1, meshArr);

const CreateWarehouse = ({ comSeq, newWareData }) => {
	const nav = useNavigate();
	
	// 전역 변수
	// let 메쉬배열 = []
	// 테스트
	let seq = 0;
	const [modalOpen, setModalOpen] = useState(false);
	const modalBackground = useRef();

	const [wh_seq, setWh_seq] = useState(null);
	const [warehouseWidth, setWarehouseWidth] = useState(null);
	const [warehouseLength, setWarehouseLength] = useState(null);
	const [메쉬배열, setTest] = useState([]);
	const [canAddLoading, setCanAddLoading] = useState(false)

	const [rackName, setRackName] = useState("");
	const [rackWidth, setRackWidth] = useState(1);
	const [rackLength, setRackLength] = useState(1);
	const [rackFloor, setRackFloor] = useState(1);

	const appInstance = useRef(null);

	const [rackX, setRackX] = useState(0);
	const [rackZ, setRackZ] = useState(0);
	const [rackRotateYN, setRackRotateYN] = useState("N");

	useEffect(() => {
		setWh_seq(newWareData.wh_seq);

		const warehouseData = newWareData;

		setWarehouseWidth(parseInt(localStorage.getItem("ware_width")));
		setWarehouseLength(parseInt(localStorage.getItem("ware_length")));
	}, []);

	/** useEffect -> [warehouseWidth, warehouseLength] */
	useEffect(() => {
		if (warehouseWidth !== null && warehouseLength !== null) {
			appInstance.current = new App(
				warehouseWidth,
				warehouseLength,
				rackWidth,
				rackLength,
				메쉬배열
			);
		}
	}, [warehouseWidth, warehouseLength])

	/** 선반을 만들어주는 함수 */
	const createRack = (e) => {
		setModalOpen(false);
		e.preventDefault();

		const rack_info = {
			rackName: rackName,
			rackWidth: rackWidth,
			rackLength: rackLength,
			rackFloor: rackFloor,
			rackX: rackX,
			rackZ: rackZ,
			rackRotateYN: rackRotateYN,
			wh_seq: wh_seq
		};

		// 로컬 스토리지에 rackFloor값 저장
		localStorage.setItem('rackFloor', rackFloor);

		if (appInstance.current) {
			appInstance.current.setupMouseEvents(
				rackWidth,
				rackLength,
				parseInt(localStorage.getItem('rackFloor')) // 로컬 스토리지에서 rackFloor값 불러오기!
			);
		}

		// let url = "http://localhost:8000/rack";
		// axios
		// .post(url, rack_info)
		// .then((res) => {
		// 	if (appInstance.current) {
		// 		appInstance.current.setupMouseEvents(
		// 			res.data.rack_width,
		// 			res.data.rack_length,
		// 			parseInt(localStorage.getItem('rackFloor')) // 로컬 스토리지에서 rackFloor값 불러오기!
		// 			);
		// 		}
		// })
		// .catch((error) => {
		// 	console.error(error);
		// });
	};

	const createLoading = (e) => {
		setCanAddLoading(!canAddLoading)

		if (appInstance.current) {
			appInstance.current.setupMouseEvents(
				rackWidth, rackLength, canAddLoading ? "loading" : "rack"
			)
		}
	}

	/** 선반 정보를 DB에 저장 */
	const completeRack = async (e) => {
		let result = []

		const warehouse_info = {
			name: localStorage.getItem("ware_name")==null || localStorage.getItem("ware_name")==undefined ? "" : localStorage.getItem("ware_name"), 
			width: localStorage.getItem("ware_width")==null || localStorage.getItem("ware_width")==undefined ? 1 : localStorage.getItem("ware_width"), 
			length: localStorage.getItem("ware_length")==null || localStorage.getItem("ware_length")==undefined ? 1 : localStorage.getItem("ware_length") , 
			comSeq: comSeq
		};
		let url = "http://localhost:8000/ware";
		var response = await axios.post(url, warehouse_info)
		seq = (await response).data.wh_seq;

		// .then((res) => {
		// 	// localStorage.setItem('warehouse', Json.stringify(res.data));
		// 	setNewWareData(res.data)
		// })
		// .catch((error) => {
		// 	console.error(error);
		// });

		let _메쉬배열 = [...메쉬배열]
		_메쉬배열.forEach(item => {
			result.push({
				rackName: item.name,
				rackWidth: item.userData.rackWidth,
				rackLength: item.userData.rackLength,
				rackFloor: item.userData.rackFloor,
				rackX: item.position.x,
				rackZ: item.position.z,
				rackRotateYN:rackRotateYN,
				wh_seq: seq
			})
		})

		url = "http://localhost:8000/rack";
		axios
		.post(url, result)
		.then((res) => {
			nav('/ware/manage')
		})
		.catch((error) => {
			console.error(error);
		});

	}

	function sizeRack() {
		localStorage.setItem("rack_width", rackWidth);
		localStorage.setItem("rack_length", rackLength);
		localStorage.setItem("rack_floor", rackFloor);
		localStorage.setItem("rack_name", rackName);
	}

	// 모달 창 끄는 부분
	const modalClose = (e) => {
		setModalOpen(false);
		e.preventDefault();

		const rack_info = {
			rackName: rackName,
			rackWidth: rackWidth,
			rackLength: rackLength,
			rackFloor: rackFloor,
			rackX: rackX,
			rackZ: rackZ,
			rackRotateYN: rackRotateYN,
			wh_seq: wh_seq,
		};
		// 로컬 스토리지에 rackFloor값 저장
		localStorage.setItem("rackFloor", rackFloor);

		let url = "http://localhost:8000/rack";
		axios
			.post(url, rack_info)
			.then((res) => {

				if (appInstance.current) {
					appInstance.current.setupMouseEvents(
						res.data.rack_width,
						res.data.rack_length,
						parseInt(localStorage.getItem("rackFloor")) // 로컬 스토리지에서 rackFloor값 불러오기!
					);
				}
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<div className="create-warehouse-container">
		   {/* <button>선반 생성</button> */}
		   <div className={"btn-wrapper"}>
			  <span>
				 <input type="text" style={{margin:5}} placeholder="선반의 이름"  value={rackName} onChange={(e) => {setRackName(e.target.value)}}/>
				 <input type="number" placeholder="선반의 가로 길이"  value={rackWidth} onChange={(e) => {
					   if(e.target.value <= 0) {
						  e.target.value = 1
					   }
					   
					   setRackWidth(e.target.value)}}/>
				 <input style={{margin:5}} type="number" placeholder="선반의 세로 길이" value={rackLength} onChange={(e) => {
					if(e.target.value <= 0) {
					   e.target.value = 1
					}
					setRackLength(e.target.value)
				 }} />
				 <input  type="number" placeholder="선반의 층수" value={rackFloor} onChange={(e) => {
					if (e.target.value <= 0) {
					   e.target.value = 1
					}
					setRackFloor(e.target.value)
				 }} />
				 <button
					style={{
  
					   color: "black",
					   margin: 5,
					   backgroundColor: "white",
					   width: 80,
					   fontSize: 15,
					   height: 30,
  
					   borderRadius: 6,
		   
					}}
					className={"modal-open-btn"} onClick={sizeRack}>
					선반 크기
				 </button>
				 {/* <button type="text" onClick={get배열}>배열 확인</button> */}
				 <button type="button" className={"modal-open-btn"} onClick={completeRack}>창고 생성</button>
			  </span>
  
			  {/* <button onClick={createLoading}> loading 추가 {canAddLoading?"O":"X"} </button>
			  <button onClick={get배열}>배열 확인</button> */}
		   </div>

			<div id="webgl-container" >
			</div> {/* id="webgl-container" */}
			{modalOpen && (
				<div className={"modal-container"} ref={modalBackground}
					onClick={(e) => {
						if (e.target === modalBackground.current) {
							setModalOpen(false);
						}
					}} >
					{/* 모달창 열었을때 나오는 부분 */}
					<div className={"modal-content"}>
						<div className="rack_create_all">
							<div className="rack_create_title">
								<h1 onClick={() => {  }}>선반생성</h1>
								<button
									className={"modal-close-btn"}
								>
									<img onClick={() => { setModalOpen(false) }}
										src='/img/X_icon.png'
										// alt='side-button'
										width='20px'
										height='23px' />
								</button>
							</div>

							<table>
								<tbody>
									<tr>
										<td className="rack_create_container">
											<form>
												<div className='rack_name_input_container'>
													{/* 아이디 */}
													<input
														type="text"
														placeholder='선반 이름을 입력해주세요.'
														autoFocus
														value={rackName}
														onChange={(e) => setRackName(e.target.value)}
													/>
												</div>

												{/* 가로 */}
												<div className="rack_width_input_container">
													<input
														type="number"
														placeholder="가로 길이를 입력해주세요."
														value={rackWidth}
														onChange={(e) => setRackWidth(e.target.value)}
													/>
												</div>

												{/* 세로 */}
												<div className="rack_length_input_container">
													<input
														type="number"
														placeholder="세로 길이를 입력해주세요."
														value={rackLength}
														onChange={(e) => setRackLength(e.target.value)}
													/>
												</div>

												{/* 높이 */}
												<div className="rack_floor_input_container">
													<input
														type="number"
														placeholder="층을 입력해주세요."
														value={rackFloor}
														onChange={(e) => setRackFloor(e.target.value)}
													/>
												</div>

												{/* 생성완료 버튼 */}
												<div className="rack_create_submit_button">
													<button
														style={{
															color: "black",
															backgroundColor: "white",
															width: 100,
															fontSize: 15,
															height: 40,
															paddingRight: 14,
															paddingLeft: 14,
															borderRadius: 6,
															borderColor: "darkgray",
														}}
														type="submit" className="create-button">
														생성하기
													</button>
												</div>
											</form>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)} {/* 모달창 끝 */}
		</div>
	);
};

export default CreateWarehouse;
