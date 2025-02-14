<script setup lang="ts">
import { useFutuStomp } from "@/stores/futu-stomp";
import { storeToRefs } from "pinia";
import { watch } from "vue";
import type { Message } from "@/types/message";
import { ReloadOutlined } from "@ant-design/icons-vue";

const {
  sendFtCommandOnNotifyEndPoint
} = useFutuStomp();
const {
  futuMarketState,
  futuHistoryKQuota,
  futuStompNotifyClientStatus
} = storeToRefs(useFutuStomp());

watch(futuStompNotifyClientStatus, (newVal) => {
  if (newVal) {
    const command: Message = {
      type: "MARKET_STATE"
    };
    sendFtCommandOnNotifyEndPoint(JSON.stringify(command));
    const command2: Message = {
      type: "KL_HISTORY_DETAIL"
    };
    sendFtCommandOnNotifyEndPoint(JSON.stringify(command2));
  }
});
const refreshMaretState = (): void => {
  let command: Message = {
    type: "MARKET_STATE"
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(command));
};
const refreshHistoryKQuote = (): void => {
  let command: Message = {
    type: "KL_HISTORY_DETAIL"
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(command));
};

</script>

<template>
  <div>
    <a-typography>
      <a-typography-title :level="5">市场状态</a-typography-title>
      <a-typography-paragraph>
        <a-row :gutter="[8,8]">
          <a-col :span="12">
            <a-card title="香港股市" size="small">{{ futuMarketState?.marketHK }}</a-card>
          </a-col>
          <a-col :span="12">
            <a-card title="香港期货" size="small">{{ futuMarketState?.marketHKFuture }}</a-card>
          </a-col>
        </a-row>
        <a-divider />
        <a-row :gutter="[8,8]">
          <a-col :span="12">
            <a-card title="上海股市" size="small">{{ futuMarketState?.marketSH }}</a-card>
          </a-col>
          <a-col :span="12">
            <a-card title="深圳股市" size="small">{{ futuMarketState?.marketSZ }}</a-card>
          </a-col>
        </a-row>
      </a-typography-paragraph>
    </a-typography>
    <a-typography>
      <a-typography-title :level="5">历史K线额度</a-typography-title>
      <a-typography-paragraph>
        <a-row :gutter="[8,8]">
          <a-col :span="12">
            <a-card title="额度" size="small">
              <div>已用:{{ futuHistoryKQuota?.usedQuota }}</div>
              <div>剩余:{{ futuHistoryKQuota?.remainQuota }}</div>
            </a-card>
          </a-col>
        </a-row>
      </a-typography-paragraph>
    </a-typography>
    <a-typography>
      <a-typography-title :level="5">操作</a-typography-title>
      <a-typography-paragraph>
        <a-space>
          <a-button type="primary" @click="refreshMaretState">
            刷新市场状态
            <template #icon>
              <ReloadOutlined />
            </template>
          </a-button>
          <a-button type="primary" @click="refreshHistoryKQuote">
            刷新历史K额度
            <template #icon>
              <ReloadOutlined />
            </template>
          </a-button>
        </a-space>
      </a-typography-paragraph>
    </a-typography>
  </div>
</template>

<style scoped lang="less">

</style>
