import React, { useEffect, useState } from "react";
import "../css/warehouse.css";
import axios from "axios";
import WareCardItem2 from "./Warehouse/WareCardItem2";
import { Link } from "react-router-dom";

const WareManageSelect = ({ comSeq, selectWhSeq, setSelectWhSeq,wareName,setWareName}) => {
  const [warehouseList, setWarehouseList] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/ware/manage/${comSeq}`)
      .then((res) => {
        setWarehouseList(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div id="ware-container" style={{margin:30}}>
      <div id="ware-header"style={{marginBottom:30}}>
        <span>창고 선택</span>
      </div>
      <div id="ware-item-box">
        {warehouseList.length > 0 ? (
          warehouseList.map((item, index) => (
            <WareCardItem2
              selectWhSeq={selectWhSeq}
              setSelectWhSeq={setSelectWhSeq}
              wareName={wareName}setWareName={setWareName}
              key={index}
              wh_name={item.wh_name}
              wh_seq={item.wh_seq}
              index={index}
              racks={item.Racks}
            ></WareCardItem2>
          ))
        ) : (
          <div>
            창고가 없습니다 <br />
            <Link to={"/main"}>메인으로 이동</Link> <br />
            { !comSeq && <div>기업을 아직 등록하지 않으셨습니다.<br /><Link to={"/mypage"}>기업 등록하기</Link></div> }
          </div>
        )}
      </div>
    </div>
  );
};

export default WareManageSelect;

// 예전 코드
// ---------------------------------------------------------------------
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../css/WareManage.css";

// const WareManage = ({ comSeq }) => {
//   const nav = useNavigate();
//   const [warehouseList, setWarehouseList] = useState([]);

//   const handleWareCreate = () => {
//     nav("/ware/create");
//   };

//   useEffect(() => {
//     axios
//       .get(`http://localhost:8000/ware/manage/${comSeq}`)
//       .then((res) => {
//         setWarehouseList(res.data);
//         console.log("가져오는 데이터", res.data);
//         const whSeq = res.data.map((item) => item.wh_seq);
//         console.log("뭘로 뽑아볼까", whSeq);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }, []);

//   return (
//     <div id="ware_manage_all">
//       <div id="ware_manage_top">
//         <div id="ware_manage_title">
//           <h1>창고 리스트</h1>
//         </div>
//       </div>

//       {/* 테이블 */}
//       <div className="ware_manage_table">
//         <div className="ware_manage_header">
//           <table className="ware_container">
//             <thead>
//               <tr>
//                 <th>
//                   <h1>창고 ID</h1>
//                 </th>
//                 <th>
//                   <h1>적재량</h1>
//                 </th>
//                 <th>
//                   <h1>적재율</h1>
//                 </th>
//                 <th>
//                   <h1>생성일</h1>
//                 </th>
//               </tr>
//             </thead>
//           </table>
//         </div>

//         <div className="ware_manage_content">
//           <table className="ware_container">
//             <tbody>
//               {warehouseList.length > 0
//                 ? warehouseList.map((item, index) => (
//                     //     <React.Fragment key={index}>
//                     <tr key={index}>
//                       <Link to={`/warehouse/${item.wh_seq}`}>
//                         <td>{item.wh_name}</td>
//                         {/* <td>{item.loadCnt}</td> */}
//                         <td>10</td>
//                         {/* <td>{item.loadRate}</td> */}
//                         <td>20</td>
//                         <td>{item.createdAt}</td>
//                       </Link>
//                     </tr>
//                     //     </React.Fragment>
//                   ))
//                 : console.log("창고가 없습니다.")}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       <div className="ware_button_container">
//         <button onClick={handleWareCreate}>창고 생성</button>
//       </div>
//     </div>
//   );
// };

// export default WareManage;
