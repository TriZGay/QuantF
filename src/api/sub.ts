import request from '@/utils/request'

export interface SubscribeRequest {
    securityList: Array<Security>,
    subTypeList: Array<Number>
}
export interface Security {
    market: Number,
    code: string,
    name: string,
    type: Number
}

export function subscribe(data: SubscribeRequest) {
    return request.post<string>("/api/sub/", data)
}

export function syncSubscribeInfo() {
    return request.get<string>("/api/sub/refresh")
}
