import request from '@/utils/request'

export interface BasicQuoteRequest {
    code: string,
    start: string,
    end: string
}

export interface KLineRequest {
    code: string,
    start: string,
    end: string
}

export interface BasicQuote {
    code: string,
    amplitude: number,
    curPrice: number,
    darkStatus: number,
    highPrice: number,
    lastClosePrice: number,
    lowPrice: number,
    market: number,
    openPrice: number,
    priceSpread: number,
    secStatus: number,
    trunover: number,
    trunoverRate: number,
    updateTime: string,
    volume: number
}

export interface KLine {
    market: number,
    code: string,
    highPrice: number,
    openPrice: number,
    lowPrice: number,
    closePrice: number,
    lastClosePrice: number,
    volume: number,
    turnover: number,
    turnoverRate: number,
    pe: number,
    changeRate: number,
    updateTime: string
}

export function fetchBasicQuotes(basicQuoteRequest: BasicQuoteRequest) {
    return request.post<BasicQuote[]>("/ana/quote/list", basicQuoteRequest);
}

export function fetchDayKData(klineRequest: KLineRequest) {
    return request.post<KLine[]>("/ana/k/dayK", klineRequest)
}

export function fetchMin15KData(klineRequest: KLineRequest) {
    return request.post<KLine[]>("/ana/k/min15K", klineRequest)
}

export function fetchMin1KData(klineRequest: KLineRequest) {
    return request.post<KLine[]>("/ana/k/min1K", klineRequest)
}

export function fetchMin3KData(klineRequest: KLineRequest) {
    return request.post<KLine[]>("/ana/k/min3K", klineRequest)
}

export function fetchMin5KData(klineRequest: KLineRequest) {
    return request.post<KLine[]>("/ana/k/min5K", klineRequest)
}

//有指数数据的codes
export function fetchMetaIndiesCodes() {
    return request.get<Object>("/ana/meta/indiesCodes")
}

//有日K数据的codes
export function fetchMetaDayKCodes() {
    return request.get<[[]]>("/ana/meta/dayKCodes")
}

//有15分K数据的codes
export function fetchMetaMin15KCodes() {
    return request.get<[[]]>("/ana/meta/min15Codes")
}

//有1分K数据的codes
export function fetchMetaMin1KCodes() {
    return request.get<[[]]>("/ana/meta/min1Codes")
}

//有3分K数据的codes
export function fetchMetaMin3KCodes() {
    return request.get<[[]]>("/ana/meta/min3Codes")
}

//有5分K数据的codes
export function fetchMetaMin5KCodes() {
    return request.get<[[]]>("/ana/meta/min5Codes")
}