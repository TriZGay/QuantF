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
  span: number,
  start: string,
  end: string
}

export interface MaData {
  market: number,
  code: string,
  rehabType: number,
  maValue: number,
  datetime: string,
}

export declare type MaLines = {
  name: string,
  data: Array<MaData>
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

//查询ck的表
export function fetchMetaTables() {
  return request.get("/ana/meta/tables");
}

//查询ck的表的数据边界情况
export function fetchTableInfo(req: TableInfoRequest) {
  return request.post<TableInfoResponse>("/ana/meta/tableInfo", req);
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
