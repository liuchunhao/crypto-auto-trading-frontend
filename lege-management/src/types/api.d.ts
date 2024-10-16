// this file used to define all the reqeust and response type of API calls

// use extension "JSON to TS" to convert JSON to TS
// shift + alt + ctrl + v
interface CaptchaAPIRes {
    msg: string;
    img: string;
    code: number;
    captchaEnabled: boolean;
    uuid: string;
}

// login request type
interface LoginAPIReq {
    username: string;
    password: string;
    code: string;
    uuid: string;
}
// login response type
interface LoginAPIRes {
    msg: string;
    code: number;
    token: string;
}