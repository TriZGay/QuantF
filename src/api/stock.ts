import request from '@/utils/request'

export interface Stock {
    name: string
}

export interface StockResult {
    data: Stock[],
    total: number
}

export interface StockParams {
    name?: string,
    limit?: number,
    page?: number
}

export function fetchStocks(params: StockParams) {
    return request.post<StockResult>("/stocks", params)
}

export function syncStocks() {
    return request.get<string>("/sync/stocks")
}

export function syncPlates() {
    return request.get<string>("/sync/plates")
}