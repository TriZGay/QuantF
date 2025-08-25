import request from "@/utils/request";
import type { AntDesignSelectOptions } from "@/api/futu";

export interface BasicQuoteRequest {
  code: string,
  start: string,
  end: string
}

export interface KLineRequest {
  code: string,
  rehabType: number,
  granularity: number,
  start: string,
  end: string,
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
  highPrice: string,
  openPrice: string,
  lowPrice: string,
  closePrice: string,
  lastClosePrice: number,
  volume: number,
  turnover: number,
  turnoverRate: number,
  pe: number,
  changeRate: number,
  datetime: string
}

export interface MaRequest {
  code: string,
  rehabType: number,
  granularity: number,
  start: string,
  end: string
}

export interface MaData {
  market: number,
  code: string,
  rehabType: number,
  ma5Value: number,
  ma10Value: number,
  ma20Value: number,
  ma30Value: number,
  ma60Value: number,
  ma120Value: number,
  updateTime: string,
}

export interface MetaRequest {
  granularity: number;
}

export interface MetaResponse {
  market: number,
  code: string
}

export interface TableInfoRequest {
  tableName: string,
}

export interface TableInfoResponse {
  maxTime: string,
  minTime: string,
  code: string,
  rehabType: number;
}

export interface DataQaRequest {
  start: string,
  end: string,
}

export interface DataQaDetailsRequest {
  date: string;
}

export interface DataQaDetailsResponse {
  repeatDetails: Array<RepeatDetails>;
}

export interface RepeatDetails {
  checkDate: string,
  code: string,
  rehabType: Number,
  updateTime: string,
  tableName: string
}

export interface BollRequest {
  code: string,
  rehabType: number,
  granularity: number,
  start: string,
  end: string
}

export interface BollResponse {
  market: number,
  code: String,
  rehabType: number;
  ma20Mid: number;
  doubleUpper: number;
  doubleLower: number;
  oneUpper: number;
  oneLower: number;
  tripleUpper: number;
  tripleLower: number;
  updateTime: string;
}

export interface EMaRequest {
  code: string,
  rehabType: number,
  granularity: number,
  start: string,
  end: string
}

export interface EMaData {
  market: number,
  code: string,
  rehabType: number,
  ema5Value: number,
  ema10Value: number,
  ema20Value: number,
  ema60Value: number,
  ema120Value: number,
  updateTime: string,
}

export interface MacdRequest {
  code: string,
  rehabType: number,
  granularity: number,
  start: string,
  end: string
}

export interface MacdResponse {
  market: number,
  code: string,
  rehabType: number,
  dif: number,
  dea: number,
  macd: number,
  updateTime: string
}

export interface BackTestRequest {
  code: string,
  rehabType: number,
  granularity: number,
  strategyType: number,
  initialCapital: number,
  commission: number,
  start: string,
  end: string
}

export interface BackTestResponse {
  prices: Array<KLine>,
  tradeSignals: Array<BackTestTradeSignal>;
  backTestOvr: BackTestOvr;
}

export interface BackTestTradeSignal {
  datetime: string;
  action: "BUY" | "SELL" | "HOLD";
  price: number;
  quantity: number;

  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
}

export interface BackTestOvr {
  finalValue: number;
  totalProfit: number;
  initialCapital: number;
  commission: number;
}

export interface RsiRequest {
  code: string,
  rehabType: number,
  granularity: number,
  start: string,
  end: string
}

export interface RsiResponse {
  market: number,
  code: string,
  rehabType: number,
  rsi6: number,
  rsi12: number,
  rsi24: number,
  updateTime: string
}

export interface KdjRequest {
  code: string,
  rehabType: number,
  granularity: number,
  start: string,
  end: string
}

export interface KdjResponse {
  market: number,
  code: string,
  rehabType: number,
  k: number,
  d: number,
  j: number,
  updateTime: string
}

export interface ArbrRequest {
  code: string,
  rehabType: number,
  granularity: number,
  start: string,
  end: string
}

export interface ArbrResponse {
  market: number,
  code: string,
  rehabType: number,
  ar: number,
  br: number,
  updateTime: string
}

//查询arbr数据 ARBR(26)
export function fetchArbrData(arbrReq: ArbrRequest) {
  return request.post<ArbrResponse>("/ana/arbr/arbr26", arbrReq);
}

//查询kdj数据 KDJ(9,3,3)
export function fetchKdjData(kdjReq: KdjRequest) {
  return request.post<KdjResponse[]>("/ana/kdj/kdj933", kdjReq);
}

//查询rsi数据 RSI(6,12,24)
export function fetchRsiData(rsiReq: RsiRequest) {
  return request.post<RsiResponse[]>("/ana/rsi/rsi61224", rsiReq);
}

//查询macd数据 MACD(12,26,9)
export function fetchMacdData(macdReq: MacdRequest) {
  return request.post<MacdResponse[]>("/ana/macd/macd12269", macdReq);
}

//查询ema数据
export function fetchEMAData(emaReq: EMaRequest) {
  return request.post<EMaData[]>("/ana/ema/n", emaReq);
}

//查询boll通道 BOLL(20,2)
export function fetchBollData(bollReq: BollRequest) {
  return request.post<BollResponse[]>("/ana/boll/boll202", bollReq);
}

//查询某一日的数据质量细节如是否重复
export function fetchDataQaDetails(detailsReq: DataQaDetailsRequest) {
  return request.post<DataQaDetailsResponse>("/ana/meta/dataQaDetails", detailsReq);
}

//查询每日数据质量
export function fetchDataQaPerDay(dataQaReq: DataQaRequest) {
  return request.post<Map<String, boolean>>("/ana/meta/dataQaPerDay", dataQaReq);
}

//查询ck的表
export function fetchMetaTables() {
  return request.get("/ana/meta/tables");
}

//查询ck的表的数据边界情况
export function fetchTableInfo(req: TableInfoRequest) {
  return request.post<TableInfoResponse>("/ana/meta/tableInfo", req);
}

//truncate表
export function fetchTruncateTable(req: TableInfoRequest) {
  return request.post<string>("/ana/meta/truncateTable", req);
}

//查询ck的数据库各表容量
export function fetchMetaDbInfo() {
  return request.get("/ana/meta/dbInfo");
}

//查询有数据的标的物代码
export function fetchMetaData(metaRequest: MetaRequest) {
  return request.post<MetaResponse[]>("/ana/meta/codes", metaRequest);
}

//查询不同粒度的k线数据
export function fetchKLineData(kLineRequest: KLineRequest) {
  return request.post<KLine[]>("/ana/k/n", kLineRequest);
}

//查询不同粒度的ma线数据
export function fetchMaData(maRequest: MaRequest) {
  return request.post<MaData[]>("/ana/ma/n", maRequest);
}

//回测
export function fetchBackTest(backTestRequest: BackTestRequest) {
  return request.post<BackTestResponse>("/ana/backtest/add", backTestRequest);
}

//初始化kdj933指标数据
export function fetchKdj933Init(granularity: number) {
  return request.get<string>(`/ana/kdj/initKdj933/${granularity}`);
}

export function fetchStrategyTypes() {
  return request.get<AntDesignSelectOptions[]>("/ana/meta/strategyTypes");
}
