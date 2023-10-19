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
      const response = await axios.post('http://13.124.126.209:80/in/create', { barCode });

      if (response.status === 200) {
        setGetList(response.data)
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("데이터 출력 실패");
      }
    }
  }

  useEffect(() => {
    getInStock();
  }, [inputItem])

  return (
    <div>In_01</div>
  )
}

export default In_01