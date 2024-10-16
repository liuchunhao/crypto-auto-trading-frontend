import request from "./index";

/* Typescript：Type Constraints for Request Parameters and Return Values are needed */

// captcha request / GET / with header 'ngrok-skip-browser-warning': 'true'
export const CaptchaAPI = (): Promise<CaptchaAPIRes> =>
  request.get("/captcha")

// login request / POST with header 'ngrok-skip-browser-warning': 'true
export const LoginAPI = (params: LoginAPIReq): Promise<LoginAPIRes> =>
  request.post("/login", params);
