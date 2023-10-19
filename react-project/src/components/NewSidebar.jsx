import {
  AppstoreOutlined,
  SettingOutlined,
  InboxOutlined,
  HomeOutlined,
  ImportOutlined,
  ExportOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/layout.css";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem("홈", "sub1", <HomeOutlined />),
  getItem("재고", "sub2", <AppstoreOutlined />,[
  getItem("재고조회", "2"),
  getItem("재고 수량 관리", "3"),
  ]),
  // getItem("재고", "sub2", <AppstoreOutlined />, [
  //   getItem("재고 조회", "2"),
  //   getItem("재고 관리", "3"),
  // ]),
  getItem("입고", "sub3", <InboxOutlined />, [
    getItem("입고 예정", "4"),
    getItem("입고 등록", "5"),
    // getItem("입고 관리", "6"),
  ]),
  getItem("출고", "sub4", <InboxOutlined />, [
    getItem("출고 등록", "7"),
    getItem("출고 이력", "8"),
    getItem("출고품 관리", "9"),
  ]),
  getItem("창고", "10", <SettingOutlined />,[
    getItem("관리","13"),
    getItem("창고 이동","14")
  ]),
  // 기존 코드-----
  // getItem('창고', 'sub5', <SettingOutlined />, [
  //   getItem('창고관리', '10'),
  // ]),
  // --------------
  getItem("MyPage", "11", <UserOutlined />),
  getItem("Logout", "12", <LogoutOutlined />),
  // 기존 코드------------
  // getItem('MyPage', 'sub6', <SettingOutlined />, [
  //   getItem('MyPage', '11'),
  //   getItem('Logout', '12'),
  // ])
  // ---------------------
];

// submenu keys of first level
const rootSubmenuKeys = ["sub1", "sub2", "sub3", "sub4", "sub5", "sub6"];
const App = ({selectWhSeq,setSelectWgSeq, wareName}) => {
  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const nav = useNavigate();

  const handleNav = (item) => {
    const key = item.key;
    if (key === "sub1") {
      nav("/main");
    } else if (key === "2") {
      nav("/stock/select");
    } else if (key === "3") {
      nav("/notice/create");
    } else if (key === "4") {
      nav("/in/create");
    } else if (key === "5") {
      nav("/in/loading");
    } else if (key === "6") {
      nav("/in/create");
    } else if (key === "7") {
      nav("/out/create");
    } else if (key === "8") {
      nav("/out/controll");
    } else if (key === "9") {
      nav("/out/des");
    } else if (key === "13") {
      nav("/ware/manage");
    } else if (key === "14") {
      nav("/ware/select");
    }else if (key === "11") {
      nav("/mypage");
    } else if (key === "12") {
      nav("/logout");
    }
  };

  return (
    <div id="menu_div">
      <div id="sidebar-top">스마트 윤영현님 안녕하세요</div>
      <div id ="sidebar-wh">
          <span>접속창고 {wareName}</span>
          </div>
      <Menu
        mode="inline"
        openKeys={openKeys}
        onClick={handleNav}
        onOpenChange={onOpenChange}
        style={{
          width: 256,
          height: "100vh",
          borderColor: "white",
        }}
        items={items}
      ></Menu>
      {/* <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        style={{ height: '100%', borderRight: 0 }}
        items={items}
      /> */}
    </div>
  );
};
export default App;
