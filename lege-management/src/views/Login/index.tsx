import { ChangeEvent, useEffect, useState } from "react";
import styles from "./login.module.scss";
import initLoginBg from "./init.ts";

import { Input, Space, Button, message } from "antd"; // 引入 antd 的 Input 組件
import "./loginbox.less"; // 引入覆蓋 antd 的 loginbox.less 樣式

import { useNavigate } from "react-router-dom";
import { CaptchaAPI, LoginAPI } from "@/request/api.ts";

const View = () => {
  const navigateTo = useNavigate();

  /*
    useEffect: 用於在函數組件中模擬生命週期函數,
    用於在函數組件中執行一些副作用操作,
    例如: 發送ajax請求/設置訂閱/啟動定時器
    useEffect(() => {
        console.log('useEffect')
        // 發送ajax請求/設置訂閱/啟動定時器
        return () => {
            console.log('clear')
            // 在組件卸載前執行
            // 清除定時器/取消訂閱
        }
    }, [count]) // 如果指定的是[], 回調函數只會在第一次render()後執行
                // 如果指定的是[count], 回調函數只會在count改變後執行
                // 如果指定的是不寫, 回調函數只會在每次render()後執行
  */

  useEffect(() => {
    initLoginBg();      // load background image after the page is loaded
    window.onresize = function () {
      initLoginBg();    // load background image after window size is changed
    };
    getCaptchaImg();    // get captcha image when loading the page
  }, []);

  // define variables to store username, password, captcha
  const [usernameVal, setUsernameVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");
  const [captchaVal,  setCaptchaVal]  = useState("");

  // define a variable to store captcha image
  const [captchaImg, setCaptchaImg] = useState("");

  const usernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("username: ", e.target.value);
    setUsernameVal(e.target.value);
  };

  const passwordChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("password: ", e.target.value);
    setPasswordVal(e.target.value);
  };

  // captcha image change
  const captchaChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("captcha: ", e.target.value);
    setCaptchaVal(e.target.value);
  };

  const goLogin = async () => {
    console.log(
      "username, password, captcha: ",
      usernameVal,
      passwordVal,
      captchaVal
    );

    // verify username, password, captcha
    if (!usernameVal.trim() || !passwordVal.trim() || !captchaVal.trim()) {
      message.warning("please enter required information！");
      return;
    }

    // send login request
    const loginAPIRes = await LoginAPI({
      username: usernameVal,
      password: passwordVal,
      code: captchaVal,
      uuid: localStorage.getItem("uuid") as string,
    });

    console.log(loginAPIRes);

    if (loginAPIRes.code === 200) {
      // username : qdtest1 / password : 123456
      // 1. prompt login success
      message.success("login success！");
      // 2. save token to localStorage
      localStorage.setItem("lege-react-management-token", loginAPIRes.token);
      // 3. navigate to dashboard
      navigateTo("/dashboard");
      // 4. remove captcha uuid from localStorage
      localStorage.removeItem("uuid");
    }
  };

  // get captcha image when clicking image
  const getCaptchaImg = async () => {

    console.log("getCaptchaImg:");

    // CaptchaAPI().then((res:CaptchaAPIRes) => {
    //     console.log("getCaptchaImg res: ", res);
    // })

    const captchaAPIRes = await CaptchaAPI();
    console.log("getCaptchaImg|res: ", captchaAPIRes);
    if (captchaAPIRes.code === 200) {
      // set captcha image in src="data:image/gif;base64,xxxx"
      setCaptchaImg("data:image/gif;base64," + captchaAPIRes.img);
      // set captcha uuid to localStorage
      localStorage.setItem("uuid", captchaAPIRes.uuid);
    }
  };

  return (
    <div className={styles.loginPage}>
      <canvas id="canvas" style={{ display: "block" }}></canvas>
      <div className={styles.loginBox + " loginbox"}>
        {" "}
        {/* 這裡的 loginbox 是為了覆蓋antd預設less */}
        {/* <div className={styles.loginTitle}> */}
        <div className={styles.title}>
          <h1>Show Me the Money</h1>
          <p></p>
        </div>

        {/* Login Form */}
        <div className={styles.loginForm}>
          <Space direction="vertical" size="large" style={{ display: "flex" }}>
            <Input placeholder="帳號" onChange={usernameChange} />
            <Input.Password placeholder="密碼" onChange={passwordChange} />
            <div className="captchaBox">
              <Input placeholder="驗證碼" onChange={captchaChange} />
              <div className="captchaImg" onClick={getCaptchaImg}>
                {/* <img height="38" src="https://picsum.photos/200/300" alt="" /> */}
                <img height="38" src={captchaImg}  alt="CAPTCHA" />
              </div>
            </div>
            <Button type="primary" className="loginBtn" block onClick={goLogin}>
              登入
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default View;
