/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  DollarOutlined, 
  LogoutOutlined,
} from "@ant-design/icons";

import type { MenuProps } from "antd";
import { Menu, 
//  theme 
} from "antd";

// router-dom is used to navigate to a new page
import { useNavigate, useLocation } from "react-router-dom"; 

type MenuItem = Required<MenuProps>["items"][number];

// use images/binance.jpg as the icon for Binance
export const BinanceIcon = () => {
  return (
    <img src="/images/binance.jpg" alt="BinanceIcon" 
         style={{ width: "15px", height: "15px", marginRight: "8px" }} />
  );
};

export const ExnessIcon = () => {
  return (
    <img src="/images/exness.png" alt="ExnessIcon" 
         style={{ width: "15px", height: "15px", marginRight: "8px" }} />
  );
};


// MenuItem[] above can be replaced by the array 'items' below:
const items: MenuItem[] = [
  {
    label: "Dashboard",
    key: "/dashboard",
    icon: <PieChartOutlined />,
  },
  {
    label: "Binance",
    key: "/binance",
    icon: <BinanceIcon />,
  },
  {
    label: "Exness",
    key: "/exness",
    icon: <ExnessIcon />,
  },
  {
    label: "Wallets",
    key: "/wallets",
    icon: <DollarOutlined />,
    children: [
      {
        label: "Spot",
        key: "/wallets/spot",
      },
      {
        label: "Funding",
        key: "/wallets/funding",
        disabled: true,
      },
      {
        label: "Futures",
        key: "/wallets/futures",
        disabled: true,
      },
    ],
  },
  {
    label: "Management",
    key: "/management",
    icon: <DesktopOutlined />,
    disabled: true,
    children: [
      {
        label: "User",
        key: "/management/user",
        icon: <UserOutlined />,
      }, 
      {
        label: "Team",
        key: "/team",
        icon: <TeamOutlined />,
        disabled: true,
      }, 
    ],
  },
  {
    label: "Files",
    key: "/files",
    icon: <FileOutlined />,
    disabled: true,
  },
  {
    label: "Logout",
    key: "/logout",
    icon: <LogoutOutlined />,
  },
]

const Comp: React.FC = () => {
  const navigateTo = useNavigate();                   // hook to navigate to a new page
  const currentRoute = useLocation();                 // hook to get the current url
  console.log("currentRoute:", currentRoute.pathname)

  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();

  const menuClick = (e: { key: string }) => {
    console.log("menu click:", e.key);
                        // using hook 'react-router-dom' to change the url
    navigateTo(e.key);  // e.key is the path to navigate to, which is defined in the 'getItem' array
  };

  let firstOpenKey: string = '';
  function findKey(obj: {key:string}) {
    return obj.key === currentRoute.pathname;
  }
  for (let i = 0; i < items.length; i++) {

    // To avoid the warning: "Object is possibly 'undefined'
    // tsconfig.json: "noImplicitAny": false    =>  allow implicit any type

    if(items[i]!['children'] && items[i]!['children'].length>0 && items[i]!['children'].find(findKey)) {
        firstOpenKey = items[i]!.key as string;
        console.log("firstOpenKey:", firstOpenKey);
        break;
    }
  } 

  // initial value of openKeys
  const [openKeys, setOpenKeys] = useState([firstOpenKey]);     // const [openKeys, setOpenKeys] = useState(['sub1', 'sub2']);

  const handleOpenChange = (keys: string[]) => {                // this will close other submenus when a submenu is opened
    keys.forEach((key) => {
      console.log("open change:", key);                         // keys: ['/page1', '/page2']; record the keys of the all currently opened submenus
      setOpenKeys([keys[keys.length-1]]);                       // only the last opened submenu will be opened
    })
  }

  return (
    <Menu 
      theme="dark" 
      /* 
        try "useLocation" of react-router-dom hook to get the current url on click the submenu current selected item 
       */
      defaultSelectedKeys={[currentRoute.pathname]} 
      mode="inline"
      items={items}                       // list of Menu 
      onClick={menuClick}
      onOpenChange={handleOpenChange}     // this will close other submenus when a submenu is opened
      openKeys={openKeys}                 // curently opened submenus
      />
  );
};

export default Comp;