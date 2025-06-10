<script setup lang="ts">
import { useFutuStomp } from "@/stores/futu-stomp";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import type { ConnectCommand, GroupData, Message, UserGroupCommand, UserSecurityCommand } from "@/types/message";
import { useTimeoutFn } from "@vueuse/core";

const {
  sendFtCommandOnNotifyEndPoint
} = useFutuStomp();
const {
  futuMarketState,
  futuHistoryKQuota,
  futuUserGroup,
  futuUserSecurity
} = storeToRefs(useFutuStomp());

const { start: requestOvrContent } = useTimeoutFn(() => {
  const command: Message = {
    type: "MARKET_STATE"
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(command));
  const command2: Message = {
    type: "KL_HISTORY_DETAIL"
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(command2));
  const userGroupCommand: Message = {
    type: "USER_GROUP"
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(userGroupCommand));
}, 1000);
onMounted(() => {
  requestOvrContent();
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
const connectFutuD = (): void => {
  let command: ConnectCommand = {
    type: "CONNECT",
    isConnect: true
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(command));
};
const disconnectFutuD = (): void => {
  let command: ConnectCommand = {
    type: "CONNECT",
    isConnect: false
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(command));
};

const onUserSecurity = (group: GroupData): void => {
  let { groupName } = group;
  let userSecurityCommand: UserSecurityCommand = {
    type: "USER_SECURITY",
    groupName: groupName
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(userSecurityCommand));
  userSecurityModal.value = true;
};

const userSecurityModal = ref<boolean>(false);
</script>

<template>
  <div>
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
                <a-list-item-meta :description="item.basic.security.marketStr" >
                  <template #title>{{item.basic.security.code}}</template>
                </a-list-item-meta>
                <div>{{ item.basic.name}}</div>
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
