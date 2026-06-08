import request from "@/utils/request";

interface PaginationRequest {
  size?: number;
  current?: number;
}

export interface QuerySubscribeInfo extends PaginationRequest {}

export interface SubscribeDetailsResult {
  records: SubscribeInfo[];
  total: number;
}

export interface SubscribeInfo {
  id: number;
  securityCode: string;
  securityMarket: number;
  securityName: string;
  securityType: number;
  subType: number;
  subTypes: string;
}

export interface Stock {
  name: string;
  code: string;
  delisting: string;
  exchangeType: string;
  id: number;
  indexOptionType: string;
  lastTradeTime: string;
  listingDate: string;
  lotSize: number;
  mainContract: string;
  market: string;
  optionType: string;
  stockChildType: string;
  stockId: string;
  stockOwner: string;
  stockType: string;
  strikePrice: string;
  strikeTime: string;
  suspension: string;
  marketCode: number;
  stockTypeCode: number;
}

export interface StockResult {
  records: Stock[];
  total: number;
}

export interface Plate {
  id: number;
  name: string;
  code: string;
  market: string;
  marketCode: number;
  plateType: string;
  plateTypeCode: number;
}

export interface PlateResult {
  records: Plate[];
  total: number;
}

export interface StockQueryRequest extends PaginationRequest {
  exchangeType?: number;
  delisting?: number;
  stockType?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  market?: number;
  name?: string;
  code?: string;
  plateId?: number;
}

export interface PlateQueryRequest extends PaginationRequest {
  name?: string;
  market?: number;
  type?: number;
}

export interface StockFilterCodes {
  sortDirs: AntDesignSelectOptions[];
  klTypes: AntDesignSelectOptions[];
  relativePositions: AntDesignSelectOptions[];
  baseFiltersFields: AntDesignSelectOptions[];
  financialFiltersFields: AntDesignSelectOptions[];
  financialQuarters: AntDesignSelectOptions[];
  accumulateFiltersFields: AntDesignSelectOptions[];
  indicatorFiltersFields: AntDesignSelectOptions[];
  patternFiltersFields: AntDesignSelectOptions[];
}

export interface AntDesignSelectOptions {
  label: string;
  value: number;
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

export interface SnapshotReqeust {
  market: number;
  code: string;
  securityType: number;
}

export interface SnapshotResult {
  baseResponse?: SnapshotBaseResponse;
  equityResponse?: SnapshotEquityResponse;
  plateResponse?: SnapshotPlateResponse;
}

export interface SnapshotBaseResponse {
  market: number;
  marketStr: string;
  code: string;
  name: string;
  type: number;
  isSuspend: string;
  listTime: string;
  lotSize: number;
  priceSpread: number;
  updateTime: string;
  highPrice: number;
  openPrice: number;
  lowPrice: number;
  lastClosePrice: number;
  curPrice: number;
  volume: number;
  turnover: number;
  turnoverRate: number;
  askPrice: number;
  bidPrice: number;
  askVol: number;
  bidVol: number;
  amplitude: number;
  avgPrice: number;
  bidAskRatio: number;
  volumeRatio: number;
  highest52WeeksPrice: number;
  lowest52WeeksPrice: number;
  highestHistoryPrice: number;
  lowestHistoryPrice: number;
  prePrice: number;
  preHighPrice: number;
  preLowPrice: number;
  preVolume: number;
  preTurnover: number;
  preChangeVal: number;
  preChangeRate: number;
  preAmplitude: number;
  afterPrice: number;
  afterHighPrice: number;
  afterLowPrice: number;
  afterVolume: number;
  afterTurnover: number;
  afterChangeVal: number;
  afterChangeRate: number;
  afterAmplitude: number;
  secStatus: number;
  secStatusStr: string;
  closePrice5Minute: number;
}
export interface SnapshotEquityResponse {
  market: number;
  marketStr: string;
  code: string;
  issuedShares: number;
  issuedMarketVal: number;
  netAsset: number;
  netProfit: number;
  earningsPerShare: number;
  outstandingShares: number;
  outstandingMarketVal: number;
  netAssetPerShare: number;
  eyRate: number;
  peRate: number;
  pbRate: number;
  peTtmRate: number;
  dividendTtm: number;
  dividendRatioTtm: number;
  dividendLfy: number;
  dividendLfyRatio: number;
  updateTime: string;
}
export interface SnapshotPlateResponse {
  market: number;
  marketStr: string;
  code: string;
  raiseCount: number;
  fallCount: number;
  equalCount: number;
  updateTime: string;
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

export function fetchSnapshots(req: SnapshotReqeust) {
  return request.post<SnapshotResult>("/api/base/snapshots", req);
}
