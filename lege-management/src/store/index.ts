import { legacy_createStore, combineReducers, compose, applyMiddleware } from "redux"
// import reducer from "./reducer.ts";
// 異步處理
import reduxThunk from "redux-thunk"   // npm install redux-thunk
// 模塊化管理 reducer
import NumStatusReducer from "./NumStatus/reducer"
import ArrStatusReducer from "./ArrStatus/reducer"

const reducers = combineReducers({
    // 引入新模塊
    NumStatusReducer,
    ArrStatusReducer
})

// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() 
// is for react-redux-devtools extension to work
// 只支持同步處理的 redux 
// const store = legacy_createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__
//     && window.__REDUX_DEVTOOLS_EXTENSION__());

// 支持異步處理的 redux-thunk
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose //rt
// 中間件 applyMiddleware
const store = legacy_createStore(reducers, composeEnhancers(applyMiddleware(reduxThunk)))

export default store