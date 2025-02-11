<script setup lang="ts">
import { useFutuStomp } from "@/stores/futu-stomp";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import type { HistoryKLCommand, Message } from "@/types/message";
import { ReloadOutlined } from "@ant-design/icons-vue";
import { useFutuApi } from "@/stores/futu-api";
import { klTypeToSelectOptions, parseFTsubType, parseSecurityType } from "@/api/code";
import { TableColumnProps } from "ant-design-vue";
import type { SubscribeInfo } from "@/api/futu";
import type { Dayjs } from "dayjs";

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

const {
  querySubscribeInfo
} = useFutuApi();
const {
  subscribeInfoLoading,
  subscribeInfos
} = storeToRefs(useFutuApi());

onMounted(() => {
  querySubscribeInfo({
    size: 10,
    current: 1
  });
});
const subscribeInfoColumns = ref<TableColumnProps[]>([
  {
    title: "代码",
    dataIndex: "securityCode",
    fixed: "left"
  },
  {
    title: "名称",
    dataIndex: "securityName"
  },
  {
    title: "标的物类型",
    dataIndex: "securityType"
  },
  {
    title: "订阅类型",
    dataIndex: "subTypes"
  },
  {
    title: "操作",
    key: "action"
  }
]);

function onChangeTable(pagination: any, filters: any, sorter: any, { currentDataSource }) {
  querySubscribeInfo({
    size: pagination.pageSize,
    current: pagination.current
  });
}

const pagination = computed<Object>(() => {
  return {
    total: subscribeInfos.value.total,
    current: subscribeInfos.value.current,
    pageSize: subscribeInfos.value.pageSize,
    showTotal: (total: Number, range: Array<any>) => `${range[0]}-${range[1]} of ${total} items`
  };
});
const klType = ref<string>("1");
const beginDate = ref<Dayjs>();
const endDate = ref<Dayjs>();

const requestHistoryK = (row: SubscribeInfo): void => {
  let historyKLCommand: HistoryKLCommand = {
    type: "KL_HISTORY",
    market: row.securityMarket,
    code: row.securityCode,
    klType: parseInt(klType.value),
    beginDate: beginDate.value.format("YYYY-MM-DD"),
    endDate: endDate.value.format("YYYY-MM-DD")
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(historyKLCommand));
};
</script>

<template>
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
  <a-typography-title :level="5">订阅情况</a-typography-title>
  <a-typography-paragraph>
    <a-table class="searchResult" :columns="subscribeInfoColumns" :data-source="subscribeInfos.data"
             :loading="subscribeInfoLoading" :pagination="pagination" @change="onChangeTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'securityType'">
          {{ parseSecurityType(record.securityType) }}
        </template>
        <template v-if="column.dataIndex === 'subType'">
          {{ parseFTsubType(record.subType) }}
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-popover
              title="选择时间段"
              trigger="click">
              <a-button type="link" size="small">请求历史K</a-button>
              <template #content>
                <a-space>
                  <a-select style="width: 100px" v-model:value="klType" size="small" :options="klTypeToSelectOptions()">
                  </a-select>
                  <a-date-picker size="small" v-model:value="beginDate" />
                  <a-date-picker size="small" v-model:value="endDate" />
                  <a-button type="primary" size="small" @click="requestHistoryK(record)">确定</a-button>
                </a-space>
              </template>
            </a-popover>
          </a-space>
        </template>
      </template>
    </a-table>
  </a-typography-paragraph>
</template>

<style scoped lang="less">

</style>
