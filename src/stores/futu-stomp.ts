import { defineStore } from "pinia";
import { ref } from "vue";
import Stomp, { Client } from "stompjs";
import { notification } from "ant-design-vue";
import type {
  AccFundsCommand,
  AccountsCommand,
  AccPositionCommand,
  CapitalDistributionCommand,
  CapitalFlowCommand,
  FutuHistoryKQuota,
  FutuMarketState, GetPriceReminderCommand,
  HistoryOrderCommand,
  IncompleteOrderCommand,
  Message,
  RehabsCommand,
  StockFilterCommand,
  UserGroupCommand,
  UserSecurityCommand
} from "@/types/message";

export const useFutuStomp = defineStore("futu-stomp", () => {
  const futuStompNotifyClient = ref<Client>();
  const futuStompNotifyClientStatus = ref<boolean>(false);
  const futuHistoryKQuota = ref<FutuHistoryKQuota>();
  const futuMarketState = ref<FutuMarketState>();
  const futuCapitalDistribution = ref<CapitalDistributionCommand>();
  const futuCapitalFlow = ref<CapitalFlowCommand>();
  const futuRehabs = ref<RehabsCommand>();
  const futuAccounts = ref<AccountsCommand>();
  const futuAccPositions = ref<AccPositionCommand>();
  const futuStockFilters = ref<StockFilterCommand>();
  const futuAccFunds = ref<AccFundsCommand>();
  const futuHistoryOrders = ref<HistoryOrderCommand>();
  const futuIncompleteOrders = ref<IncompleteOrderCommand>();
  const futuUserGroup = ref<UserGroupCommand>();
  const futuUserSecurity = ref<UserSecurityCommand>();
  const futuGetPriceReminder = ref<GetPriceReminderCommand>();

  const connectToNotifyEndPoint = (): void => {
    futuStompNotifyClient.value = Stomp.client("ws://localhost:9090/notify");
    futuStompNotifyClient.value.connect({}, frame => {
      if (frame?.command === "CONNECTED") {
        futuStompNotifyClientStatus.value = true;
        //订阅通知topic
        futuStompNotifyClient.value?.subscribe("/quantx/topic/notify", msg => {
          notification.info({
            message: "Quantx-FUTU[Notify]:" + msg.body,
            placement: "bottomRight"
          });
        });
        //订阅历史K额度查询
        futuStompNotifyClient.value?.subscribe("/quantx/topic/history_k_quo", msg => {
          futuHistoryKQuota.value = JSON.parse(msg.body);
        });
        //订阅市场状态查询
        futuStompNotifyClient.value?.subscribe("/quantx/topic/market_state", msg => {
          futuMarketState.value = JSON.parse(msg.body);
        });
        //订阅资金分布查询
        futuStompNotifyClient.value?.subscribe("/quantx/topic/capital_distr", msg => {
          futuCapitalDistribution.value = JSON.parse(msg.body);
        });
        //订阅资金流向查询
        futuStompNotifyClient.value?.subscribe("/quantx/topic/capital_flow", msg => {
          futuCapitalFlow.value = JSON.parse(msg.body);
        });
        //订阅复权因为查询
        futuStompNotifyClient.value?.subscribe("/quantx/topic/rehabs", msg => {
          futuRehabs.value = JSON.parse(msg.body);
        });
        //订阅交易账户查询
        futuStompNotifyClient.value?.subscribe("/quantx/topic/accounts", msg => {
          futuAccounts.value = JSON.parse(msg.body);
        });
        //查询账户持仓
        futuStompNotifyClient.value?.subscribe("/quantx/topic/positions", msg => {
          futuAccPositions.value = JSON.parse(msg.body);
        });
        //选股
        futuStompNotifyClient.value?.subscribe("/quantx/topic/stock_filter", msg => {
          futuStockFilters.value = JSON.parse(msg.body);
        });
        //账户资金
        futuStompNotifyClient.value?.subscribe("/quantx/topic/acc_funds", msg => {
          futuAccFunds.value = JSON.parse(msg.body);
        });
        //查询历史订单
        futuStompNotifyClient.value?.subscribe("/quantx/topic/history_orders", msg => {
          futuHistoryOrders.value = JSON.parse(msg.body);
        });
        //查询未完成订单
        futuStompNotifyClient.value?.subscribe("/quantx/topic/incomplete_orders", msg => {
          futuIncompleteOrders.value = JSON.parse(msg.body);
        });
        //查询自选股分组
        futuStompNotifyClient.value?.subscribe("/quantx/topic/user_group", msg => {
          futuUserGroup.value = JSON.parse(msg.body);
        });
        //查询自选股列表
        futuStompNotifyClient.value?.subscribe("/quantx/topic/user_security", msg => {
          futuUserSecurity.value = JSON.parse(msg.body);
        });
        //查询到价提醒列表
        futuStompNotifyClient.value?.subscribe("/quantx/topic/get_price_reminders", msg => {
          futuGetPriceReminder.value = JSON.parse(msg.body);
        });
      }
    }, err => {
      futuStompNotifyClientStatus.value = false;
      notification.error({
        message: "Quantx-FUTU[Notify]连接失败:" + JSON.stringify(err),
        placement: "bottomRight"
      });
    });
  };

  const sendFtCommandOnNotifyEndPoint = (command: Message): void => {
    futuStompNotifyClient.value?.send("/quantx/ft/notify", {}, JSON.stringify(command));
  };

  const closeFtStompNotifyConn = (): void => {
    if (futuStompNotifyClient.value !== null) {
      futuStompNotifyClientStatus.value = false;
      futuStompNotifyClient.value?.disconnect(() => {
        notification.info({
          message: "关闭Quantx-FUTU[Notify]连接.",
          placement: "bottomRight"
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
    futuGetPriceReminder
  };
});
