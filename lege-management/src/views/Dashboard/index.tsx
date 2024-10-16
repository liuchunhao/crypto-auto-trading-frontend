
/** 
  
import { useSelector, useDispatch } from "react-redux";
// import { Button } from "antd";

import store from "@/store";

// ReturnType: ts中用來 從 store 中取得資料的型態
type RootState = ReturnType<typeof store.getState>; // type: RootState

import numStatus from "@/store/NumStatus";  // 引入異步的方法

*/
import { UnderConstructionIcon } from "@/components/UnderContructionIcon";

const View = () => {
  /** 
   * 
   * 
  // 箭頭函數
  // dispatch action to store, modify data in store
  const dispatch = useDispatch(); // useDispatch: 傳送 action 到 store

  // get data from store
  const { num } = useSelector((state: RootState) => ({
    // () 一個對象
    num: state.NumStatusReducer.num, // 模塊化組合後的 reducers
  })); // useSelector: 從 store 中取得資料

  const changeNum = () => {
    console.log("changeNum:");
    // type: 'add' 是 action 的 type, 用來判斷要執行哪個 reducer, 是字串
    // payload: 2 是 action 的 payload, 自訂的資料, 可以是任何型態
    dispatch({ type: "add", val: 10 });
  };

  const changeNumAsync = () => {
    console.log("changeNumAsync:");

    // redux-thunk: dispatch a function
    // npm install redux-thunk

    // modulized to NumStatus/index.ts
    // dispatch((dis: Function) => {
    //   setTimeout(() => {
    //     // dispatch({ type: "add", val: 10 });  <-- dis({ type: "add", val: 10 })
    //     dis({ type: "add", val: 10 });  
    //   }, 1000);
    // });

    // dispatch(異步調用的函數)
    dispatch(numStatus.asyncActions.asyncAdd);

    // redux-saga: dispatch a function
    // npm install redux-saga
    // dispatch({ type: "add", val: 10 });
  };

  // get arr from store
  const { sarr } = useSelector((state: RootState) => ({
    // () 一個對象
    sarr: state.ArrStatusReducer.sarr, // 模塊化組合後的 reducers
  })); // useSelector: 從 store 中取得資料

  const changeArr = () => {
    console.log("changeArr:");
    // type: 'add' 是 action 的 type, 用來判斷要執行哪個 reducer, 是字串
    // payload: 2 是 action 的 payload, 自訂的資料, 可以是任何型態
    dispatch({ type: "sarrpush", val: 11 });
  };
  */

  return (
    
    <div className="dashboard">
      <p>Dashboard</p>
      <UnderConstructionIcon />

      {/* 

      <p>num: {num}</p>
      <Button type="primary" onClick={changeNum}>
        Add
      </Button>
      <span> </span>
      <Button type="primary" onClick={changeNumAsync}>
        Async Add
      </Button>
      <p>sarr: {sarr} </p>
      <Button type="primary" onClick={changeArr}>
        Push
      </Button> 

      */}
    </div>
  );
};

export default View;
