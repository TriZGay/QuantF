<script setup lang="ts">
import { useFutuApi } from "@/stores/futu-api";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import type {
  AccountItem,
  AccountsCommand,
  HistoryOrderCommand, ModifyOrderCommand,
  OrderContent,
  PlaceOrderCommand
} from "@/types/message";
import { useFutuStomp } from "@/stores/futu-stomp";
import { useDebounceFn, useTimeoutFn } from "@vueuse/core";
import type { TableColumnProps } from "ant-design-vue";
import { useRoute } from "vue-router";

const route = useRoute();
const {
  computedTradeCodes,
  computedAllStocks,
  computedOneStock
} = storeToRefs(useFutuApi());
const { queryTradeCodes, queryAllStocks, queryStockByCode } = useFutuApi();
const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();
const { futuIncompleteOrders, futuHistoryOrders } = storeToRefs(useFutuStomp());
const {
  futuAccounts
} = storeToRefs(useFutuStomp());

const { start: sendAccountsCommand } = useTimeoutFn(() => {
  let accountsCommand: AccountsCommand = {
    type: "ACCOUNTS"
  };
  sendFtCommandOnNotifyEndPoint(accountsCommand);
}, 1000);

onMounted(() => {
  queryTradeCodes();
  sendAccountsCommand();
});

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 12 }
};

const onSelectMarket = (value: number) => {
  queryAllStocks({
    market: value,
    stockType: 3
  });
};

const onSelectStock = (code: string) => {
  queryStockByCode(code);
};

watch(computedOneStock, (newVal, oldVal) => {
  let { lotSize, marketCode, code } = newVal;
  placeOrderForm.value.qty = lotSize;
});

const placeOrderForm = ref({
  account: "",
  tradeSide: 1,
  orderType: 1,
  code: "",
  qty: 0
});

const selectedMarket = ref(0);
const selectedPrice = ref(0);

const debounceQueryAllStock = useDebounceFn((val: string) => {
  queryAllStocks({
    market: selectedMarket.value,
    stockType: 3,
    name: val
  });
}, 1000);

const onSearchStock = (val: string) => {
  debounceQueryAllStock(val);
};

const onTrade = () => {
  let account: AccountItem = JSON.parse(placeOrderForm.value.account);
  const submitForm: PlaceOrderCommand = {
    type: "PLACE_ORDER",
    accId: account.accID,
    tradeEnv: account.trdEnv,
    tradeMarket: account.trdMarketAuthList[0],
    tradeSide: placeOrderForm.value.tradeSide,
    orderType: placeOrderForm.value.orderType,
    code: placeOrderForm.value.code,
    qty: placeOrderForm.value.qty,
    //todo secMarket目前固定1
    secMarket: 1
  };
  sendFtCommandOnNotifyEndPoint(submitForm);
};

const onHistoryOrderAndIncompleteOrder = () => {
  let account: AccountItem = JSON.parse(placeOrderForm.value.account);
  const historySubmitForm: HistoryOrderCommand = {
    type: "HISTORY_ORDER",
    accId: account.accID,
    tradeEnv: account.trdEnv,
    tradeMarket: account.trdMarketAuthList[0]
  };
  const incompleteSubmitForm: HistoryOrderCommand = {
    type: "INCOMPLETE_ORDER",
    accId: account.accID,
    tradeEnv: account.trdEnv,
    tradeMarket: account.trdMarketAuthList[0]
  };
  sendFtCommandOnNotifyEndPoint(historySubmitForm);
  sendFtCommandOnNotifyEndPoint(incompleteSubmitForm);
};

const historyOrderColumns = ref<TableColumnProps[]>([
  {
    title: "订单ID",
    dataIndex: "orderID",
    fixed: "left"
  },
  {
    title: "订单ID-ex",
    dataIndex: "orderIDEx",
    fixed: "left"
  },
  {
    title: "代码",
    dataIndex: "code"
  },
  {
    title: "名称",
    dataIndex: "name"
  },
  {
    title: "交易方向",
    dataIndex: "trdSideStr"
  },
  {
    title: "订单类型",
    dataIndex: "orderTypeStr"
  },
  {
    title: "订单状态",
    dataIndex: "orderStatusStr"
  },
  {
    title: "订单数量",
    dataIndex: "qty"
  },
  {
    title: "订单价格",
    dataIndex: "price"
  },
  {
    title: "创建时间",
    dataIndex: "createTime"
  },
  {
    title: "最后更新时间",
    dataIndex: "updateTime"
  },
  {
    title: "成交数量",
    dataIndex: "fillQty"
  },
  {
    title: "成交均价",
    dataIndex: "fillAvgPrice"
  },
  {
    title: "最后的错误描述",
    dataIndex: "lastErrMsg"
  },
  {
    title: "证券所属市场",
    dataIndex: "secMarketStr"
  },
  {
    title: "用户备注字符串",
    dataIndex: "remark"
  },
  {
    title: "触发价格",
    dataIndex: "auxPrice"
  },
  {
    title: "跟踪类型",
    dataIndex: "trailTypeStr"
  },
  {
    title: "跟踪金额/百分比",
    dataIndex: "trailValue"
  },
  {
    title: "指定价差",
    dataIndex: "trailSpread"
  },
  {
    title: "货币类型",
    dataIndex: "currencyStr"
  },
  {
    title: "交易市场",
    dataIndex: "trdMarketStr"
  },
  {
    title: "操作",
    key: "action",
    fixed: "right"
  }
]);
const incompleteOrderColumns = ref<TableColumnProps[]>([
  {
    title: "订单ID",
    dataIndex: "orderID",
    fixed: "left"
  },
  {
    title: "订单ID-ex",
    dataIndex: "orderIDEx",
    fixed: "left"
  },
  {
    title: "代码",
    dataIndex: "code"
  },
  {
    title: "名称",
    dataIndex: "name"
  },
  {
    title: "交易方向",
    dataIndex: "trdSideStr"
  },
  {
    title: "订单类型",
    dataIndex: "orderTypeStr"
  },
  {
    title: "订单状态",
    dataIndex: "orderStatusStr"
  },
  {
    title: "订单数量",
    dataIndex: "qty"
  },
  {
    title: "订单价格",
    dataIndex: "price"
  },
  {
    title: "创建时间",
    dataIndex: "createTime"
  },
  {
    title: "最后更新时间",
    dataIndex: "updateTime"
  },
  {
    title: "成交数量",
    dataIndex: "fillQty"
  },
  {
    title: "成交均价",
    dataIndex: "fillAvgPrice"
  },
  {
    title: "最后的错误描述",
    dataIndex: "lastErrMsg"
  },
  {
    title: "证券所属市场",
    dataIndex: "secMarketStr"
  },
  {
    title: "用户备注字符串",
    dataIndex: "remark"
  },
  {
    title: "触发价格",
    dataIndex: "auxPrice"
  },
  {
    title: "跟踪类型",
    dataIndex: "trailTypeStr"
  },
  {
    title: "跟踪金额/百分比",
    dataIndex: "trailValue"
  },
  {
    title: "指定价差",
    dataIndex: "trailSpread"
  },
  {
    title: "货币类型",
    dataIndex: "currencyStr"
  },
  {
    title: "交易市场",
    dataIndex: "trdMarketStr"
  },
  {
    title: "操作",
    key: "action",
    fixed: "right"
  }
]);

watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.hasOwnProperty("account")) {
      placeOrderForm.value.account = newQuery.account;
    }
  },
  { deep: true, immediate: true }
);

const modifyForm = ref({
  modifyOp: 2
});

const onModify = (order: OrderContent) => {
  let { orderID } = order;
  let account: AccountItem = JSON.parse(placeOrderForm.value.account);
  let { modifyOp } = modifyForm.value;
  let modifyCommand: ModifyOrderCommand = {
    type: "MODIFY_ORDER",
    modifyOp: modifyOp,
    orderId: orderID,
    accId: account.accID,
    tradeEnv: account.trdEnv,
    tradeMarket: account.trdMarketAuthList[0]
  };
  sendFtCommandOnNotifyEndPoint(modifyCommand);
};
</script>

<template>
  <div class="order-container">
    <a-form
      v-bind="formItemLayout">
      <a-form-item label="交易账号">
        <a-select v-model:value="placeOrderForm.account">
          <a-select-option v-for="account in futuAccounts?.accounts" :value="JSON.stringify(account)">
            {{ account.simAccTypeStr }}-{{ account.trdEnvStr }}-{{ account.accID
            }}-{{ account.trdMarketAuthStrList.join(",") }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="交易方向">
        <a-select v-model:value="placeOrderForm.tradeSide" :options="computedTradeCodes.tradeSides" />
      </a-form-item>
      <a-form-item label="订单类型">
        <a-select v-model:value="placeOrderForm.orderType" :options="computedTradeCodes.orderTypes" />
      </a-form-item>
      <a-form-item label="市场&标的物">
        <a-space>
          <a-select
            style="width: 100px"
            :options="computedTradeCodes.marketTypes"
            v-model:value="selectedMarket"
            @select="onSelectMarket" />
          <a-select style="width: 200px"
                    show-search
                    :filter-option="false"
                    v-model:value="placeOrderForm.code"
                    @search="onSearchStock"
                    @select="onSelectStock">
            <a-select-option v-for="stock in computedAllStocks" :value="stock.code">{{ stock.name }}-{{ stock.code }}
            </a-select-option>
          </a-select>
        </a-space>
      </a-form-item>
      <a-form-item label="数量">
        <a-input-number v-model:value="placeOrderForm.qty" />
      </a-form-item>
      <a-form-item label="价格">
        <a-input-number v-model:value="selectedPrice" />
      </a-form-item>
      <a-form-item :wrapper-col="{  span: 12,offset:3  }">
        <a-space>
          <a-button type="primary" @click="onTrade">提交</a-button>
          <a-button type="primary" @click="onHistoryOrderAndIncompleteOrder">历史订单&未完成订单</a-button>
        </a-space>
      </a-form-item>
    </a-form>
    <a-typography>
      <a-typography-title :level="5">未完成订单</a-typography-title>
      <a-table
        :scroll="{ x: 2700 ,y:300 }"
        :data-source="futuIncompleteOrders?.incompleteOrderContent.orderList"
        :columns="incompleteOrderColumns"
        size="small">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-popover
                title="改撤单"
                trigger="click">
                <a-button type="link" size="small">改单/撤单</a-button>
                <template #content>
                  <a-form>
                    <a-form-item label="操作类型">
                      <a-select v-model:value="modifyForm.modifyOp" :options="computedTradeCodes.modifyOrderOps" />
                    </a-form-item>
                    <a-form-item>
                      <a-button type="primary" size="small" @click="onModify(record)">提交</a-button>
                    </a-form-item>
                  </a-form>
                </template>
              </a-popover>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-typography>
    <a-typography>
      <a-typography-title :level="5">历史订单</a-typography-title>
      <a-table
        :scroll="{ x: 2700,y:300 }"
        :data-source="futuHistoryOrders?.historyOrderContent.orderList"
        :columns="historyOrderColumns"
        size="small">
        <template #bodyCell="{column,record}">
          <template v-if="column.key=='action'">
            <a-space>

            </a-space>
          </template>
        </template>
      </a-table>
    </a-typography>
  </div>
</template>

<style scoped lang="less">

</style>
