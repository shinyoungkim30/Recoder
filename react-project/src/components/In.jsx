import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';
import '../css/In.css'


// 폰트어썸
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const In = ({inputItem}) => {
	const [selectedCnt, setSelectedCnt] = useState(0);
	const [enableBtn, setEnableBtn] = useState(false);
	
	// 날짜..
	const currentDate = new Date();
	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
	const day = String(currentDate.getDate()).padStart(2, '0');
	const formattedData = `${year}-${month}-${day}`;



	function In() {
		// 테이블 클릭 ~ ??
	}
	
	useEffect(()=>{
		console.log(new Date())
		
		// checkbox요소 찾기
		// 이벤트 위임을 사용하여 모든 체크박스에 대한 이벤트 처리
		if(document.querySelector(".table-none tbody")) {
			document.querySelector(".table-none tbody").addEventListener('change', function(e) {
				// 주어진 선택자와 요소를 비교하여 요소가 해당 선택자와 일치하는지 확인하는 DOM 메서드.
				// ↓ 클릭한 요소가 input[type=check] 선택자와 일치하는지 비교하는 메소드
				if(e.target.matches("input[type=checkbox]")) {
					checkboxClicked(e);
				}
			})
		}
	}, [])

	// 
	useEffect(()=>{
		let enableButton = selectedCnt > 0; // 선택된 개수에 따라 버튼 활성화 여부 결정
		setEnableBtn(enableButton);
	}, [selectedCnt])

	// 체크 박스 클릭 이벤트
	function checkboxClicked(e) {
		// console.log(e.target.checked, ++cnt);
		let checkedCnt = 0;
		
		if(document.querySelector(".table-none tbody input[type=checkbox]")) {
			let checkboxes = document.querySelectorAll(".table-none tbody input[type=checkbox]")
			checkboxes.forEach(box => {
				if(box.checked) checkedCnt++; // box.checked를 사용하여 체크 상태 확인
			});

			setSelectedCnt(checkedCnt);
		}
	}


	// 제품 전체 선택 / 해제
	function checkAll(e) {
		let checkedCnt = 0;
		if(document.querySelector(".table-none tbody input[type=checkbox]")) {
			let checkboxes = document.querySelectorAll(".table-none tbody input[type=checkbox]");

			checkboxes.forEach(box => {
				box.checked = e.target.checked;
				//if(box.checked) checkedCnt++; // box.checked를 사용하여 체크 상태 확인
			})
			setSelectedCnt(e.target.checked ? checkboxes.length : 0);
		}
	}





	// 입고 함수
	function doIn() {
		// alert(`${selectedCnt}개 개수의 제품을 입고합니다.`)
		// console.log(`${selectedCnt}개 개수의 제품을 입고합니다.`)
		// 모달 라이브러리 띄우기
		// https://sweetalert.js.org/guides/
		swal(`${selectedCnt}개의 제품을 입고합니다.`);
	}

	//
	// 테스트 데이터 -> 서버 연결 되면 axios로 데이터 받아서 활용
	const testData = [
		{
			stockName: "A0001",
			type: "beverage",
			imgPath: "https://m.drice.co.kr/web/product/big/20200320/a6154c8b39c47e629e59e8008a39ef06.jpg",
			pos: {x: "0", y: "0", z: "0"},
			// {"x": "0", "y": "0", "z": "0"}
			price: 10000,
			quantity: "21",
			expirationDate: "2023-12-25",
		}, {
			stockName: "A0002",
			type: "beverage",
			imgPath: "https://m.drice.co.kr/web/product/big/20200320/a6154c8b39c47e629e59e8008a39ef06.jpg",
			pos: {"x": "1", "y": "1", "z": "0"},
			price: 5000,
			quantity: "24",
			expirationDate: "2023-12-25",
		}, {
			stockName: "A0003",
			type: "beverage",
			imgPath: "https://m.drice.co.kr/web/product/big/20200320/a6154c8b39c47e629e59e8008a39ef06.jpg",
			pos: {"x": "0", "y": "3", "z": "0"},
			price: 5000,
			quantity: "37",
			expirationDate: "2023-12-25",
		}, {
			stockName: "A0004",
			type: "beverage",
			imgPath: "https://m.drice.co.kr/web/product/big/20200320/a6154c8b39c47e629e59e8008a39ef06.jpg",
			pos: {"x": "0", "y": "0", "z": "5"},
			price: 105000,
			quantity: "50",
			expirationDate: "2023-12-25",
		}, {
			stockName: "A0004",
			type: "beverage",
			imgPath: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
			pos: {"x": "0", "y": "0", "z": "5"},
			price: 105000,
			quantity: "50",
			expirationDate: "2023-12-25",
		}, {
			stockName: "A0004",
			type: "beverage",
			imgPath: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
			pos: {"x": "0", "y": "0", "z": "5"},
			price: 105000,
			quantity: "50",
			expirationDate: "2023-12-25",
		}, {
			stockName: "A0004",
			type: "beverage",
			imgPath: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
			pos: {"x": "0", "y": "0", "z": "5"},
			price: 105000,
			quantity: "50",
			expirationDate: "2023-12-25",
		}, {
			stockName: "A0099",
			type: "beverage",
			imgPath: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
			pos: {"x": "0", "y": "0", "z": "5"},
			price: 105000,
			quantity: "50",
			expirationDate: "2023-12-25",
		}, {
			stockName: "A0099",
			type: "beverage",
			imgPath: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
			pos: {"x": "0", "y": "0", "z": "5"},
			price: 105000,
			quantity: "50",
			expirationDate: "2023-12-25",
		}
	];
	const [testDatas, setTestDatas] = useState(Array.from(testData));

	// 새로운 아이템
	function addItem() {
		const newItem = document.querySelector("#newItem");
		if(newItem) {
			let _pName = newItem.querySelector(":nth-child(2) input").value
			let _pType = newItem.querySelector(":nth-child(3) input").value
			let _img = newItem.querySelector(":nth-child(4) input[type=file]")
			let _poses = newItem.querySelectorAll(":nth-child(5) input[type=number]")
			let _pos = [];
			_poses.forEach( (pos, index) => {
				// console.log(pos.value)
				_pos[index] = pos.value
			})
			let _price = newItem.querySelector(":nth-child(6) input[type=number]").value
			let _quantity = newItem.querySelector(":nth-child(7) input[type=number]").value
			let _date = newItem.querySelector(":nth-child(8) input[type=date]").value

			// console.log(_pName, _pType, null, _pos, `${_price}원`, `${_quantity}개`, _date);
			// console.log(_date);
			console.log("_pos는 ", _pos);
			let _arr = [...testDatas]
			_arr.push({
				stockName: _pName,
				type: _pType,
				imgPath: "",
				pos: {x: _pos[0], y: _pos[1], z: _pos[2]},
				price: _price,
				quantity: _quantity,
				expirationDate: _date
			})
			setTestDatas(_arr);
			
		}
	}

	useEffect(()=>{
		console.log("바코드" , inputItem);
		// console.log("testDatas ==> ", testDatas)
	}, [inputItem])




	return (
		<div id='in_all'>
			<div id="in_top">
				<span id='in_title'>입고</span>
				<div id='in_input_container'>
					<input type="text" id='in_input' />
					<FontAwesomeIcon id="in_input_icon" icon={faMagnifyingGlass} />
					<select id='out_filter'>filter</select>
				</div>
			</div>
			{/* 테이블 */}
			<div className="in_table">
				<table className="in_table_container">
					<thead>
						<tr>
							<th>Column 1</th>
							<th>Column 2</th>
							<th>Column 3</th>
							<th>Column 4</th>
							<th>Column 5</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Cell 1</td>
							<td>Cell 2</td>
							<td>Cell 3</td>
							<td>Cell 4</td>
							<td>Cell 5</td>
						</tr>
					</tbody>
					


				</table>
			</div>

			{/* 인라인 고치기⬇⬇↓ */}
			<div style={{textAlign: "right"}} >
				{	
					selectedCnt &&
					selectedCnt > 0 ? 
					(<span><span>{ selectedCnt }개 선택 완료</span> <button type='button'>선택 삭제</button> </span>) : ""
				}
				<button id='btn_in' type='button' onClick={doIn} disabled={!enableBtn}>입고 완료</button>
			</div>

			<div className="table-none">
				<table>
					<thead>
						{/* 인라인 고치기⬇⬇↓ */}
						<tr >
							<th ><input type='checkbox' onChange={(e) => checkAll(e)}/></th>
							<th>상품명</th>
							<th>종류</th>
							<th>제품 이미지</th>
							<th>적재 위치</th>
							<th>제품 가격</th>
							<th>입고수량</th>
							<th>유통기한</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{testDatas.map((item, index)=>{
							return (
								<tr key={index}>
									<td><input type='checkbox' id='test1'/></td>
									<td>{item.stockName}</td>
									<td>{item.type}</td>
									<td><img src={item.imgPath}/></td>
									<td style={{justifyContent: "center"}}>
										x: {item.pos.x}<br/>
										y: {item.pos.y}<br/>
										z: {item.pos.z}
									</td>
									<td>{item.price}</td>
									<td>{item.quantity}</td>
									<td>{item.expirationDate}</td>
									<td>
										<button type='button' onClick={()=>{
												let _temp = [...testDatas];
												_temp.splice(index, 1);
												setTestDatas(_temp);
												console.log(_temp)}
											}> 삭제 </button>
									</td>
								</tr>
							)
						})}
						{/* 제품 추가 */}
						<tr id='newItem'> 
							<td></td>
							<td><input type='text'/></td>
							<td><input type='text'/></td>
							<td>
								<label htmlFor='ex_file'>이미지 업로드</label>
								<input type='file' id='ex_file'/>
							</td>
							<td >
								<span>
									<input type='number' placeholder='x' />
									<input type='number' placeholder='y' />
									<input type='number' placeholder='z' />
								</span>
							</td>
							<td><input type='number'/></td>
							<td><input type='number'/></td>
							<td><input type='date' defaultValue={formattedData}/></td>
							<td><button type='button' onClick={addItem}> 추가 </button></td>
						</tr>
					</tbody>
				</table>
			</div>
			{/* <img src='https://r77.cooltext.com/rendered/cooltext442599808940000.png' width={"30%"} style={{margin: "auto"}}></img> */}
			
		</div>  // div끝
	)
}

export default In