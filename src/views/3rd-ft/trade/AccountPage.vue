<script setup lang="ts">
import { useFutuStomp } from "@/stores/futu-stomp";
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import type { AccountItem, AccountsCommand, AccPositionCommand, AccSubCommand } from "@/types/message";
import { useTimeoutFn } from "@vueuse/core";
import type { TableColumnsType } from "ant-design-vue";

const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();
const {
  futuAccounts,
  futuAccPositions
} = storeToRefs(useFutuStomp());

const { start: sendAccountsCommand } = useTimeoutFn(() => {
  let accountsCommand: AccountsCommand = {
    type: "ACCOUNTS"
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(accountsCommand));
}, 1000);

onMounted(() => {
  sendAccountsCommand();
});

const simulatorAccounts = computed<Array<AccountItem>>(() => {
  return futuAccounts.value?.accounts?.filter(acc => {
    return acc.simAccType != null;
  });
});

const realAccounts = computed<Array<AccountItem>>(() => {
  return futuAccounts.value?.accounts?.filter(acc => {
    return acc.simAccType == null;
  });
});
const requestAccSub = (acc: AccountItem): void => {
  let accSubscribeCommand: AccSubCommand = {
    type: "ACC_SUBSCRIBE",
    accSubscribeItems: [{
      accId: acc.accID,
      cardNum: acc.cardNum,
      uniCardNum: acc.uniCardNum
    }]
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(accSubscribeCommand));
};
const requestAccPosition = (acc: AccountItem, tradeMarket: number): void => {
  let accPositionCommand: AccPositionCommand = {
    type: "ACC_POSITION",
    accId: acc.accID,
    tradeEnv: acc.trdEnv,
    tradeMarket: tradeMarket
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(accPositionCommand));
  openPositionModal();
};
const { start: openPositionModal } = useTimeoutFn(() => {
  positionVisible.value = true;
}, 1000, {
  immediate: false
});
const positionVisible = ref<boolean>(false);
const positionsColumns = ref<TableColumnsType>([
  {
    title: "持仓ID",
    dataIndex: "positionID"
  }, {
    title: "持仓方向",
    dataIndex: "positionSideStr"
  }, {
    title: "代码",
    dataIndex: "code"
  }, {
    title: "名称",
    dataIndex: "name"
  }, {
    title: "持有数量",
    dataIndex: "qty"
  }, {
    title: "可用数量",
    dataIndex: "canSellQty"
  }, {
    title: "市价",
    dataIndex: "price"
  }, {
    title: "摊薄成本价",
    dataIndex: "costPrice"
  }, {
    title: "市值",
    dataIndex: "val"
  }, {
    title: "盈亏金额",
    dataIndex: "plVal"
  }, {
    title: "盈亏百分比",
    dataIndex: "plRatio"
  }, {
    title: "证券所属市场",
    dataIndex: "secMarketStr"
  }, {
    title: "今日盈亏金额",
    dataIndex: "td_plVal"
  }, {
    title: "今日交易额",
    dataIndex: "td_trdVal"
  }, {
    title: "今日买入总额",
    dataIndex: "td_buyVal"
  }, {
    title: "今日买入总量",
    dataIndex: "td_buyQty"
  }, {
    title: "今日卖出总额",
    dataIndex: "td_sellVal"
  }, {
    title: "今日卖出总量",
    dataIndex: "td_sellQty"
  }, {
    title: "未实现盈亏",
    dataIndex: "unrealizedPL"
  }, {
    title: "已实现盈亏",
    dataIndex: "realizedPL"
  }, {
    title: "货币类型",
    dataIndex: "currencyStr"
  }, {
    title: "交易市场",
    dataIndex: "trdMarketStr"
  }]);
