import request from '@/utils/request'

export interface Stock {
    name: string
}

export interface StockResult {
    records: Stock[],
    total: number
}

export interface StockQueryRequest {
    market?: number,
    size?: number,
    current?: number
}

export interface Plate {
    name: string
}

export interface PlateResult {
    records: Plate[],
    total: number
}

export function fetchStocks(data: StockQueryRequest) {
    return request.post<StockResult>("/base/stocks", data)
}

export function fetPlateByStockId(stockId: Number) {
    return request.get<PlateResult>("/base/plate/" + stockId)
}

export function syncStocks() {
    return request.get<string>("/sync/stocks")
}

export function syncPlates() {
    return request.get<string>("/sync/plates")
}