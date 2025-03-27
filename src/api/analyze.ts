import request from "@/utils/request";

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
  start: string,
  end: string
}

export interface BackTestResponse {

}

//查询macd数据
export function fetchMacdData(macdReq: MacdRequest) {
  return request.post<MacdResponse[]>("/ana/macd/macd12269", macdReq);
}

//查询ema数据
export function fetchEMAData(emaReq: EMaRequest) {
  return request.post<EMaData[]>("/ana/ema/n", emaReq);
}

//查询boll通道
export function fetchBoll2002(bollReq: BollRequest) {
  return request.post<BollResponse[]>("/ana/boll/boll2002", bollReq);
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

