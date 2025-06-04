<script setup lang="ts">
import { useFutuApi } from "@/stores/futu-api";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import type { AccountItem, AccountsCommand, PlaceOrderCommand } from "@/types/message";
import { useFutuStomp } from "@/stores/futu-stomp";
import { useDebounceFn, useTimeoutFn } from "@vueuse/core";

const { computedTradeCodes, computedAllStocks, computedOneStock } = storeToRefs(useFutuApi());
const { queryTradeCodes, queryAllStocks, queryStockByCode } = useFutuApi();
const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();
const {
  futuAccounts
} = storeToRefs(useFutuStomp());

const { start: sendAccountsCommand } = useTimeoutFn(() => {
  let accountsCommand: AccountsCommand = {
    type: "ACCOUNTS"
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(accountsCommand));
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
    market: value
  });
};

const onSelectStock = (id: number) => {
  queryStockByCode(id);
};

watch(computedOneStock, (newVal, oldVal) => {
  placeOrderForm.value.qty = newVal.lotSize;
});

const placeOrderForm = ref({
  account: "",
  tradeSide: 1,
  orderType: 1,
  code: "",
  qty: 0
});

const selectedMarket = ref(0);

const debounceQueryAllStock = useDebounceFn((val: string) => {
  queryAllStocks({
    market: selectedMarket.value,
    stockType: 6,
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
  sendFtCommandOnNotifyEndPoint(JSON.stringify(submitForm));
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
      <a-form-item :wrapper-col="{  span: 12,offset:3  }">
        <a-button type="primary" @click="onTrade">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="less">

</style>
