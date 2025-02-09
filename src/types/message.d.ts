export declare interface Message {
  type: "CONNECT" | "MARKET_STATE" | "KL_HISTORY_DETAIL";
}

export interface ConnectCommand extends Message {
  isConnect: boolean;
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
