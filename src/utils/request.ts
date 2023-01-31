import axios from 'axios'
import { message } from 'ant-design-vue'


const service = axios.create({
    baseURL: "/api",
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
        const res = response.data
        if (res.code !== 10000) {
            message.error({
                content: res.message,
            })
        }
        return res
    },
    error => {
        message.error({
            content: error.message,
        })
        return Promise.reject(error)
    }
)

export default service