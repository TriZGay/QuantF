export declare interface Message {
  type:
    | "CONNECT"
    | "MARKET_STATE"
    | "KL_HISTORY_DETAIL"
    | "REFRESH_SUB"
    | "SUBSCRIPTION"
    | "TRADE_DATE"
    | "KL_HISTORY"
    | "PLATES"
    | "STOCK_IN_PLATE"
    | "STOCKS"
    | "STOCK_OWNER_PLATE"
    | "CAPITAL_FLOW"
    | "CAPITAL_DISTRIBUTION"
    | "REHABS"
    | "SNAPSHOT"
    | "ACCOUNTS"
    | "ACC_SUBSCRIBE"
    | "ACC_POSITION"
    | "STOCK_FILTER"
    | "ACC_FUNDS"
    | "PLACE_ORDER"
    | "MODIFY_ORDER"
    | "HISTORY_ORDER"
    | "INCOMPLETE_ORDER"
    | "USER_GROUP"
    | "USER_SECURITY"
    | "SET_PRICE_REMINDER"
    | "GET_PRICE_REMINDER"
    | "IPO"
    | "STOCK_IN_PLATE_BY_MARKET"
    | "VALUATION_P_S_LIST"
    | "COMPANY_PROFILE"
    | "COMPANY_EXECUTIVES"
    | "COMPANY_EXECUTIVE_BACKGROUND"
    | "COMPANY_OP_EFFICIENCY"
    | "ANALYST_CONSENSUS"
    | "CO_ACTIONS_DIVIDEND"
    | "CO_ACTIONS_BUYBACK"
    | "CO_ACTIONS_STOCK_SPLITS";
}

export interface StockSplitItem {
  dirDeciPubDate: number; // 公告日时间戳（秒）
  dirDeciPubDateStr: string; // 公告日字符串，格式 YYYY-MM-DD，对应市场时区
  reformType: string; // 重组方式
  rate: string; // 比率
  // 港股专有字段（仅港股的正股与信托有值）
  exDate: number; // 除权日时间戳（秒）
  exDateStr: string; // 除权日字符串，格式 YYYY-MM-DD，对应市场时区
  smDeciDate: number; // 决议日时间戳（秒）
  smDeciDateStr: string; // 决议日字符串，格式 YYYY-MM-DD，对应市场时区
  tempTradeBeginDate: number; // 临时买卖日时间戳（秒）
  tempTradeBeginDateStr: string; // 临时买卖日字符串，格式 YYYY-MM-DD，对应市场时区
  simulTradeBeginDate: number; // 并行买卖开始日时间戳（秒）
  simulTradeBeginDateStr: string; // 并行买卖开始日字符串，格式 YYYY-MM-DD，对应市场时区
  simulTradeEndDate: number; // 并行买卖结束日时间戳（秒）
  simulTradeEndDateStr: string; // 并行买卖结束日字符串，格式 YYYY-MM-DD，对应市场时区
  eventStatus: string; // 事件进程（如：方案实施）
  newParValue: number; // 新面值
  tempShareCode: string; // 临时证券代码（如：02988）
  tempShareAbbrName: string; // 临时证券简称（如：腾讯控股）
  newTradeUnit: number; // 新买卖单位（如：100）
  sharesAfterEffect: number; // 生效后股数（股）
}

export interface CorporateActionsStockSplitsContent {
  splitItemList: Array<StockSplitItem>;
  nextKey: string;
}

export interface CorporateActionsStockSplitsCommand extends Message {
  market: number;
  code: string;
  nextKey: string;
  num: number;
  content?: CorporateActionsStockSplitsContent;
}

