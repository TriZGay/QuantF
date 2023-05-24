import axios from 'axios'
import { message } from 'ant-design-vue'


const service = axios.create({
    baseURL: "/",
    timeout: 5000
})

service.interceptors.request.use(
    config => {
        return config
    },
    error => {
        console.error("req err,", error)
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            message.success("请求成功")
        } else {
            message.error("请求失败.code=" + response.status)
        }
        return response
    },
    error => {
        message.error({
            content: "请求发起失败",
        })
        return Promise.reject(error)
    }
)

export default service