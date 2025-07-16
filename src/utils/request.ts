import axios from "axios";
import { message } from "ant-design-vue";


const service = axios.create({
  baseURL: "/",
  timeout: 1000 * 60 * 10
});

service.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    message.error("请求失败(request):" + error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    message.error("请求失败(response):" + error.response.data);
    return Promise.reject(error);
  }
);

export default service;
