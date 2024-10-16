/* eslint-disable @typescript-eslint/no-unused-vars */

import { message } from "antd";
import { useEffect, createContext, useState } from "react";
import useWebSocket from 'react-use-websocket';
import { useRoutes, useLocation, useNavigate } from "react-router-dom";

import router from "./router";  // 新的路由配置 要搭配 useRoutes 一起使用 (hook)

// import 'antd/dist/antd.css'  // 全局引入 antd 的樣式; 這個樣式會影響到所有的組件

// Naviate to login page
function ToLogin() {
  const navigateTo = useNavigate();
  // 加载完这个组件之后实现跳转
  useEffect(() => {
    // 加载完组件之后执行这里的代码
    navigateTo("/login");
    message.warning("Please log in first!");
  }, [navigateTo]);
  return <div></div>;
}

// Navigate to Dashboard page
function ToDashboard() {
  const navigateTo = useNavigate();
  // 加载完这个组件之后实现跳转
  useEffect(() => {
    // 加载完组件之后执行这里的代码
    navigateTo("/dashboard");
    message.warning("Already logged in!");
  }, );
  return <div></div>;
}

// 手写封装路由守卫
function BeforeRouterEnter() {
  const outlet = useRoutes(router);

  /*
    后台管理系统两种经典的跳转情况：
    1、如果访问的是登录页面， 并且有token， 跳转到首页
    2、如果访问的不是登录页面，并且没有token， 跳转到登录页
    3、其余的都可以正常放行
  */

    const location = useLocation();
    const token = localStorage.getItem("lege-react-management-token");
    // 1、如果访问的是登录页面， 并且有token， 跳转到首页
    if (location.pathname === "/login" && token) {
      // 这里不能直接用 useNavigate 来实现跳转 ，因为需要BeforeRouterEnter是一个正常的JSX组件
      return <ToDashboard />;
    }
    // 2、如果访问的不是登录页面，并且没有token， 跳转到登录页
    if (location.pathname !== "/login" && !token) {
      return <ToLogin />;
    }

  return outlet;
}

export const UserDataContext = createContext({}); 

function App() {
  // const [count, setCount] = useState(0)

  const [accountUpdate, setAccountUpdate] = useState<string|undefined>()
  const [orderTradeUpdate, setOrderTradeUpdate] = useState<string | undefined>()
  const [serverTime, setServerTime] = useState<string | undefined>()

  // const outlet = useRoutes(router); // 新的路由配置 要搭配 useRoutes 一起使用

  const onMessage = (event) => {
    console.log('Received a message from the server: ', event.data);
    console.log(`Last message: ${lastMessage?.data}`)
    console.log(`Ready state: ${readyState}`)

    const data = event.data
    const msg = JSON.parse(data)
    console.log(`${msg.eventType}: ${msg.eventTime}`)
    switch (msg.eventType) {
      case 'ACCOUNT_UPDATE':
        setAccountUpdate(`${msg.eventType} : ${msg.eventTime} | ${msg.accountUpdate.eventReason}`)
        break;
      case 'ORDER_TRADE_UPDATE':
        {
          const executionType = msg.orderUpdate.executionType
          console.log(`${msg.eventType}: ${executionType}`)
          setOrderTradeUpdate(`${msg.eventType} | ${msg.eventTime} |  ${executionType}`)
          switch (executionType) {
            case 'NEW':
              break;
            case 'CANCELED':
              break;
            case 'REPLACED':
              break;
            case 'REJECTED':
              break;
            case 'TRADE':
              break;
            case 'EXPIRED':
              break;
            default:
              console.log(`Unknown Execution Type: ${executionType}`)
              break;
          }
        }

        break;
      case 'MARGIN_CALL':
        message.info(`${msg.eventTime} | ${msg.eventType}`)
        break;
      case 'SERVER_TIME':
        setServerTime(`${msg.eventType}: ${msg.eventTime}`) 
        break;
      default:
        console.log(`Unknown Event Type: ${msg.eventType}`)
        break;
    }
  }

  const ws_host = import.meta.env.VITE_WS_HOST

  const { 
    // remove unused declaration
    // sendMessage,
    lastMessage, 
    readyState 
  } = useWebSocket(`${ws_host}`, {
    onOpen: () => { message.success(`WebSocket opened: ${ws_host}`) },
    onMessage: onMessage,
    // Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (_closeEvent) =>  true,
    reconnectAttempts: 10,
    reconnectInterval: (attemptNumber) => Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
    onClose(event) {
      message.error(`WebSocket closed ${event.reason}: ${ws_host}`);
    },
  });

  return (
    <UserDataContext.Provider value={{ serverTime, setServerTime, accountUpdate, setAccountUpdate, orderTradeUpdate, setOrderTradeUpdate}}>
      <div className="App">

        {/* 
          <Button type="primary">Click me</Button>
          <UpCircleOutlined style={{ fontSize: '40px', color: 'red' }} />  icons from antd 
        */}

        {/* 用標籤用標籤來跳轉路由 */}

        {/* 
          <Link to="/home">Home</Link>|
          <Link to="/about">About</Link>|
          <Link to="/user">User</Link>      
        */}

        {/* 有點像是佔位符 類似窗口用來展示組件 類似vue中的router-view */}
        {/* 這個組件是用來顯示子路由的 這裡的路由是 "/" -> "App" */}
        {/* <Outlet></Outlet>   */}

        {/* 新的路由配置 要搭配 useRoutes 一起使用 */}
        {/* {outlet} */}

        <BeforeRouterEnter />
      </div>
    </UserDataContext.Provider>
  );
}

export default App;
