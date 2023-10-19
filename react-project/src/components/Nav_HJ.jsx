import { AppstoreOutlined, MailOutlined, SettingOutlined,InboxOutlined,LoadingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useState } from 'react';
import {Link,useNavigate} from 'react-router-dom'

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
  getItem('홈', 'sub1', <MailOutlined />,
  ),
  getItem('재고', 'sub2', <AppstoreOutlined />, [
    getItem('재고 조회', '2'),
    getItem('재고 관리', '3'),
  ]),
  getItem('입고', 'sub3', <InboxOutlined />, [
    getItem('입고 예정', '4'),
    getItem('입고 등록', '5'),
    getItem('입고 관리', '6')
  ]),
  getItem('출고', 'sub4', <InboxOutlined />, [
    getItem('출고 등록', '7'),
    getItem('출고 이력', '8'),
    getItem('출고품 관리', '9'),

  ]),
  getItem('창고', 'sub5', <SettingOutlined />, [
    getItem('창고관리', '10'),
  ]),
  getItem('MyPage', 'sub6', <SettingOutlined />, [
    getItem('MyPage', '11'),
    getItem('LogOut', '12'),
  ])
];

// submenu keys of first level
const rootSubmenuKeys = ['sub1', 'sub2','sub3', 'sub4','sub5','sub6'];
const App = () => {
  const [openKeys, setOpenKeys] = useState(['sub1']);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const nav = useNavigate();

  const handleNav = (item)=>{
  const key = item.key
  if(key === 'sub1'){
    nav('/main')
  }else if (key === '2'){
    nav('/stock/select')
  }else if (key === '3'){
    nav('/stock/manage')
  }else if (key === '4'){
    nav('/in/create')
  }else if (key === '5'){
    nav('/in/inloading')
  }else if (key === '6'){
    nav('/in/create')
  }else if (key === '7'){
    nav('/out/create')
  }else if (key === '8'){
    nav('/out/controll')
  }else if (key === '9'){
    nav('/out/des')
  }else if (key === '10'){
    nav('/ware/manage')
  }else if (key === '11'){
    nav('/mypage')
  }else if (key === '12'){
    nav('/logout')
  }
  }

  
  return (
    <div id='menu_div' style={{width:200}}>
    <Menu 
      mode="inline"
      openKeys={openKeys}
      onClick={handleNav}
      onOpenChange={onOpenChange}
      style={{
        width: 256,
        height:800,
        borderColor:'white'
      }}
      items={items}
    />

    </div>
  );
};
export default App;