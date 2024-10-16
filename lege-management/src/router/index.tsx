/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */

// 新的路由配置
import Home from '../views/Home'

// import About from '../views/About'
// import User from '../views/User'
// 改用懶加載, 這樣就不會一次性加載所有組件, 而是在需要的時候再加載 , 懶載的組件必須使用Suspense組件包裹 , 並且指定fallback屬性, 顯示加載時的提示組件
import React, { lazy } from 'react'

import Login from '../views/Login'

// in the beginning, we don't need to load all the components
const About = lazy(() => import('../views/About'))
const User = lazy(() => import('../views/User'))

const Dashboard = lazy(() => import('../views/Dashboard'))
const Management = lazy(() => import('../views/Management'))
const Binance = lazy(() => import('../views/Binance'))
const Exness = lazy(() => import('../views/Exness'))
const Wallets = lazy(() => import('../views/Wallets'))

const SpotWallet = lazy(() => import('../views/Wallets/Spot'))
const FuturesWallet = lazy(() => import('../views/Wallets/Futures'))
const FundingWallet = lazy(() => import('../views/Wallets/Funding'))    // index.tsx is the default file

// 這個函數是用來包裹組件的
const withLoadingComponent = (comp:JSX.Element) => (
    <React.Suspense fallback={<div>Loading...</div>}>
        {comp}
    </React.Suspense>
)

// 重定重組件
import { Navigate } from 'react-router-dom'

// 路由是一個數組, 不再是一個組件(old version)
const routes = [
    {
        path: '/',
        element: <Navigate to="/dashboard" />,
    },
    {
        path: '/',
        element: <Home />,
        children: [
            // all sub routes are nested inside the Home component
            {  
                path: '/dashboard',
                element: withLoadingComponent(<Dashboard />) 
            },
            {
                path: '/Exness',
                element: withLoadingComponent(<Exness />) 
            },
            {
                path: '/management',
                element: withLoadingComponent(<Management />),
            },
            {
                path: '/binance',
                element: withLoadingComponent(<Binance />)
            },
            {
                path: '/wallets',
                element: withLoadingComponent(<Wallets />),
                children: [

                ]
            },
            {
                path: 'wallets/spot',
                element: withLoadingComponent(<SpotWallet />)
            },
            {
                path: 'wallets/futures',
                element: withLoadingComponent(<FuturesWallet />)
            },
            {
                path: 'wallets/funding',
                element: withLoadingComponent(<FundingWallet />)
            },
            /* 
            {
                path: '/about',
                element: withLoadingComponent(<About />)
            },
            */
            {
                path: '/management/user',
                element: withLoadingComponent(<User />) 
            },
            {
                path: '/files',
                element: withLoadingComponent(<About />) 
            },
              
            /*
            {
                path: '/user/bill',
                element: withLoadingComponent(<UserBill />) 
            },
            */
        ]
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        // redirect to '/dashboard' if the path is not matched
        path: '*',
        element: <Navigate to="/dashboard" />,
    }
]

export default routes