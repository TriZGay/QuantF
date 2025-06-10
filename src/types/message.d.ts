export declare interface Message {
  type: "CONNECT" | "MARKET_STATE" | "KL_HISTORY_DETAIL"
    | "REFRESH_SUB" | "SUBSCRIPTION" | "TRADE_DATE" | "KL_HISTORY"
    | "PLATES" | "STOCK_IN_PLATE" | "STOCKS" | "STOCK_OWNER_PLATE"
    | "CAPITAL_FLOW" | "CAPITAL_DISTRIBUTION" | "REHABS" | "SNAPSHOT"
    | "ACCOUNTS" | "ACC_SUBSCRIBE" | "ACC_POSITION" | "STOCK_FILTER"
    | "ACC_FUNDS" | "PLACE_ORDER" | "HISTORY_ORDER" | "INCOMPLETE_ORDER"
    | "USER_GROUP" | "USER_SECURITY";
}

export interface UserGroupCommand extends Message {
  groupDataList?: Array<GroupData>;
}

export interface GroupData {
  groupName: string;
  groupType: number;
}

export interface UserSecurityCommand extends Message {
  groupName: string;
  stocks?: Array<StockContent>;
}

export interface StockContent {
  basic?: BasicInfo;
  // warrantExData?:
  // optionExData?:
  // futureExData?:
}

export interface BasicInfo {
  security: CommonSecurity;
  id: string;
  lotSize: number;
  secType: number;
  name: string;
  listTime: string;
  delisting: boolean;
  listTimestamp: number;
  exchType: number;
}

export interface CommonSecurity {
  market: number;
  marketStr: string;
  code: string;
}

export interface IncompleteOrderCommand extends Message {
  accId: string;
  tradeEnv: number;
  tradeMarket: number;

  incompleteOrderContent?: IncompleteOrderContent;
}

export interface IncompleteOrderContent {
  header: CommonTrdHeader;
  orderList: Array<OrderContent>;
}

export interface HistoryOrderCommand extends Message {
  accId: string;
  tradeEnv: number;
  tradeMarket: number;

  historyOrderContent?: HistoryOrderContent;
}

export interface HistoryOrderContent {
  header: CommonTrdHeader;
  orderList: Array<OrderContent>;
}

export interface OrderContent {
  trdSide: number;
  orderType: number;
  orderStatus: number;
  orderID: string;
  orderIDEx: string;
  code: string;
  name: string;
  qty: number;
  price: number;
  createTime: string;
  updateTime: string;
  fillQty: number;
  fillAvgPrice: number;
  lastErrMsg: string;
  secMarket: number;
  createTimestamp: number;
  updateTimestamp: number;
  remark: string;
  auxPrice: number;
  trailType: number;
  trailValue: number;
  trailSpread: number;
  currency: number;
  trdMarket: number;
}

export interface CommonTrdHeader {
  trdEnv: number;
  accID: string;
  trdMarket: number;
}

export interface PlaceOrderCommand extends Message {
  accId: string;
  tradeEnv: number;
  tradeMarket: number;
  tradeSide: number;
  orderType: number;
  code: string;
  qty: number;

  price?: number;
  adjustPrice?: boolean;
  adjustSideAndLimit?: number;
  secMarket?: number;
  remark?: string;
  timeInForce?: number;
  fillOutsideRTH?: boolean;
  auxPrice?: number;
  trailType?: number;
  trailValue?: number;
  trailSpread?: number;
}

export interface AccFundsCommand extends Message {
  accId: string,
  tradeEnv: number,
  tradeMarket: number
  accFundsContent?: AccFundsContent
}

export interface AccFundsContent {
  power: number;
  totalAssets: number;
  cash: number;
  marketVal: number;
  frozenCash: number;
  debtCash: number;
  avlWithdrawalCash: number;
  currency: number;
  availableFunds: number;
  unrealizedPL: number;
  realizedPL: number;
  riskLevel: number;
  initialMargin: number;
  maintenanceMargin: number;

  cashInfoList: Array<AccFundsCashInfo>;
  maxPowerShort: number;
  netCashPower: number;
  longMv: number;
  shortMv: number;
  pendingAsset: number;
  maxWithdrawal: number;
  riskStatus: number;
  marginCallMargin: number;

  isPdt: boolean;
  pdtSeq: string;
  beginningDTBP: number;
  remainingDTBP: number;
  dtCallAmount: number;
  dtStatus: number;
  securitiesAssets: number;
  fundAssets: number;
  bondAssets: number;
  marketInfoList: Array<AccFundsMarketInfo>;
}

export interface AccFundsMarketInfo {
  trdMarket: number;
  assets: number;
}

export interface AccFundsCashInfo {
  currency: number;
  cash: number;
  availableBalance: number;
  netCashPower: number;
}

export interface PositionMessageContent {
  positionID: string,
  positionSide: number,
  code: string
  name: string,
  qty: number,
  canSellQty: number,
  price: number,
  costPrice: number,
  val: number,
  plVal: number,
  plRatio: number,
  secMarket: number,
  td_plVal: number,
  td_trdVal: number,
  td_buyVal: number,
  td_buyQty: number,
  td_sellVal: number,
  td_sellQty: number,
  unrealizedPL: number,
  realizedPL: number,
  currency: number,
  trdMarket: number,
}

export interface AccPositionCommand extends Message {
  accId: string,
  tradeEnv: number,
  tradeMarket: number
  positions?: Array<PositionMessageContent>
}

export interface AccSubItem {
  accId: string;
  cardNum: string;
  uniCardNum: string;
}

export interface AccSubCommand extends Message {
  accSubscribeItems: Array<AccSubItem>;
}

export interface StockFilterCommand extends Message {
  begin: number;
  num: number;
  market: number;
  plate?: PlateItem;
  baseFilterList?: Array<BasicFilter>;
  accumulateFilterList?: Array<AccumulateFilter>;
  financialFilterList?: Array<FinancialFilter>;
  patternFilterList?: Array<PatternFilter>;
  customIndicatorFilterList?: Array<CustomIndicatorFilter>;
  stockFilterContent?: StockFilterContent;
}

export interface StockFilterContent {
  lastPage: boolean;
  allCount: number;
  dataList: Array;
}

export interface CustomIndicatorFilter {
  //todo 自定义指标
}

export interface PatternFilter {
  fieldName: number;
  klType: number;
  isNoFilter?: boolean;
  consecutivePeriod?: number;
}

export interface FinancialFilter {
  fieldName: number;
  filterMin?: number;
  filterMax?: number;
  isNoFilter?: boolean;
  sortDir?: number;
  quarter: number; //财报累积时间
}

export interface AccumulateFilter {
  fieldName: number;
  filterMin?: number;
  filterMax?: number;
  isNoFilter?: boolean;
  sortDir?: number;
  days: number; //近几日 累积时间
}

export interface BasicFilter {
  fieldName: number;
  filterMin?: number;
  filterMax?: number;
  isNoFilter?: boolean;
  sortDir?: number;
}

export interface AccountItem {
  trdEnv: number;
  trdEnvStr: string;
  accID: string;
  trdMarketAuthList: Array<number>;
  trdMarketAuthStrList: Array<string>;
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
