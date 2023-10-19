import React, { useEffect, useState } from 'react';
import '../css/WareCreate.css';
import axios from 'axios';
import { useNavigate } from 'react-router';
// import App from './CreateWarehouse';

const WareCreate = ({ comSeq, setNewWareData }) => {

    const [name, setName] = useState('');
    const [width, setWidth] = useState(0);
    const [length, setLength] = useState(0);
    const nav = useNavigate()

    /** useEffect -> [] */
	useEffect(()=>{
		localStorage.setItem("ware_name", null);
		localStorage.setItem("ware_width", null)
		localStorage.setItem("ware_length",null)
	},[])

	const handleSubmit = (e) => {
		e.preventDefault();
		
		// 로컬 스토리지에 rackFloor값 저장
		localStorage.setItem("ware_name", name)
		localStorage.setItem("ware_width", width)
		localStorage.setItem("ware_length",length)
		nav('/ware/createwarehouse')
		
		// const warehouse_info = { name: name, width: width, length: length, comSeq: comSeq};
		// let url = "http://localhost:8000/ware";
		// axios.post(url, warehouse_info)
		// .then((res) => {
		// 	console.log( "2번째로 넘겨줄 데이터", res.data);
		// 	// localStorage.setItem('warehouse', Json.stringify(res.data));
		// 	setNewWareData(res.data)
		// 	nav('/ware/createwarehouse')
		// })
		// .catch((error) => {
		// 	console.error(error);
		// });
	}


    return (
        <div id='toptop'>
        <div
         className="ware_create_all"
         >
            <div className='ware_create_title'>
                <h1>창고생성</h1>
            </div>
            <table >
                <tbody >
                    <tr>
                        <td className="ware_create_container">
                            <form onSubmit={handleSubmit}>
                                <div className='ware_name_input_container'>
                                    {/* 아이디 */}
                                    <input
                                        type="text"
                                        placeholder='창고 이름을 입력해주세요.'
                                        autoFocus
                                        value={name} 
                                        // onChange={handletext}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                {/* 가로 */}
                                <div className="width_input_container">
                                    <input
                                        type="number"
                                        placeholder='가로 길이를 입력해주세요.'
                                        value={width}  
                                        onChange={(e) => {
                                            if(e.target.value <= 0) {
                                                e.target.value = 1
                                            }
                                            setWidth(e.target.value)}}
                                    />
                                </div>

                                {/* 세로 */}
                                <div className="length_input_container">
                                    <input
                                        type="number"
                                        placeholder='세로 길이를 입력해주세요.'
                                        value={length}  
                                        onChange={(e) => {
                                            if(e.target.value <= 0) {
                                                e.target.value = 1
                                            }
                                            setLength(e.target.value)}}/>
                                </div>

                                {/* 생성완료 버튼 */}
                                <div className="ware_create_submit_button">
                                    <button 
                                    style={{
                                        margin:30,
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
                                    type="submit">
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
    );
}

export default WareCreate;