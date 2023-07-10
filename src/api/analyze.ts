import request from '@/utils/request'

export interface BasicQuoteRequest {
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

export function fetchBasicQuotes(basicQuoteRequest: BasicQuoteRequest) {
    return request.post<BasicQuote[]>("/ana/quote/list", basicQuoteRequest);
}