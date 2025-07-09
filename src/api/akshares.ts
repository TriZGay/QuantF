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

export function fetchBigAStockTodaySummary() {
  return request.get<SHSZTodaySummary>("/akshres/stocks/today-summary");
}

export function fetchBigAStockIndividual(code: string) {
  return request.get<BigAStockIndividualResp>(`/akshres/stocks/bigA-individual/${code}`);
}
