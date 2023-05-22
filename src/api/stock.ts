import request from '@/utils/request'

export interface Stock {
    name: string
}

export interface StockResult {
    data: Stock[],
    total: number
}

export interface StockQueryRequest {
    market?: number,
    size?: number,
    current?: number
}

export function fetchStocks(data: StockQueryRequest) {
    return request.post<StockResult>("/base/stocks", data)
}

export function syncStocks() {
    return request.get<string>("/sync/stocks")
}

export function syncPlates() {
    return request.get<string>("/sync/plates")
}