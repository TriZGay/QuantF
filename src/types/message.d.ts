export declare interface Message {
  type: "CONNECT" | "MARKET_STATE" | "KL_HISTORY_DETAIL"
    | "REFRESH_SUB" | "SUBSCRIPTION" | "TRADE_DATE" | "KL_HISTORY"
    | "PLATES" | "STOCK_IN_PLATE" | "STOCKS" | "STOCK_OWNER_PLATE"
    | "CAPITAL_FLOW" | "CAPITAL_DISTRIBUTION" | "REHABS" | "SNAPSHOT"
    | "ACCOUNTS";
}

export interface AccountItem {
  trdEnv: number;
  trdEnvStr: string;
  accID: string;
  trdMarketAuthList: Array<Number>;
  accType: number;
  accTypeStr: string;
  cardNum: string;
  securityFirm: number;
  securityFirmStr: string;
  simAccType: number;
  simAccTypeStr: string;
  uniCardNum: string;
  accStatus: number;
  accStatusStr: string;
}

export interface AccountsCommand extends Message {
  accounts?: Array<AccountItem>;
}

export interface SnapshotCommand extends Message {
  securities: Array<PlateItem>;
}

export interface RehabsContent {
  time: string,
  companyActFlag: number,
  fwdFactorA: number,
  fwdFactorB: number,
  bwdFactorA: number,
  bwdFactorB: number,
  splitBase: number,
  splitErt: number,
  joinBase: number,
  joinErt: number,
  bonusBase: number,
  bonusErt: number,
  transferBase: number,
  transferErt: number,
  allotBase: number,
  allotErt: number,
  allotPrice: number,
  addBase: number,
  addErt: number,
  addPrice: number,
  dividend: number,
  spDividend: number,
}

export interface RehabsCommand extends Message {
  security: PlateItem,
  rehabs?: Array<RehabsContent>
}

export interface CapitalFlowContend {
  inFlow: number,
  mainInFlow: number,
  superInFlow: number,
  bigInFlow: number,
  midInFlow: number
  smlInFlow: number
  time: string
}

export interface CapitalFlowCommand extends Message {
  security: PlateItem,
  periodType?: number,
  beginTime?: string,
  endTime?: string,
  lastValidTime?: string,
  contentList?: Array<CapitalFlowContend>
}

export interface CapitalDistributionContent {
  capitalInSuper: number,
  capitalInBig: number,
  capitalInMid: number,
  capitalInSmall: number,
  capitalOutSuper: number,
  capitalOutBig: number,
  capitalOutMid: number,
  capitalOutSmall: number,
  updateTime: string
}

export interface CapitalDistributionCommand extends Message {
  security: PlateItem,
  content?: CapitalDistributionContent
}

export interface StockOwnerPlatesCommand extends Message {
  securities: Array<PlateItem>;
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
