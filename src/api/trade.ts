import request from '@/utils/request'

export interface PositionsQueryRequest {
    size?: number,
    current?: number
}
export interface PositionResult {
    records: Position[],
    total: number
}
export interface Position {
    name: string
}

export interface OrderRequest {

}

export function refreshPositions() {
    return request.get<string>("/api/acc/refreshAllPosition")
}

export function fetchPositions(queryRequest: PositionsQueryRequest) {
    return request.post<PositionResult>("/api/acc/positions", queryRequest)
}

export function placeOrder(orderRequest: OrderRequest) {
    return request.post<string>("/api/trade/order", orderRequest)
}