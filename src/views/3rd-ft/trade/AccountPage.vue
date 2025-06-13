<script setup lang="ts">
import { useFutuStomp } from "@/stores/futu-stomp";
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import type { AccFundsCommand, AccountItem, AccountsCommand, AccPositionCommand, AccSubCommand } from "@/types/message";
import type { TableColumnsType } from "ant-design-vue";
import { useTimeoutFn } from "@vueuse/core";
import { useRouter } from "vue-router";

const router = useRouter();
const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();
const {
  futuAccounts,
  futuAccPositions,
  futuAccFunds
} = storeToRefs(useFutuStomp());

const { start: sendAccountsCommand } = useTimeoutFn(() => {
  let accountsCommand: AccountsCommand = {
    type: "ACCOUNTS"
  };
  sendFtCommandOnNotifyEndPoint(accountsCommand);
}, 1000);

onMounted(() => {
  sendAccountsCommand();
});

const simulatorAccounts = computed(() => {
  return futuAccounts.value?.accounts?.filter(acc => {
    return acc.simAccType != null;
  });
});

const realAccounts = computed(() => {
  return futuAccounts.value?.accounts?.filter(acc => {
    return acc.simAccType == null;
  }).map(acc => {
    return {
      ...acc,
      loading: false
    };
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
  sendFtCommandOnNotifyEndPoint(accSubscribeCommand);
};
//持仓
const requestAccPosition = (acc: AccountItem, tradeMarket: number, simAccIdx: number): void => {
  let accPositionCommand: AccPositionCommand = {
    type: "ACC_POSITION",
    accId: acc.accID,
    tradeEnv: acc.trdEnv,
    tradeMarket: tradeMarket
  };
  sendFtCommandOnNotifyEndPoint(accPositionCommand);
  positionVisible.value = true;
};
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
//资金
const fundsVisible = ref<boolean>(false);
const requestAccFunds = (acc: AccountItem, tradeMarket: number, simAccIdx: number): void => {
  let accFundsCommand: AccFundsCommand = {
    type: "ACC_FUNDS",
    accId: acc.accID,
    tradeEnv: acc.trdEnv,
    tradeMarket: tradeMarket
  };
  sendFtCommandOnNotifyEndPoint(accFundsCommand);
  fundsVisible.value = true;
};

const navigateToPlaceOrder = (simAcc: AccountItem) => {
  router.push({
    name: "OrderPage",
    query: {
      account: JSON.stringify(simAcc)
    }
  });
};

</script>
<template>
  <div class="account-list-container">
    <a-modal v-model:visible="fundsVisible" width="1000px" title="资金">
      <a-descriptions bordered size="small">
        <a-descriptions-item label="最大购买力">{{ futuAccFunds?.accFundsContent.power }}</a-descriptions-item>
        <a-descriptions-item label="资产净值">{{ futuAccFunds?.accFundsContent.totalAssets }}</a-descriptions-item>
        <a-descriptions-item label="现金">{{ futuAccFunds?.accFundsContent.cash }}</a-descriptions-item>
        <a-descriptions-item label="证券市值">{{ futuAccFunds?.accFundsContent.marketVal }}</a-descriptions-item>
        <a-descriptions-item label="冻结资金">{{ futuAccFunds?.accFundsContent.frozenCash }}</a-descriptions-item>
        <a-descriptions-item label="计息金额">{{ futuAccFunds?.accFundsContent.debtCash }}</a-descriptions-item>
        <a-descriptions-item label="现金可提">{{ futuAccFunds?.accFundsContent.avlWithdrawalCash }}
        </a-descriptions-item>
        <a-descriptions-item label="币种">{{ futuAccFunds?.accFundsContent.currency }}</a-descriptions-item>
        <a-descriptions-item label="可用资金">{{ futuAccFunds?.accFundsContent.availableFunds }}</a-descriptions-item>
        <a-descriptions-item label="未实现盈亏">{{ futuAccFunds?.accFundsContent.unrealizedPL }}</a-descriptions-item>
        <a-descriptions-item label="已实现盈亏">{{ futuAccFunds?.accFundsContent.realizedPL }}</a-descriptions-item>
        <a-descriptions-item label="风控状态">{{ futuAccFunds?.accFundsContent.riskLevel }}</a-descriptions-item>
        <a-descriptions-item label="初始保证金">{{ futuAccFunds?.accFundsContent.initialMargin }}</a-descriptions-item>
        <a-descriptions-item label="维持保证金">{{ futuAccFunds?.accFundsContent.maintenanceMargin }}
        </a-descriptions-item>
        <a-descriptions-item label="分币种的现金、现金可提和现金购买力">
          {{ futuAccFunds?.accFundsContent.cashInfoList }}
        </a-descriptions-item>
        <a-descriptions-item label="卖空购买力">{{ futuAccFunds?.accFundsContent.maxPowerShort }}
        </a-descriptions-item>
        <a-descriptions-item label="现金购买力">{{ futuAccFunds?.accFundsContent.netCashPower }}
        </a-descriptions-item>
        <a-descriptions-item label="多头市值">{{ futuAccFunds?.accFundsContent.longMv }}</a-descriptions-item>
        <a-descriptions-item label="空头市值">{{ futuAccFunds?.accFundsContent.shortMv }}</a-descriptions-item>
        <a-descriptions-item label="在途资产">{{ futuAccFunds?.accFundsContent.pendingAsset }}</a-descriptions-item>
        <a-descriptions-item label="融资可提">{{ futuAccFunds?.accFundsContent.maxWithdrawal }}</a-descriptions-item>
        <a-descriptions-item label="风险状态">{{ futuAccFunds?.accFundsContent.riskStatus }}</a-descriptions-item>
        <a-descriptions-item label="保证金">{{ futuAccFunds?.accFundsContent.marginCallMargin }}</a-descriptions-item>
        <a-descriptions-item label="是否PDT账户">{{ futuAccFunds?.accFundsContent.isPdt }}
        </a-descriptions-item>
        <a-descriptions-item label="剩余日内交易次数">{{ futuAccFunds?.accFundsContent.pdtSeq }}
        </a-descriptions-item>
        <a-descriptions-item label="初始日内交易购买力">{{ futuAccFunds?.accFundsContent.beginningDTBP }}
        </a-descriptions-item>
        <a-descriptions-item label="剩余日内交易购买力">{{ futuAccFunds?.accFundsContent.remainingDTBP }}
        </a-descriptions-item>
        <a-descriptions-item label="日内交易待缴金额">{{ futuAccFunds?.accFundsContent.dtCallAmount }}
        </a-descriptions-item>
        <a-descriptions-item label="日内交易限制情况">{{ futuAccFunds?.accFundsContent.dtStatus }}
        </a-descriptions-item>
        <a-descriptions-item label="证券资产净值">{{ futuAccFunds?.accFundsContent.securitiesAssets }}
        </a-descriptions-item>
        <a-descriptions-item label="基金资产净值">{{ futuAccFunds?.accFundsContent.fundAssets }}
        </a-descriptions-item>
        <a-descriptions-item label="债券资产净值">{{ futuAccFunds?.accFundsContent.bondAssets }}
        </a-descriptions-item>
        <a-descriptions-item label="分市场资产信息">{{ futuAccFunds?.accFundsContent.marketInfoList }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
    <a-modal v-model:visible="positionVisible" width="1000px" title="持仓">
      <a-table size="small" :scroll="{x:2400}" :data-source="futuAccPositions?.positions"
               :columns="positionsColumns">
        <template #bodyCell="{column,record}">
          <template v-if="column.dataIndex ==='positionSideStr'">
            <a-tag>{{ record.positionSideStr }}</a-tag>
          </template>
          <template v-if="column.dataIndex==='plVal'">
            <a-tag v-if="record.plVal<0" color="green">{{ record.plVal }} ↓</a-tag>
            <a-tag v-if="record.plVal===0">{{ record.plVal }}</a-tag>
            <a-tag v-if="record.plVal>0" color="red">{{ record.plVal }} ↑</a-tag>
          </template>
        </template>
      </a-table>
    </a-modal>
    <a-typography>
      <a-typography-title :level="5">模拟账号</a-typography-title>
      <a-typography-paragraph>
        <a-row type="flex" :gutter="8" justify="start">
          <a-col :md="8" v-for="(simAcc,simAccIdx) in simulatorAccounts">
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
                  <a v-for="tradeMarket in simAcc.trdMarketAuthList"
                     @click="requestAccFunds(simAcc,tradeMarket)">资金</a>
                </a-space>
              </div>
              <template #extra>
                <a-space>
                  <a-popconfirm title="确认订阅"
                                @confirm="requestAccSub(simAcc)">
                    <a>订阅</a>
                  </a-popconfirm>
                  <a @click="navigateToPlaceOrder(simAcc)">交易</a>
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
</style>
