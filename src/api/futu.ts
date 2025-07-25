import request from "@/utils/request";

interface PaginationRequest {
  size?: number,
  current?: number
}

export interface QuerySubscribeInfo extends PaginationRequest {

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
  marketCode: number,
  stockTypeCode: number
}

export interface StockResult {
  records: Stock[],
  total: number
}

export interface Plate {
  id: number,
  name: string,
  code: string,
  market: string,
  marketCode: number,
  plateType: string,
  plateTypeCode: number
}

export interface PlateResult {
  records: Plate[],
  total: number
}

export interface StockQueryRequest extends PaginationRequest {
  exchangeType?: number,
  delisting?: number,
  stockType?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
  market?: number,
  name?: string,
  code?: string
}

export interface PlateQueryRequest extends PaginationRequest {
  name?: string,
  market?: number,
  type?: number
}

export interface StockFilterCodes {
  sortDirs: AntDesignSelectOptions[],
  klTypes: AntDesignSelectOptions[],
  relativePositions: AntDesignSelectOptions[],
  baseFiltersFields: AntDesignSelectOptions[],
  financialFiltersFields: AntDesignSelectOptions[],
  financialQuarters: AntDesignSelectOptions[],
  accumulateFiltersFields: AntDesignSelectOptions[],
  indicatorFiltersFields: AntDesignSelectOptions[],
  patternFiltersFields: AntDesignSelectOptions[],
}

export interface AntDesignSelectOptions {
  label: string,
  value: number
}

export interface TradeMetaCodes {
  tradeSides: Array<AntDesignSelectOptions>;
  trailTypes: Array<AntDesignSelectOptions>;
  timeInForces: Array<AntDesignSelectOptions>;
  tradeSecMarkets: Array<AntDesignSelectOptions>;
  orderTypes: Array<AntDesignSelectOptions>;
  marketTypes: Array<AntDesignSelectOptions>;
  modifyOrderOps: Array<AntDesignSelectOptions>;
  setPriceReminderOps: Array<AntDesignSelectOptions>;
  setPriceReminderTypes: Array<AntDesignSelectOptions>;
  setPriceReminderFreqs: Array<AntDesignSelectOptions>;
}

export function fetchStockByCode(code: string) {
  return request.get<Stock>(`/api/base/getStock/${code}`);
}

export function fetchAllStocks(data: StockQueryRequest) {
  return request.post<Array<Stock>>("/api/base/allStocks", data);
}

export function fetchTradeCodes() {
  return request.get<TradeMetaCodes>("/api/base/tradeMeta");
}

export function fetchStockFilterCodes() {
  return request.get<StockFilterCodes>("/api/base/stockFiltersMeta");
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

export function fetchPlates(req: PlateQueryRequest) {
  return request.post<PlateResult>("/api/base/plates", req);
}
