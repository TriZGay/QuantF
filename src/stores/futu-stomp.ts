import { defineStore } from "pinia";
import { type Ref, ref } from "vue";
import Stomp, { Client } from "stompjs";
import { notification } from "ant-design-vue";
import type {
  AccFundsCommand,
  AccountsCommand,
  AccPositionCommand,
  AnalystConsensusCommand,
  CapitalDistributionCommand,
  CapitalFlowCommand,
  CoActionsBuyBackCommand,
  CoActionsDividendCommand,
  CompanyExecutiveBgCommand,
  CompanyExecutivesCommand,
  CompanyOpEffCommand,
  CompanyProfileCommand,
  CorporateActionsStockSplitsCommand,
  FutuHistoryKQuota,
  FutuMarketState,
  GetIpoListCommand,
  GetPriceReminderCommand,
  HistoryOrderCommand,
  IncompleteOrderCommand,
  IndicatorCalcCommand,
  IndicatorCalcResultCommand,
  IndicatorListCommand,
  InstitutionDistributionCommand,
  InstitutionListCommand,
  InstitutionProfileCommand,
  IpoListResult,
  Message,
  RehabsCommand,
  StockFilterCommand,
  StockInPlateCommand,
  UserGroupCommand,
  UserSecurityCommand,
  ValuePlateStockListCommand,
} from "@/types/message";