</script>
<template>
  <div class="account-list-container">
    <a-modal v-model:visible="positionVisible" width="1000px" title="持仓">
      <a-table size="small" :scroll="{x:2400}" :data-source="futuAccPositions?.positions"
               :columns="positionsColumns">
        <template #bodyCell="{column,record}">
          <template v-if="column.dataIndex ==='positionSideStr'">
            <a-tag v-if="record.positionSideStr==='多仓'" color="red">{{ record.positionSideStr }}</a-tag>
            <a-tag v-if="record.positionSideStr==='空仓'" color="green">{{ record.positionSideStr }}</a-tag>
          </template>
        </template>
      </a-table>
    </a-modal>
    <a-typography>
      <a-typography-title :level="5">模拟账号</a-typography-title>
      <a-typography-paragraph>
        <a-row type="flex" :gutter="8" justify="start">
          <a-col :md="8" v-for="simAcc in simulatorAccounts">
            <a-card size="small" :title="simAcc.simAccTypeStr+'('+simAcc.accTypeStr+')'" style="margin-bottom: 16px">
              <div>
                <a-space>
                  <span>ACC_ID:</span>
                  <span style="font-weight: bold;font-style: italic">{{ simAcc.accID }}</span>
                  <a-tag color="success" v-if="simAcc.accStatus===0">
                    <template #icon>
                      <check-circle-outlined />
                    </template>
                    {{ simAcc.accStatusStr }}
                  </a-tag>
                  <a-tag color="error" v-if="simAcc.accStatus===1">
                    <template #icon>
                      <close-circle-outlined />
                    </template>
                    {{ simAcc.accStatusStr }}
                  </a-tag>
                </a-space>
              </div>
              <div>可交易市场:
                <a-space>
                  <span v-for="tradeMarket in simAcc.trdMarketAuthStrList">
                    {{ tradeMarket }}
                  </span>
                  <a v-for="tradeMarket in simAcc.trdMarketAuthList"
                     @click="requestAccPosition(simAcc,tradeMarket)">持仓</a>
                </a-space>
              </div>
              <template #extra>
                <a-space>
                  <a-popconfirm title="确认订阅"
                                @confirm="requestAccSub(simAcc)">
                    <a>订阅</a>
                  </a-popconfirm>
                  <a href="#">交易</a>
                </a-space>
              </template>
            </a-card>
          </a-col>
        </a-row>
      </a-typography-paragraph>
    </a-typography>
    <a-typography>
      <a-typography-title :level="5">真实账号</a-typography-title>
      <a-typography-paragraph>
        <a-row type="flex" :gutter="8" justify="start">
          <a-col :md="8" v-for="simAcc in realAccounts">
            <a-card size="small" :title="simAcc.simAccTypeStr+'('+simAcc.accTypeStr+')'" style="margin-bottom: 16px">
              <div>
                <a-space>
                  <span>ACC_ID:</span>
                  <span style="font-weight: bold;font-style: italic">{{ simAcc.accID }}</span>
                  <a-tag color="success" v-if="simAcc.accStatus===0">
                    <template #icon>
                      <check-circle-outlined />
                    </template>
                    {{ simAcc.accStatusStr }}
                  </a-tag>
                  <a-tag color="error" v-if="simAcc.accStatus===1">
                    <template #icon>
                      <close-circle-outlined />
                    </template>
                    {{ simAcc.accStatusStr }}
                  </a-tag>
                </a-space>
              </div>
              <div>{{ simAcc.accTypeStr }}</div>
              <div>
                <a-space>
                  <span>卡号:</span>
                  <span style="font-weight: bold;font-style: italic">{{ simAcc.uniCardNum || simAcc.cardNum }}</span>
                </a-space>
              </div>
              <div>可交易市场:[]</div>
              <template #extra>
                <a href="#">交易</a>
              </template>
            </a-card>
          </a-col>
        </a-row>
      </a-typography-paragraph>
    </a-typography>
  </div>
</template>
<style lang="less" scoped>
.searchResult {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 2px;
}
</style>
