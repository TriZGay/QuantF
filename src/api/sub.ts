import request from '@/utils/request'

export interface SubscribeRequest {
    securityList: Array<Security>,
    subTypeList: Array<Number>,
    unsub?: boolean
}
export interface Security {
    market: Number,
    code: string,
    name: string,
    type: Number
}

export interface QuerySubscribeInfo {
    size?: number,
    current?: number
}

export interface SubscribeResult {
    records: SubscribeInfo[],
    total: number
}

export interface SubscribeInfo {

}

export function subscribe(data: SubscribeRequest) {
    return request.post<string>("/api/sub/", data)
}

export function syncSubscribeInfo() {
    return request.get<string>("/api/sub/refresh")
}

export function fetchSubscribeInfos(data: QuerySubscribeInfo) {
    return request.post<SubscribeResult>("/api/sub/list", data)
}

export function cancelSubscribeInfo(data: SubscribeRequest) {
    return request.post<string>("/api/sub/cancel", data)
}