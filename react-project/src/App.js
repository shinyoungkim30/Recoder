import React, {useState, useEffect} from 'react'
import { Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Join from './components/Join';
import Out_01 from './components/Out_01'
import StockSelect from './components/StockSelect'
import OutDestination from './components/OutDestination'
import WareManage from './components/WareManage'
import WareCreate from './components/WareCreate'
import CreateWarehouse from './components/CreateWarehouse'
import Warehouse from './components/Warehouse'
import Mypage from './components/Mypage';
import './App.css'
import Logout from './components/Logout';
import Out_02 from './components/Out_02';
import Layout from './components/Layout'
import Barcode from './components/Barcode';
import In_HJ from './components/In_HJ';
import In_02 from './components/In_02';
import Dashboard from './components/Dashboard/Dashboard'
import Notice  from './components/Notice';
import axios from 'axios'
import WareManageSelect from './components/WareManageSelect';
import InWarehouse from './components/InWarehouse';

const App = () => {

  const [uid, setUid] = useState('')
  const [comSeq, setComSeq] = useState(0);
  const [newWareData, setNewWareData] = useState({})
  const [wareName,setWareName] = useState(['광주_광산구_01A'])

  const [selectWhSeq,setSelectWhSeq] = useState([])
  //혜주 추가 - 바코드 값 관리
  const [inputItem, setInputItem] = useState([{
    id: '',
    title: '',
  }]);

  useEffect(() => {
    axios.get('http://localhost:8000/user')
    .then((res) => {
      console.log(res);
      if (res.data) {
        setUid(true)
        setComSeq(res.data.com_seq)
      }
    })
    .catch((err) => {
      console.error(err);
    })
  }, [])

  return (
    <div>
      { uid ? (
        <div>
          <Routes>
            {/* 개발 끝나면 지워주세요 */}
            {/* <Route index element={ <Login /> } />
            <Route path='/join' element={ <Join /> } />
            <Route path='/register/company' element={ <RegisterCompany /> } /> */}
            {/* 개발 끝나면 지워주세요 */}
            <Route element={ <Layout  wareName={wareName}comSeq={comSeq} selectWhSeq={selectWhSeq} setSelectWhSeq={setSelectWhSeq}/> } >
              {/* 대시보드 */}
              <Route path='/main' element={ <Dashboard selectWhSeq={selectWhSeq} setSelectWhSeq={setSelectWhSeq} comSeq={ comSeq } /> } />
              {/* 재고 */}
              <Route path='/stock/select' element={ <StockSelect comSeq={ comSeq } selectWhSeq={selectWhSeq} setSelectWhSeq={setSelectWhSeq}/>} />
              <Route path='/notice/create' element={ <Notice  selectWhSeq={selectWhSeq} setSelectWhSeq={setSelectWhSeq}/> } />
              {/* 입고 */}
              <Route path='/in/create' element={ <In_HJ selectWhSeq={selectWhSeq} setSelectWhSeq={setSelectWhSeq}inputItem={inputItem} setInputItem={setInputItem}/> } /> 
              <Route path='/in/loading' element={ <In_02 selectWhSeq={selectWhSeq} setSelectWhSeq={setSelectWhSeq}/> } />
              {/* 출고 */}
              <Route path='/out/create' element={ <Out_01 selectWhSeq={selectWhSeq} setSelectWhSeq={setSelectWhSeq}/> } />
              <Route path='/out/controll' element={ <Out_02 selectWhSeq={selectWhSeq} setSelectWhSeq={setSelectWhSeq}/> } />    
              <Route path='/out/des' element={ <OutDestination selectWhSeq={selectWhSeq} setSelectWhSeq={setSelectWhSeq}/> } />
              {/* 창고 */}
              <Route path='/ware/manage' element={ <WareManage selectWhSeq={selectWhSeq} setSelectWhSeq={setSelectWhSeq} comSeq={comSeq}/> } />
              {/* 마이페이지 */}
              <Route path='/mypage' element={ <Mypage /> } />
              {/* 로그아웃 */}
              <Route path='/logout' element={ <Logout /> } />
              
              <Route path='/barcode' element={<Barcode inputItem = {inputItem} setInputItem={setInputItem}/>} />
            </Route>
              <Route path='/warehouse/:wh_seq' element={ <Warehouse comSeq={comSeq} /> } />
              <Route path='/ware/create' element={ <WareCreate comSeq={comSeq} setNewWareData={setNewWareData} /> } />
              <Route path='/ware/createwarehouse' element={ <CreateWarehouse comSeq={comSeq} newWareData={newWareData} /> } />
              {/* 입고에서 적재 클릭하면 이동 */}
              <Route path='/in/ware/:wh_seq/:stock_seq' element={ <InWarehouse /> } />
              {/* 창고 선택*/}
              <Route path='/ware/select' element={ <WareManageSelect selectWhSeq={selectWhSeq} setSelectWhSeq={setSelectWhSeq} comSeq={comSeq} wareName={wareName}setWareName={setWareName}/> } />
          </Routes> 
        </div>
      ) : ( 
        <Routes>
          <Route path='*' element={ <Login /> } />
          <Route path='/join' element={ <Join /> } />
        </Routes>
      )}
    </div> 
  )
}

export default App