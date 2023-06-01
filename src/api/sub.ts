import request from '@/utils/request'

export interface SubscribeRequest {
    securityList: Array<Security>,
    subTypeList: Array<Number>
}
export interface Security {
    market: Number,
    code: string
}

export function subscribe(data: SubscribeRequest) {
    return request.post<string>("/api/sub/", data)
}