export const useFutuStomp = defineStore("futu-stomp", () => {
  const futuStompNotifyClient = ref<Client>();
  const futuStompNotifyClientStatus = ref<boolean>(false);
  const futuHistoryKQuota = ref<FutuHistoryKQuota>() as Ref<FutuHistoryKQuota>;
  const futuMarketState = ref<FutuMarketState>() as Ref<FutuMarketState>;
  const futuCapitalDistribution =
    ref<CapitalDistributionCommand>() as Ref<CapitalDistributionCommand>;
  const futuCapitalFlow = ref<CapitalFlowCommand>() as Ref<CapitalFlowCommand>;
  const futuRehabs = ref<RehabsCommand>() as Ref<RehabsCommand>;
  const futuAccounts = ref<AccountsCommand>() as Ref<AccountsCommand>;
  const futuAccPositions = ref<AccPositionCommand>() as Ref<AccPositionCommand>;
  const futuStockFilters = ref<StockFilterCommand>() as Ref<StockFilterCommand>;
  const futuAccFunds = ref<AccFundsCommand>() as Ref<AccFundsCommand>;
  const futuHistoryOrders =
    ref<HistoryOrderCommand>() as Ref<HistoryOrderCommand>;
  const futuIncompleteOrders =
    ref<IncompleteOrderCommand>() as Ref<IncompleteOrderCommand>;
  const futuUserGroup = ref<UserGroupCommand>() as Ref<UserGroupCommand>;
  const futuUserSecurity =
    ref<UserSecurityCommand>() as Ref<UserSecurityCommand>;
  const futuGetPriceReminder =
    ref<GetPriceReminderCommand>() as Ref<GetPriceReminderCommand>;
  const futuGetIpoList = ref<IpoListResult>({
    hk: {} as GetIpoListCommand,
    cn: {} as GetIpoListCommand,
  });
  const futuStocksInPlate =
    ref<StockInPlateCommand>() as Ref<StockInPlateCommand>;
  const futuValuationPlateStockList =
    ref<ValuePlateStockListCommand>() as Ref<ValuePlateStockListCommand>;
  const futuCompanyProfile =
    ref<CompanyProfileCommand>() as Ref<CompanyProfileCommand>;
  const futuCompanyExecutives =
    ref<CompanyExecutivesCommand>() as Ref<CompanyExecutivesCommand>;
  const futuCompanyExecutiveBg =
    ref<CompanyExecutiveBgCommand>() as Ref<CompanyExecutiveBgCommand>;
  const futuCompanyOpEff =
    ref<CompanyOpEffCommand>() as Ref<CompanyOpEffCommand>;
  const futuAnalystConsensus =
    ref<AnalystConsensusCommand>() as Ref<AnalystConsensusCommand>;
  const futuCoActionsDividend =
    ref<CoActionsDividendCommand>() as Ref<CoActionsDividendCommand>;
  const futuCoActionsBuyBack =
    ref<CoActionsBuyBackCommand>() as Ref<CoActionsBuyBackCommand>;
  const futuCoActionsStockSplits =
    ref<CorporateActionsStockSplitsCommand>() as Ref<CorporateActionsStockSplitsCommand>;
  const futuIndicatorList =
    ref<IndicatorListCommand>() as Ref<IndicatorListCommand>;
  const futuIndicatorCalcReq =
    ref<IndicatorCalcCommand>() as Ref<IndicatorCalcCommand>;
  const futuIndicatorCalcResult =
    ref<IndicatorCalcResultCommand>() as Ref<IndicatorCalcResultCommand>;
  const futuInstitutionList =
    ref<InstitutionListCommand>() as Ref<InstitutionListCommand>;
  const futuInstitutionProfile =
    ref<InstitutionProfileCommand>() as Ref<InstitutionProfileCommand>;
  const futuInstitutionDistribution =
    ref<InstitutionDistributionCommand>() as Ref<InstitutionDistributionCommand>;

  const connectToNotifyEndPoint = (): void => {
    futuStompNotifyClient.value = Stomp.client("/rt/notify");
    futuStompNotifyClient.value.connect(
      {},
      (frame) => {
        if (frame?.command === "CONNECTED") {
          futuStompNotifyClientStatus.value = true;
          //订阅通知topic
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/notify",
            (msg) => {
              notification.info({
                message: "Quantx-FUTU[Notify]:" + msg.body,
                placement: "bottomRight",
              });
            }
          );
          //订阅历史K额度查询
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/history_k_quo",
            (msg) => {
              futuHistoryKQuota.value = JSON.parse(msg.body);
            }
          );
          //订阅市场状态查询
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/market_state",
            (msg) => {
              futuMarketState.value = JSON.parse(msg.body);
            }
          );
          //订阅资金分布查询
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/capital_distr",
            (msg) => {
              futuCapitalDistribution.value = JSON.parse(msg.body);
            }
          );
          //订阅资金流向查询
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/capital_flow",
            (msg) => {
              futuCapitalFlow.value = JSON.parse(msg.body);
            }
          );
          //订阅复权因为查询
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/rehabs",
            (msg) => {
              futuRehabs.value = JSON.parse(msg.body);
            }
          );
          //订阅交易账户查询
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/accounts",
            (msg) => {
              futuAccounts.value = JSON.parse(msg.body);
            }
          );
          //查询账户持仓
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/positions",
            (msg) => {
              futuAccPositions.value = JSON.parse(msg.body);
            }
          );
          //选股
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/stock_filter",
            (msg) => {
              futuStockFilters.value = JSON.parse(msg.body);
            }
          );
          //账户资金
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/acc_funds",
            (msg) => {
              futuAccFunds.value = JSON.parse(msg.body);
            }
          );
          //查询历史订单
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/history_orders",
            (msg) => {
              futuHistoryOrders.value = JSON.parse(msg.body);
            }
          );
          //查询未完成订单
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/incomplete_orders",
            (msg) => {
              futuIncompleteOrders.value = JSON.parse(msg.body);
            }
          );
          //查询自选股分组
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/user_group",
            (msg) => {
              futuUserGroup.value = JSON.parse(msg.body);
            }
          );
          //查询自选股列表
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/user_security",
            (msg) => {
              futuUserSecurity.value = JSON.parse(msg.body);
            }
          );
          //查询到价提醒列表
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/get_price_reminders",
            (msg) => {
              futuGetPriceReminder.value = JSON.parse(msg.body);
            }
          );
          //ipo
          futuStompNotifyClient.value?.subscribe("/quantx/topic/ipo", (msg) => {
            let ipoResult = JSON.parse(msg.body);
            if (ipoResult.market === 1) {
              futuGetIpoList.value.hk = ipoResult;
            } else if (ipoResult.market === 21 || ipoResult.market === 22) {
              futuGetIpoList.value.cn = ipoResult;
            }
          });
          //板块下股票
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/stocks_in_plate",
            (msg) => {
              futuStocksInPlate.value = JSON.parse(msg.body);
            }
          );
          //板块/指数成分股估值列表
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/valuation_p_s_list",
            (msg) => {
              futuValuationPlateStockList.value = JSON.parse(msg.body);
            }
          );
          //公司概况
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/company_profile",
            (msg) => {
              futuCompanyProfile.value = JSON.parse(msg.body);
            }
          );
          //公司高管
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/company_executives",
            (msg) => {
              futuCompanyExecutives.value = JSON.parse(msg.body);
            }
          );
          //高管背景
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/company_executive_background",
            (msg) => {
              futuCompanyExecutiveBg.value = JSON.parse(msg.body);
            }
          );
          //经营效率
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/company_op_efficiency",
            (msg) => {
              futuCompanyOpEff.value = JSON.parse(msg.body);
            }
          );
          //分析师评级概述
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/ana_con",
            (msg) => {
              futuAnalystConsensus.value = JSON.parse(msg.body);
            }
          );
          //派息分红
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/co_act_dividend",
            (msg) => {
              futuCoActionsDividend.value = JSON.parse(msg.body);
            }
          );
          //回购
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/co_act_buyback",
            (msg) => {
              futuCoActionsBuyBack.value = JSON.parse(msg.body);
            }
          );
          //拆合股
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/co_act_ss",
            (msg) => {
              futuCoActionsStockSplits.value = JSON.parse(msg.body);
            }
          );
          //指标列表
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/indictor_list",
            (msg) => {
              futuIndicatorList.value = JSON.parse(msg.body);
            }
          );
          //指标计算请求
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/indictor_calc_req",
            (msg) => {
              futuIndicatorCalcReq.value = JSON.parse(msg.body);
            }
          );
          //指标计算结果推送
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/indictor_calc_push",
            (msg) => {
              futuIndicatorCalcResult.value = JSON.parse(msg.body);
            }
          );
          //机构列表
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/institution_list",
            (msg) => {
              futuInstitutionList.value = JSON.parse(msg.body);
            }
          );
          //机构概况
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/institution_profile",
            (msg) => {
              futuInstitutionProfile.value = JSON.parse(msg.body);
            }
          );
          //机构持股行业分布
          futuStompNotifyClient.value?.subscribe(
            "/quantx/topic/institution_distr",
            (msg) => {
              futuInstitutionDistribution.value = JSON.parse(msg.body);
            }
          );
        }
      },
      (err) => {
        futuStompNotifyClientStatus.value = false;
        notification.error({
          message: "Quantx-FUTU[Notify]连接失败:" + JSON.stringify(err),
          placement: "bottomRight",
        });
      }
    );
  };

  const sendFtCommandOnNotifyEndPoint = (command: Message): void => {
    futuStompNotifyClient.value?.send(
      "/quantx/ft/notify",
      {},
      JSON.stringify(command)
    );
  };

  const closeFtStompNotifyConn = (): void => {
    if (futuStompNotifyClient.value !== null) {
      futuStompNotifyClientStatus.value = false;
      futuStompNotifyClient.value?.disconnect(() => {
        notification.info({
          message: "关闭Quantx-FUTU[Notify]连接.",
          placement: "bottomRight",
        });
      });
    }
  };

  return {
    connectToNotifyEndPoint,
    sendFtCommandOnNotifyEndPoint,
    closeFtStompNotifyConn,
    futuHistoryKQuota,
    futuStompNotifyClientStatus,
    futuMarketState,
    futuCapitalDistribution,
    futuCapitalFlow,
    futuRehabs,
    futuAccounts,
    futuAccPositions,
    futuStockFilters,
    futuAccFunds,
    futuHistoryOrders,
    futuIncompleteOrders,
    futuUserGroup,
    futuUserSecurity,
    futuGetPriceReminder,
    futuGetIpoList,
    futuStocksInPlate,
    futuValuationPlateStockList,
    futuCompanyProfile,
    futuCompanyExecutives,
    futuCompanyExecutiveBg,
    futuCompanyOpEff,
    futuAnalystConsensus,
    futuCoActionsDividend,
    futuCoActionsBuyBack,
    futuCoActionsStockSplits,
    futuIndicatorList,
    futuIndicatorCalcReq,
    futuIndicatorCalcResult,
    futuInstitutionList,
    futuInstitutionProfile,
    futuInstitutionDistribution,
  };
});
