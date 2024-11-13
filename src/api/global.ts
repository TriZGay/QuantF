import request from '@/utils/request'

export function connect2FT() {
    return request.get<string>("/api/global/connect")
}

export function disconnect2FT() {
    return request.get<string>("/api/global/disconnect")
}

export function fetchGlobalMartketState() {
    return request.get<string>("/api/global/")
}

export function syncTradeDate() {
    return request.get<string>("/api/sync/tradeDate")
}

export function fetchHistoryKDetail() {
    return request.get<string>("/api/global/historyKDetail")
}