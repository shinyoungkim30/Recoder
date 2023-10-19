import React from 'react'
import '../css/layout.css'
import NewSidebar from './NewSidebar'
import { Outlet } from 'react-router-dom'

const Layout = ({ comSeq, selectWhSeq, setSelectWhSeq, wareName, userNick, comName }) => {

  return (
    <div id='layout-container'>
      <NewSidebar userNick={userNick} comName={comName} comSeq={comSeq}  wareName={wareName} selectWhSeq={selectWhSeq} setSelectWhSeq={setSelectWhSeq}/>
      <Outlet />
    </div>
  )
}

export default Layout