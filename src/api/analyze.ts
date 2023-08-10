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

export interface MaRequest {
    code: string,
    start: string,
    end: string
}

export interface MaData {
    market: number,
    code: string,
    rehabType: number,
    maValue: number,
    updateTime: string,
    addTime: string
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

export function fetchMin30KData(klineRequest: KLineRequest) {
    return request.post<KLine[]>("/ana/k/min30K", klineRequest)
}

export function fetchMin60KData(klineRequest: KLineRequest) {
    return request.post<KLine[]>("/ana/k/min60K", klineRequest)
}

export function fetchWeekKData(klineRequest: KLineRequest) {
    return request.post<KLine[]>("/ana/k/weekK", klineRequest)
}

export function fetchMonthKData(klineRequest: KLineRequest) {
    return request.post<KLine[]>("/ana/k/monthK", klineRequest)
}

export function fetchQuarterKData(klineRequest: KLineRequest) {
    return request.post<KLine[]>("/ana/k/quarterK", klineRequest)
}

export function fetchYearKData(klineRequest: KLineRequest) {
    return request.post<KLine[]>("/ana/k/yearK", klineRequest)
}

export function fetchDayKMa5Data(maRequest: MaRequest) {
    return request.post<MaData[]>("/ana/dayk/ma5", maRequest)
}

export function fetchDayKMa10Data(maRequest: MaRequest) {
    return request.post<MaData[]>("/ana/dayk/ma10", maRequest)
}

export function fetchDayKMa20Data(maRequest: MaRequest) {
    return request.post<MaData[]>("/ana/dayk/ma20", maRequest)
}

export function fetchDayKMa30Data(maRequest: MaRequest) {
    return request.post<MaData[]>("/ana/dayk/ma30", maRequest)
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

//有30分K数据的codes
export function fetchMetaMin30KCodes() {
    return request.get<[[]]>("/ana/meta/min30Codes")
}

//有60分K数据的codes
export function fetchMetaMin60KCodes() {
    return request.get<[[]]>("/ana/meta/min60Codes")
}

//有周K数据的codes
export function fetchMetaWeekKCodes() {
    return request.get<[[]]>("/ana/meta/weekKCodes")
}

//有月K数据的codes
export function fetchMetaMonthKCodes() {
    return request.get<[[]]>("/ana/meta/monthKCodes")
}

export function fetchMetaQuarterKCodes() {
    return request.get<[[]]>("/ana/meta/quarterKCodes")
}

export function fetchMetaYearKCodes() {
    return request.get<[[]]>("/ana/meta/yearKCodes")
}