<script setup lang="ts">
import { useFutuStomp } from "@/stores/futu-stomp";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import type {
  ConnectCommand,
  GetPriceReminderCommand,
  GroupData,
  Message,
  UserGroupCommand,
  UserSecurityCommand
} from "@/types/message";
import { useTimeoutFn } from "@vueuse/core";
import type { TableColumnProps } from "ant-design-vue";

const {
  sendFtCommandOnNotifyEndPoint
} = useFutuStomp();
const {
  futuMarketState,
  futuHistoryKQuota,
  futuUserGroup,
  futuUserSecurity,
  futuGetPriceReminder
} = storeToRefs(useFutuStomp());

const { start: requestOvrContent } = useTimeoutFn(() => {
  const command: Message = {
    type: "MARKET_STATE"
  };
  sendFtCommandOnNotifyEndPoint(command);
  const command2: Message = {
    type: "KL_HISTORY_DETAIL"
  };
  sendFtCommandOnNotifyEndPoint(command2);
  const userGroupCommand: UserGroupCommand = {
    type: "USER_GROUP"
  };
  sendFtCommandOnNotifyEndPoint(userGroupCommand);
  const getPriceReminderCommand: GetPriceReminderCommand = {
    type: "GET_PRICE_REMINDER",
    market: 1
  };
  sendFtCommandOnNotifyEndPoint(getPriceReminderCommand);
}, 1000);
onMounted(() => {
  requestOvrContent();
});

const refreshMaretState = (): void => {
  let command: Message = {
    type: "MARKET_STATE"
  };
  sendFtCommandOnNotifyEndPoint(command);
};
const refreshHistoryKQuote = (): void => {
  let command: Message = {
    type: "KL_HISTORY_DETAIL"
  };
  sendFtCommandOnNotifyEndPoint(command);
};
const connectFutuD = (): void => {
  let command: ConnectCommand = {
    type: "CONNECT",
    isConnect: true
  };
  sendFtCommandOnNotifyEndPoint(command);
};
const disconnectFutuD = (): void => {
  let command: ConnectCommand = {
    type: "CONNECT",
    isConnect: false
  };
  sendFtCommandOnNotifyEndPoint(command);
};

const onUserSecurity = (group: GroupData): void => {
  let { groupName } = group;
  let userSecurityCommand: UserSecurityCommand = {
    type: "USER_SECURITY",
    groupName: groupName
  };
  sendFtCommandOnNotifyEndPoint(userSecurityCommand);
  userSecurityModal.value = true;
};

const userSecurityModal = ref<boolean>(false);

const getPriceReminderColumns = ref<TableColumnProps[]>([
  {
    title: "代码",
    dataIndex: ["security", "code"],
    fixed: "left"
  },
  {
    title: "名称",
    dataIndex: "name"
  },
  {
    title: "市场",
    dataIndex: ["security", "marketStr"]
  }
]);

const reminderInnerColumns = ref<TableColumnProps[]>([
  {
    title: "Key",
    dataIndex: "key"
  },
  {
    title: "类型"
  },
  {
    title: "价格",
    dataIndex: "value"
  },
  {
    title: "频率"

  },
  {
    title: "是否可用"
  },
  {
    title: "备注"
  }
]);

</script>

<template>
  <div>
    <a-typography>
      <a-typography-title :level="5">到价提醒</a-typography-title>
      <a-typography-paragraph>
        <a-table size="small" :columns="getPriceReminderColumns"
                 :data-source="futuGetPriceReminder?.priceReminderList">
          <template #expandedRowRender>
            <a-table v-for="eachReminder in futuGetPriceReminder?.priceReminderList"
                     :columns="reminderInnerColumns"
                     size="small"
                     :data-source="eachReminder.itemList" :pagination="false">

            </a-table>
          </template>
        </a-table>
      </a-typography-paragraph>
    </a-typography>
    <a-typography>
      <a-typography-title :level="5">自选股分组</a-typography-title>
      <a-typography-paragraph>
        <a-list :grid="{gutter:8,column:8}" :data-source="futuUserGroup?.groupDataList">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-card hoverable @click="onUserSecurity(item)">{{ item.groupName }}</a-card>
            </a-list-item>
          </template>
        </a-list>
        <a-modal v-model:visible="userSecurityModal" title="自选股列表">
          <a-list :data-source="futuUserSecurity?.stocks">
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <a>edit</a>
                  <a>more</a>
                </template>
                <a-list-item-meta :description="item.basic.security.marketStr">
                  <template #title>{{ item.basic.security.code }}</template>
                </a-list-item-meta>
                <div>{{ item.basic.name }}</div>
              </a-list-item>
            </template>
          </a-list>
        </a-modal>
      </a-typography-paragraph>
    </a-typography>
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
          <a-button type="primary" @click="connectFutuD">
            连接FutuD
            <template #icon>
              <ReloadOutlined />
            </template>
          </a-button>
          <a-button type="primary" @click="disconnectFutuD">
            断开FutuD
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