export interface ABuyBackItem {
  changeRegDate: number; // 工商变更登记日时间戳（秒）
  changeRegDateStr: string; // 工商变更登记日字符串，格式 YYYY-MM-DD，对应市场时区
  changeDate: number; // 股份变动日时间戳（秒）
  changeDateStr: string; // 股份变动日字符串，格式 YYYY-MM-DD，对应市场时区
  eventProceDesc: string; // 事件进程描述
  advanceDate: number; // 预案公告日时间戳（秒）
  advanceDateStr: string; // 预案公告日字符串，格式 YYYY-MM-DD，对应市场时区
  meetPassDate: number; // 股东大会通过日时间戳（秒）
  meetPassDateStr: string; // 股东大会通过日字符串，格式 YYYY-MM-DD，对应市场时区
  startDate: number; // 回购开始日时间戳（秒）
  startDateStr: string; // 回购开始日字符串，格式 YYYY-MM-DD，对应市场时区
  endDate: number; // 回购截止日时间戳（秒）
  endDateStr: string; // 回购截止日字符串，格式 YYYY-MM-DD，对应市场时区
  payDate: number; // 支付日时间戳（秒）
  payDateStr: string; // 支付日字符串，格式 YYYY-MM-DD，对应市场时区
  seller: string; // 出售方（股份被回购方）
  buyBackMode: string; // 回购方式
  shareType: string; // 股份类别
  buyBackSum: number; // 回购股数（股）
  buyBackMoney: number; // 回购金额
  percentage: number; // 占已发行股份百分比，百分号前的值，如 12.34 表示 12.34%
  valueFloor: number; // 拟回购资金总额下限
  valueCeiling: number; // 拟回购资金总额上限
  priceFloor: number; // 回购价格下限
  priceCeiling: number; // 回购价格上限
  volumeFloor: number; // 拟回购股数下限
  volumeCeiling: number; // 拟回购股数上限
}
export interface HKBuyBackItem {
  publDate: number; // 公告日时间戳（秒）
  publDateStr: string; // 公告日字符串，格式 YYYY-MM-DD，对应市场时区
  endDate: number; // 回购截止日时间戳（秒）
  endDateStr: string; // 回购截止日字符串，格式 YYYY-MM-DD，对应市场时区
  buyBackMoney: number; // 回购金额
  buyBackSum: number; // 回购股数（股）
  percentage: number; // 占已发行股份百分比，百分号前的值，如 12.34 表示 12.34%
  highPrice: number; // 最高回购价
  lowPrice: number; // 最低回购价
  cumulativeSum: number; // 本轮累计回购股数（股）
  cumulativePercentage: number; // 本轮累计回购占总股本百分比，百分号前的值，如 12.34 表示 12.34%
  shareType: string; // 股份类别
}
export interface CorporateActionsBuybackContent {
  hkBuyBackList?: Array<HKBuyBackItem>;
  aBuyBackList?: Array<ABuyBackItem>;
  nextKey: string;
}
export interface CoActionsBuyBackCommand extends Message {
  market: number;
  code: string;
  nextKey: string;
  num: number;
  content?: CorporateActionsBuybackContent;
}
export interface CorporateActionsDividendContent {
  pubDate: string; // 公告日，格式 YYYY/MM/DD，对应市场时区
  statement: string; // 分配方案描述，如"末期息5.3港元"
  process: string; // 事件进展，如"方案实施"/"预案"；仅港股和A股的正股与信托有值
  recordDate: string; // 股权登记日，格式 YYYY/MM/DD，对应市场时区。ETF无此数据
  exDate: string; // 除权除息日，格式 YYYY/MM/DD，对应市场时区
  dividendPayableDate: string; // 派息日，格式 YYYY/MM/DD，对应市场时区
  fiscalYear: string; // 财政年度,如"2026"。仅ETF有值。
}

export interface CoActionsDividendCommand extends Message {
  market: number;
  code: string;
  contents?: Array<CorporateActionsDividendContent>;
}

export interface AnalystConsensusContent {
  highest: number;
  average: number;
  lowest: number;
  rating: number;
  ratingStr: string;
  total: number;
  updateTime: number;
  updateTimeStr: string;
  buy: number;
  hold: number;
  sell: number;
  strongBuy: number;
  underperform: number;
}

export interface AnalystConsensusCommand extends Message {
  market: number;
  code: string;
  content?: AnalystConsensusContent;
}

export interface OperationalEfficiencyItem {
  fiscalYear: number;
  financialType: number;
  financialTypeStr: string;
  periodText: string;
  endDate: number;
  endDateStr: string;
  employeeNum: number;
  employeeNumYoy: number;
  incomePerCapita: number;
  incomePerCapitaYoy: number;
  profitPerCapita: number;
  profitPerCapitaYoy: number;
  netProfitPerCapita: number;
  netProfitPerCapitaYoy: number;
}

export interface CompanyOpEfficiencyContent {
  itemList: Array<OperationalEfficiencyItem>; // 经营效率数据列表
  nextKey: string; //分页标识，"-1" 表示无更多数据
  currencyCode: string; // 货币代码(ISO 4217)
}

export interface CompanyOpEffCommand extends Message {
  market: number;
  code: string;
  nextKey: string;
  num: number;
  currencyCode: string;
  financialType: number;
  content?: CompanyOpEfficiencyContent;
}

export interface CompanyExecutiveBackgroundContent {
  briefBackground: string;
}

export interface CompanyExecutiveBgCommand extends Message {
  market: number;
  code: string;
  leaderName: string;
  content?: CompanyExecutiveBackgroundContent;
}

