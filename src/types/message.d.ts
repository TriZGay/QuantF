export declare interface Message {
  type: "CONNECT" | "MARKET_STATE" | "KL_HISTORY_DETAIL"
    | "REFRESH_SUB" | "SUBSCRIPTION" | "TRADE_DATE" | "KL_HISTORY"
    | "PLATES" | "STOCK_IN_PLATE" | "STOCKS";
}

export interface StocksCommand extends Message {
  market: number,
  stockType: number
}

interface PlateItem {
  market: number,
  code: string
}

export interface StockInPlateCommand extends Message {
  all: boolean,
  plates?: Array<PlateItem>;
}

export interface PlatesCommand extends Message {
  markets: Array<number>;
}

export interface ConnectCommand extends Message {
  isConnect: boolean;
}

export interface SubOrUnSubCommand extends Message {
  securityList: Array<SubSecurity>,
  subTypeList: Array<Number>,
  unsub: boolean
}

export interface SubSecurity {
  market: number,
  code: string,
  name: string,
  type: number
}

export interface HistoryKLCommand extends Message {
  market: number,
  code: string,
  klType: number,
  beginDate: string,
  endDate: string
}

export interface FutuHistoryKQuota {
  usedQuota: number,
  remainQuota: number,
  itemList: Array<FutuHistoryKQuotaItem>
}

interface FutuHistoryKQuotaItem {
  market: number,
  code: string,
  name: string,
  requestTime: string,
  requestTimeStamp: number
}

export interface FutuMarketState {
  marketHK: string,
  marketUS: string,
  marketSH: string,
  marketSZ: string,
  marketHKFuture: string,
  time: string,
  localTime: string,
  marketUSFuture: string,
  marketSGFuture: string,
  marketJPFuture: string
}
