import request from '@/utils/request'

export interface Stock {
    name: string
}

export interface StockResult {
    records: Stock[],
    total: number
}

export interface StockQueryRequest {
    exchangeType?: number,
    delisting?: number,
    stockType?: number,
    market?: number,
    name?: string,
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

export interface MarketCodeUnique {
    periodType: 1 | 2 | 3 | 4, //1实时 2日 3周 4月
    market: number,
    code: string,
    beginDate?: string,
    endDate?: string
}

export function fetchStocks(data: StockQueryRequest) {
    return request.post<StockResult>("/api/base/stocks", data)
}

export function fetPlateByStockId(stockId: Number) {
    return request.get<PlateResult>("/api/base/plate/" + stockId)
}

export function syncStocks() {
    return request.get<string>("/api/sync/stocks")
}

export function syncPlates() {
    return request.get<string>("/api/sync/plates")
}

export function syncCapitalFlow(syncReq: MarketCodeUnique) {
    return request.post<string>("/api/sync/capitalFlow", syncReq)
}