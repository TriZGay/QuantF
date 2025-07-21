import request from "@/utils/request";

export interface SHSZTodaySummary {
  shStockSummaries: Array<SHStockSummary>;
  szSummaries: Array<SZSummary>;
}

export interface SHStockSummary {
  name: string;
  stock: number;
  main: number;
  sen: number;
}

export interface SZSummary {
  type: string;
  num: number;
  turnoverVal: number;
  totalMarketVal: number;
  circularMarketVal: number;
}

export interface BigAStockIndividualResp {
  stockItems: Array<StockItem>;
}

export interface StockItem {
  item: string,
  value: string
}

export interface StockBidAskResponse {
  bidAskItems: Array<StockBidAskItem>;
}

export interface StockBidAskItem {
  item: string;
  value: number;
}

export enum BigARealTimeType {
  ALL = "all",
  SZ = "sz",
  SH = "sh",
  BJ = "bj",
}

export interface StockZhRtResponse {
  rtPrices: Array<StockRTPrice>;
}

export interface StockRTPrice {
  id: number;
  code: string;
  name: string;
  price: number;
  ratio: number;
  ratioVal: number;
  turnover: number;
  volume: number;
  amplitude: number;
  high: number;
  low: number;
  open: number;
  close: number;
  equivalentRatio: number;
  turnoverRatio: number;
  peRatio: number;
  pbRatio: number;
  marketCap: number;
  circularRatio: number;
  growthRatio: number;
  fiveMRatio: number;
  sixtyDRatio: number;
  ytdPercentRatio: number;
}

export interface StockZhHistoryRequest {
  symbol: string;
  period: "daily" | "weekly" | "monthly";
  startDate: string;
  endDate: string;
  adjust: "qfq" | "hfq";
}

export interface StockZhHistoryResponse {
  histories: Array<StockZhHistory>;
}

export interface StockZhHistory {
  date: string;
  code: string;
  open: number;
  close: number;
  high: number;
  low: number;
  turnover: number;
  volume: number;
  amplitude: number;
  chg: number;
  change: number;
  turnoverRatio: number;
}

export interface StockUsRtResponse {
  stockUsRtPrices: Array<StockUsRtPrice>;
}

export interface StockUsRtPrice {
  id: number;
  code: string;
  name: string;
  price: number;
  ratio: number;
  ratioVal: number;
  turnover: number;
  volume: number;
  amplitude: number;
  high: number;
  low: number;
  open: number;
  close: number;
  turnoverRatio: number;
  marketCap: number;
  peRatio: number;
}

export function fetchBigAStockTodaySummary() {
  return request.get<SHSZTodaySummary>("/akshres/stocks/today-summary");
}

export function fetchBigAStockIndividual(code: string) {
  return request.get<BigAStockIndividualResp>(`/akshres/stocks/bigA-individual/${code}`);
}

export function fetchBigAStockIndividualInfo(code: string) {
  return request.get<BigAStockIndividualResp>(`/akshres/stocks/bigA-individual-info/${code}`);
}

export function fetchBigABidAsk(code: string) {
  return request.get<StockBidAskResponse>(`/akshres/stocks/bigA-bidAsk/${code}`);
}

export function fetchBigARealTime(type: BigARealTimeType) {
  return request.get<StockZhRtResponse>(`/akshres/stocks/bigA-rt/${type}`);
}

export function fetchBigAHistory(req: StockZhHistoryRequest) {
  return request.post<StockZhHistoryResponse>("/akshres/stocks/bigA-history", req);
}

export function fetchUsRealTime() {
  return request.get<StockUsRtResponse>("/akshres/stocks/us-rt");
}
