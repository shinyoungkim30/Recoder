import React, { useEffect, useState } from 'react'
import StockDataList from './Stock/StockDataList'
import DatePicker from './Stock/DatePicker'
import StockDropDown from './Stock/StockDropDown'
import axios from 'axios'
import { Pagination } from 'antd'

const StockSelect = ({ comSeq }) => {

  const [stockList, setStockList] = useState([])
  const [stockCount, setStockCount] = useState(0)
  const [value, setValue] = useState('5개씩 보기');
  const [intValue, setIntValue] = useState(5)
  const [pageNum, setPageNum] = useState(1)

  const fetchStockList = () => {
    axios.get(`http://localhost:8000/stock/${comSeq}/${intValue}/${pageNum}`)
    .then((res) => {
      setStockList(res.data)
    })
    .catch((err) => {
      console.error(err);
    })    
  }

  useEffect(() => {
    axios.get(`http://localhost:8000/stock/${comSeq}`)
    .then((res) => {
      setStockCount(res.data.count)
      fetchStockList()      
    })
    .catch((err) => {
      console.error(err);
    })
  }, [])

  useEffect(() => {
    if (value === '5개씩 보기') {
      setIntValue(5)
    } else if (value === '50개씩 보기') {
      setIntValue(50)
    } else if (value === '100개씩 보기') {
      setIntValue(100)
    } else {
      setIntValue(500)
    }
  }, [value])

  const handlePageNumberClick = (page) => {
    setPageNum(page)    
  }

  useEffect(() => {
    fetchStockList() 
  }, [pageNum, intValue])

  return (
    <div id='stock-container'>
      <div id='stock-header'>
        <span>재고</span>
      </div>
      <div id='stock-filter'>
        <DatePicker />
        <StockDropDown value={ value } setValue={ setValue } />
      </div>
      <StockDataList stockList={ stockList } />
      <Pagination
        style={{
          textAlign: 'center',
          marginTop: '12px'
        }}
        current={pageNum}
        total={stockCount}
        pageSize={intValue}
        onChange={handlePageNumberClick}
      />
    </div>
  )
}

export default StockSelect