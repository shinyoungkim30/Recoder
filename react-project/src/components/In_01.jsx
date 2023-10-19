import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import 'react-calendar/dist/Calendar.css';
import '../In_01.css'


function In_01({ inputItem,setInputItem }) {

  const [getList, setGetList] = useState([])

  const getInStock = async () => {
    const barCode = inputItem.map(item => item.title);

    try {
      const response = await axios.post('http://localhost:8000/in/create', { barCode });

      if (response.status === 200) {
        console.log('입고예정 리스트 가져오기 성공');
        console.log(response.data);
        setGetList(response.data)
        // setInputItem('')
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("데이터 출력 실패");
      }
    }
  }

  useEffect(() => {
    console.log("가져온 바코드", inputItem);
    getInStock();
  }, [inputItem])

  return (
    <div>In_01</div>
  )
}

export default In_01