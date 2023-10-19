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



// ----------------------------------------------------------------------
// 이전 코드들
// ----------------------------------------------------------------------
// import React, { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
// import { Link, useNavigate } from 'react-router-dom'
// import axios from "axios";

// const StockSelect = () => {
//   const [stockList, setStockList] = useState([]);
//   const [rowOutTable, setRowOutTable] = useState({});
//   const [showInput, setShowInput] = useState(false);
//   const [order, SetOrder] = useState('asc')
//   const [warehouseList, setWarehouseList] = useState([]);

//   const nav = useNavigate()

//   useEffect(() => {
//     axios
//       .get("http://localhost:8000/stock")
//       .then((res) => {
//         console.log("몬가 처음에 가져오는거...", res.data);
//         const whSeq = res.data.map(item => item.wh_seq);
//         console.log("창고번호 목록", whSeq);

//         setStockList(res.data);
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   }, []);

//   const handleRowClick = () => {
//     console.log("클릭");
//   };

//   const outLoadingHandler = (e) => {
//     console.log("outLoadingHandler 함수");
//   };

//   const handleInputPluse = (e) => {
//     console.log("handleInputPluse 함수");
//   };

//   const outLoadingHandler2 = async () => {
//     console.log("outLoadingHandler2 함수");
//   };

//   const handleInDateOrder = () => {
//     if (order === 'asc') {
//       SetOrder('desc')
//     } else {
//       SetOrder('asc')
//     }
//   }

//   const handleExpireDateOrder = () => {
//     if (order === 'asc') {
//       SetOrder('desc')
//     } else {
//       SetOrder('asc')
//     }
//   }

//   const moveToWarehouse = () => {
//     nav("/ware/warehouse")
//   }

//   useEffect(() => {
//     axios.get(`http://localhost:8000/stock/${order}`)
//       .then((res) => {
//         console.log("밑에서 가져오는데이터", res.data);
//         // setStockList(res.data); // 얘땜에 창고 이름이 안떠서 일단 주석처리 했어요...
//       })
//       .catch((err) => {
//         console.error(err);
//       })
//   }, [order])

//   return (
//     <div id="out_all">
//       <div id="out_top">
//         <span id="out_title">재고</span>

//         <div id="out_input_container">
//           <input id="out_input" placeholder="제품ID 제품명 검색" />
//           <FontAwesomeIcon id="out_input_icon" icon={faMagnifyingGlass} />
//           <select id="out_filter">filter</select>
//         </div>
//       </div>

//       <div className="out_table">
//         <table className="container">
//           <thead>
//             <tr>
//               <th>
//                 <h1>제품ID</h1>
//               </th>
//               <th>
//                 <h1>제품명</h1>
//               </th>
//               <th>
//                 <h1>수량</h1>
//               </th>
//               <th
//                 onClick={handleInDateOrder}
//                 style={{
//                   cursor: 'pointer'
//                 }}
//               >
//                 <h1>입고일</h1>
//               </th>
//               <th
//                 onClick={handleExpireDateOrder}
//                 style={{
//                   cursor: 'pointer'
//                 }}
//               >
//                 <h1>유통기한</h1>
//               </th>
//               <th>
//                 <h1>적재창고</h1>
//               </th>
//               <th>
//                 <h1>적재위치</h1>
//               </th>
//               <th>
//                 <h1>코드번호</h1>
//               </th>
//               <th>
//                 <h1>창고이동</h1>
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {stockList.map((warehouseItem, warehouseIndex) => (
//               <React.Fragment key={warehouseIndex}>
//                 {warehouseItem.Racks.map((rackItem, rackIndex) => (
//                   <React.Fragment key={rackIndex}>
//                     {rackItem.Loadings.map((loadingItem, loadingIndex) => (
//                       <React.Fragment key={loadingIndex}>
//                         <tr
//                           onClick={() =>
//                             handleRowClick(rackIndex, loadingIndex)
//                           }
//                           className={
//                             rowOutTable[rackIndex]?.[loadingIndex]
//                               ? "selected"
//                               : ""
//                           }
//                         >
//                           <td
//                             className="out_table_id"
//                             onClick={outLoadingHandler}
//                             name="loading_seq"
//                           >
//                             {loadingItem.loading_seq}
//                           </td>
//                           <td>{loadingItem.Stock.stock_name}</td>
//                           <td
//                             onChange={outLoadingHandler}
//                             name="td_loading_cnt"
//                           >
//                             {loadingItem.loading_cnt}
//                           </td>
//                           <td>{loadingItem.created_at.substring(0, 10)}</td>
//                           <td>
//                             {loadingItem.Stock.stock_expired.substring(0, 10)}
//                           </td>
//                           <td>{warehouseItem.wh_name}</td>
//                           <td>{loadingItem.rack_seq}</td>
//                           <td>{loadingItem.Stock.stock_barcode}</td>
//                           <td>
//                             <Link to={`/warehouse/${warehouseItem.wh_seq}`}>
//                               <button>
//                                 <img
//                                   src='/img/warehouse-48.png'
//                                   width='30px'
//                                   height='30px'
//                                 ></img>
//                               </button>
//                             </Link>
//                           </td>
//                         </tr>
//                         {rowOutTable[rackIndex]?.[loadingIndex] && (
//                           <tr>
//                             <td id="out_table_fold" colSpan={8}>
//                               <span>출고일자</span>
//                               <input
//                                 type="date"
//                                 name="created_at"
//                                 onChange={outLoadingHandler}
//                               />
//                               <br />
//                               <span>출고수량</span>
//                               <input
//                                 name="td_loading_cnt"
//                                 type="text"
//                                 onChange={outLoadingHandler}
//                               />
//                               <br />
//                               <span> 배송지</span>
//                               <select
//                                 id="out_filter"
//                                 onClick={handleInputPluse}
//                               >
//                                 {rackItem.Loadings.map(
//                                   (loadingItem, loadingIndex) => (
//                                     <option
//                                       key={loadingIndex}
//                                       value={loadingItem.stock_shipping_des}
//                                       name="choice_des"
//                                     >
//                                       {loadingItem.stock_shipping_des}
//                                     </option>
//                                   )
//                                 )}
//                                 <option value="직접입력">직접입력</option>
//                               </select>
//                               {showInput && (
//                                 <input
//                                   type="text"
//                                   placeholder="배송지 입력"
//                                   name="out_loading_des"
//                                   onChange={outLoadingHandler}
//                                 />
//                               )}
//                               <button
//                                 className="custom-btn btn-1"
//                                 onClick={outLoadingHandler2}
//                               >
//                                 출고
//                               </button>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     ))}
//                   </React.Fragment>
//                 ))}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default StockSelect;
