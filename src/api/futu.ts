import request from "@/utils/request";

export interface QuerySubscribeInfo {
  size?: number,
  current?: number
}

export interface SubscribeDetailsResult {
  records: SubscribeInfo[],
  total: number,
}

export interface SubscribeInfo {
  id: number,
  securityCode: string,
  securityMarket: number,
  securityName: string,
  securityType: number,
  subType: number,
  subTypes: string
}

export interface Stock {
  name: string,
  code: string
  delisting: string,
  exchangeType: string,
  id: number,
  indexOptionType: string,
  lastTradeTime: string,
  listingDate: string,
  lotSize: number,
  mainContract: string,
  market: string,
  optionType: string,
  stockChildType: string,
  stockId: string,
  stockOwner: string,
  stockType: string,
  strikePrice: string,
  strikeTime: string,
  suspension: string,
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

export function fetchSubscribeDetails(data: QuerySubscribeInfo) {
  return request.post<SubscribeDetailsResult>("/api/sub/details", data);
}

export function fetchSubscribeInfos(data: QuerySubscribeInfo) {
  return request.post<SubscribeDetailsResult>("/api/sub/list", data);
}

export function fetchStocks(data: StockQueryRequest) {
  return request.post<StockResult>("/api/base/stocks", data);
}
