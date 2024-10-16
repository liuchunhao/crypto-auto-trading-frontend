import React, { useState } from "react";

// import {
//   DesktopOutlined,
//   FileOutlined,
//   PieChartOutlined,
//   TeamOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import type { MenuProps } from "antd";

import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom"; // router-dom is used to navigate to a new page

import { Breadcrumb, Layout } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import MainMenu from "@/components/MainMenu";

const { Header, Content, Footer, Sider } = Layout;

// component view of Home:
const View: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  // const navigateTo = useNavigate(); // hook to navigate to a new page

  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();

  // const menuClick = (e: { key: string }) => {
  //   console.log("menu click:", e.key);
  //   // using hook 'react-router-dom' to change the url
  //   navigateTo(e.key); // e.key is the path to navigate to, which is defined in the 'getItem' array
  // };

  // const [openKeys, setOpenKeys] = useState(['']);     // const [openKeys, setOpenKeys] = useState(['sub1', 'sub2']);
  // const handleOpenChange = (keys: string[]) => {      // this will close other submenus when a submenu is opened
  //   keys.forEach((key) => {
  //     console.log("open change:", key);               // keys: ['/page1', '/page2']; record the keys of the all currently opened submenus
  //     setOpenKeys([keys[keys.length-1]]);             // only the last opened submenu will be opened
  //   })
  // }

  const items = [
    {
      path: '/',
      title: <HomeOutlined />,
      breadcrumbName: 'Home',
    },
    {
      path: '/dashboard',
      title: 'Dashboard',
      breadcrumbName: 'Dashboard',
    },
    {
      path: '/binance',
      title: 'Binance',
      breadcrumbName: 'Binance',
    },
    {
      path: '/exness',
      title: 'Exness',
      breadcrumbName: 'Exness',
    },
    {
      path: '/wallets',
      title: 'Wallets',
      breadcrumbName: 'Wallets',
      children: [
        {
          path: '/spot',
          title: 'Spot',
          breadcrumbName: 'Spot',
        },
        {
          path: '/funding',
          title: 'Funding',
          breadcrumbName: 'Funding',
        },
        {
          path: '/futures',
          title: 'Futures',
          breadcrumbName: 'Futures',
        },
      ],
    },
    // {
    //   path: '/management',
    //   title: 'Management',
    // },
  ];

  function itemRender(item, _params, items, paths) {
    const last = items.indexOf(item) === items.length - 1;
    return last ? <span>{item.title}</span> : <Link to={ `/${paths.join('/')}` }>{item.title}</Link>;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)} >

        <div className="demo-logo-vertical" style={{ padding: 0, color: "white", background: "" }}>
            <span></span>
        </div>

        <MainMenu></MainMenu> 
          
      </Sider>
      <Layout className="site-layout">

        <Header className="site-layout-background" style={{ padding: 0, background: "" }} />

        <Content style={{ margin: "0 16px" }} className="site-layout-background" >

          <Breadcrumb style={{ margin: "16px 0" }} 
            routes={items} itemRender={itemRender} items={items}/> 

          <Outlet /> {/* remember to import outlet from react-router-dom */}

        </Content>

        <Footer style={{ textAlign: "center", padding: 0, lineHeight: "48px" }}> Supported by LCH </Footer>
      </Layout>
    </Layout>
  );
};

export default View;
