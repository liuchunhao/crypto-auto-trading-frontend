import ReactDOM from "react-dom/client";

// 正確地引入樣式的順序:
// 1.初始化樣式一般來說放在最前面
import "reset-css"; // will be overwritten by the following import

// 2.UI框架樣式

// 3.全局樣式 (relative path or absolute path)
// import './assets/styles/global.scss'    // must use './' to indicate the path is relative to the current file
import "@/assets/styles/global.scss"; // use alias '@' to indicate the absolute path of src folder
// set alias in 'vite.config.ts'

// 4.組件樣式
// import App from './App.tsx'                // must be imported after reset-css

// 舊的路由配置:
// import Router from './router'

// 新的路由配置:
import App from "./App.tsx"; // must be imported with BrowserRouter
import { BrowserRouter } from "react-router-dom";

// state management:
import { Provider } from "react-redux";
import store from "@/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // state management:
  <Provider store={store}>    
    {/* 
      this means that the component is rendered in the strict mode; 
      reload the page if there is any warning 

      <React.StrictMode>
        <App />
      </React.StrictMode>
    */}

      {/* 舊的路由配置 
        <Router />         // use Router instead of App 
      */}

      {/* 新的路由配置 */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </Provider>
);