export interface DirectorInfo {
  displayLeaderName: string; // 高管展示名称（仅用于展示，不用于查询背景接口）
  leaderName: string; // 高管姓名（可传入 GetCompanyExecutiveBackground 查询背景）
  positionName: string; // 职位名称
  beginDate: number; // 任职起始日时间戳（秒）
  beginDateStr: string; // 任职起始日字符串，格式 YYYY-MM-DD，对应市场时区
  leaderGender: string; // 性别，如 "Male" / "Female"
  leaderAge: string; // 年龄，字符串形式，如 "62"
  highestEducation: string; // 最高学历
  annualSalary: number; // 年薪
  issueDate: number; // 发布日期时间戳（秒）
  issueDateStr: string; // 发布日期字符串，格式 YYYY-MM-DD，对应市场时区
}
export interface CompanyExecutivesContent {
  directorList?: Array<DirectorInfo>;
}
export interface CompanyExecutivesCommand extends Message {
  market: number;
  code: string;
  content?: CompanyExecutivesContent;
}

export interface CompanyLabItem {
  name: string; // 标签名
  value: string; // 标签对应信息
  fieldType: number; // 标签类型
  fieldTypeStr: string;
}

export interface CompanyProfileContent {
  itemList?: Array<CompanyLabItem>;
}

export interface CompanyProfileCommand extends Message {
  market: number;
  code: string;
  content?: CompanyProfileContent;
}

export interface PlateItem {
  security: CommonSecurity; // 股票
  name: string; // 股票名称
  valuationVal: number; // 估值
  forwardValue: number; // 预测估值，当前仅支持 PE 和 PS
  valuationPercentile: number; // 估值历史分位，百分号前的值，如 12.34 表示 12.34%
  marketCap: number; // 市值
}

export interface StockItem {
  security: CommonSecurity; // 股票
  name: string; // 板块名称
}

export interface ValuationPlateStockListContent {
  count: number; // 成分股总数
  stockList: Array<StockItem>; // 成分股估值列表
  nextKey: string; // 分页标识，"-1" 表示无更多数据
  plateList: Array<PlateItem>; // 指数成分股所属行业/板块列表；仅在指数全部板块首次请求时返回
}

export interface ValuePlateStockListCommand extends Message {
  market: number;
  code: string;
  valuationType?: 1 | 2 | 3; //1-PE 2-PB 3-PS
  nextKey?: string;
  num?: number;
  sortType?: 1 | 2; //1-desc 2-asc
  sortId?: 51 | 52 | 53 | 54; //51=市值（默认）52=估值 53=预测估值 54=历史分位
  filterMarket?: number;
  filterCode?: string;
  content?: ValuationPlateStockListContent;
}

export interface StockInPlateByMarketMessage extends Message {
  market: number;
}
export interface WinningNumData {
  winningName: string;
  winningInfo: string;
}

export interface BasicIpoData {
  security: CommonSecurity;
  name: string;
  listTime: string;
  listTimestamp: number;
}

export interface CNIpoExData {
  applyCode: string;
  issueSize: number; // 发行总数
  onlineIssueSize: number; // 网上发行量
  applyUpperLimit: number; // 申购上限
  applyLimitMarketValue: number; // 顶格申购需配市值
  isEstimateIpoPrice: boolean; // 是否预估发行价
  ipoPrice: number; // 发行价 预估值会因为募集资金、发行数量、发行费用等数据变动而变动，
  industryPeRate: number; // 行业市盈率
  isEstimateWinningRatio: boolean; // 是否预估中签率
  winningRatio: number; // 中签率 该字段为百分比字段，默认不展示 %，如 20 实际
  issuePeRate: number; // 发行市盈率
  applyTime: string; // 申购日期字符串（格式：yyyy-MM-dd）
  applyTimestamp: number; // 申购日期时间戳
  winningTime: string; // 公布中签日期字符串（格式：yyyy-MM-dd）
  winningTimestamp: number; // 公布中签日期时间戳
  isHasWon: boolean; // 是否已经公布中签号
  winningNumData: Array<WinningNumData>;
}

export interface HKIpoExData {
  ipoPriceMin: number;
  ipoPriceMax: number;
  listPrice: number;
  lotSize: number;
  entrancePrice: number;
  isSubscribeStatus: boolean;
  applyEndTime: string;
  applyEndTimestamp: number;
}

export interface USIpoExData {
  ipoPriceMin: number;
  ipoPriceMax: number;
  issueSize: number;
}

export interface IpoData {
  basic?: BasicIpoData;
  cnExData?: CNIpoExData;
  hkExData?: HKIpoExData;
  usExData?: USIpoExData;
}

export interface IpoListResult {
  hk: GetIpoListCommand;
  cn: GetIpoListCommand;
}
export interface GetIpoListCommand extends Message {
  market?: number;
  ipoList?: Array<IpoData>;
}

