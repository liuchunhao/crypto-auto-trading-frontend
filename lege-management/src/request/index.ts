import axios from "axios";

// create axios instance
const api_host = import.meta.env.VITE_API_HOST

const instance = axios.create({
  baseURL: `${api_host}`,
  // 20 seconds of timeout for each request
  timeout: 20000,
  headers: {
    "ngrok-skip-browser-warning": "true",
  }
});

// request handler
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// response handler
instance.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
