import { defineStore } from "pinia";
import { ref } from "vue";
import Stomp, { Client } from "stompjs";
import { notification } from "ant-design-vue";
import type { FutuHistoryKQuota, FutuMarketState } from "@/types/message";

export const useFutuStomp = defineStore("futu-stomp", () => {
  const futuStompNotifyClient = ref<Client>();
  const futuStompNotifyClientStatus = ref<boolean>(false);
  const futuHistoryKQuota = ref<FutuHistoryKQuota>();
  const futuMarketState = ref<FutuMarketState>();

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
      }
    }, err => {
      futuStompNotifyClientStatus.value = false;
      notification.error({
        message: "Quantx-FUTU[Notify]连接失败:" + JSON.stringify(err),
        placement: "bottomRight"
      });
    });
  };

  const sendFtCommandOnNotifyEndPoint = (command: string): void => {
    futuStompNotifyClient.value?.send("/quantx/ft/notify", {}, command);
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
    futuMarketState
  };
});
