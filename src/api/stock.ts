import request from '@/utils/request'

export interface Stock {
    name: string
}

export function fetchStocks() {
    return request({
        url: "/stocks",
        method: "get"
    })
}