export interface GetPriceReminderCommand extends Message {
  secMarket?: number; //股票所属市场
  code?: string;
  market?: number; //整个市场
  priceReminderList?: Array<PriceReminder>;
}

export interface PriceReminder {
  security: CommonSecurity;
  name: string;
  itemList: Array<PriceReminderItem>;
}

export interface PriceReminderItem {
  key: number;
  type: number;
  value: number;
  note: string;
  freq: number;
  isEnable: boolean;
}

export interface SetPriceReminderCommand extends Message {
  market: number;
  code: string;
  op?: number;
  key?: number;
  remindType?: number;
  remindFreq?: number;
  value?: number;
  note?: string;
}

export interface ModifyOrderCommand extends Message {
  accId: string;
  tradeEnv: number;
  tradeMarket: number;
  orderId: string;
  modifyOp: number;
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
  accId: string;
  tradeEnv: number;
  tradeMarket: number;
  accFundsContent?: AccFundsContent;
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
  positionID: string;
  positionSide: number;
  code: string;
  name: string;
  qty: number;
  canSellQty: number;
  price: number;
  costPrice: number;
  val: number;
  plVal: number;
  plRatio: number;
  secMarket: number;
  td_plVal: number;
  td_trdVal: number;
  td_buyVal: number;
  td_buyQty: number;
  td_sellVal: number;
  td_sellQty: number;
  unrealizedPL: number;
  realizedPL: number;
  currency: number;
  trdMarket: number;
}

export interface AccPositionCommand extends Message {
  accId: string;
  tradeEnv: number;
  tradeMarket: number;
  positions?: Array<PositionMessageContent>;
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
  market?: number;
  isPlate?: number;
  securities?: Array<PlateItem>;
}

export interface RehabsContent {
  time: string;
  companyActFlag: number;
  fwdFactorA: number;
  fwdFactorB: number;
  bwdFactorA: number;
  bwdFactorB: number;
  splitBase: number;
  splitErt: number;
  joinBase: number;
  joinErt: number;
  bonusBase: number;
  bonusErt: number;
  transferBase: number;
  transferErt: number;
  allotBase: number;
  allotErt: number;
  allotPrice: number;
  addBase: number;
  addErt: number;
  addPrice: number;
  dividend: number;
  spDividend: number;
}

export interface RehabsCommand extends Message {
  security: PlateItem;
  rehabs?: Array<RehabsContent>;
}

export interface CapitalFlowContent {
  inFlow: number;
  mainInFlow: number;
  superInFlow: number;
  bigInFlow: number;
  midInFlow: number;
  smlInFlow: number;
  time: string;
}

export interface CapitalFlowCommand extends Message {
  security: PlateItem;
  periodType?: number; //1-实时 2-日 3-周 4-月
  beginTime?: string;
  endTime?: string;
  contentList?: Array<CapitalFlowContent>;
}

export interface CapitalDistributionContent {
  capitalInSuper: number;
  capitalInBig: number;
  capitalInMid: number;
  capitalInSmall: number;
  capitalOutSuper: number;
  capitalOutBig: number;
  capitalOutMid: number;
  capitalOutSmall: number;
  updateTime: string;
}

export interface CapitalDistributionCommand extends Message {
  security: PlateItem;
  content?: CapitalDistributionContent;
}

export interface StockOwnerPlatesCommand extends Message {
  securities: Array<PlateItem>;
}

export interface StocksCommand extends Message {
  market: number;
  stockType: number;
}

interface PlateItem {
  market: number;
  code: string;
}

export interface StockInPlateCommand extends Message {
  plate: PlateItem;
  stocks?: Array<StockContent>;
}

export interface PlatesCommand extends Message {
  markets: Array<number>;
}

export interface ConnectCommand extends Message {
  connected: boolean;
}

export interface SubOrUnSubCommand extends Message {
  securityList: Array<SubSecurity>;
  subTypeList: Array<Number>;
  unsub: boolean;
}

export interface SubSecurity {
  market: number;
  code: string;
  name: string;
  type: number;
}

export interface HistoryKLCommand extends Message {
  market: number;
  code: string;
  klType: number;
  beginDate: string;
  endDate: string;
}

export interface FutuHistoryKQuota {
  usedQuota: number;
  remainQuota: number;
  itemList: Array<FutuHistoryKQuotaItem>;
}

interface FutuHistoryKQuotaItem {
  market: number;
  code: string;
  name: string;
  requestTime: string;
  requestTimeStamp: number;
}

export interface FutuMarketState {
  marketHK: string;
  marketUS: string;
  marketSH: string;
  marketSZ: string;
  marketHKFuture: string;
  time: string;
  localTime: string;
  marketUSFuture: string;
  marketSGFuture: string;
  marketJPFuture: string;
}
