<script setup lang="ts">
import { useFutuApi } from "@/stores/futu-api";
import { storeToRefs } from "pinia";
import { computed, onMounted, reactive, ref, watch } from "vue";
import type { TableColumnsType } from "ant-design-vue";

import AdvancedTable from "@/components/AdvancedTable/AdvancedTable.vue";
import {
  FT_SUB_TYPE,
  marketTypeToCheckBoxOptions,
  marketTypeToSelectOptions,
  stockTypeToCheckBoxOptions,
  stockTypeToSelectOptions,
} from "@/api/code";
import type { Stock } from "@/api/futu";
import type {
  CapitalDistributionCommand,
  RehabsCommand,
  SetPriceReminderCommand,
  SnapshotCommand,
  StockInPlateByMarketMessage,
  StockOwnerPlatesCommand,
  StocksCommand,
  SubOrUnSubCommand,
} from "@/types/message";
import { useFutuStomp } from "@/stores/futu-stomp";
import HistoryKLineButton from "@/components/HistoryKLineButton/index.vue";
import SnapshotButton from "@/components/SnapshotButton/index.vue";

const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();

const { queryStocks, queryTradeCodes } = useFutuApi();
const { stockLoading, stocks, computedTradeCodes } = storeToRefs(useFutuApi());

const stocksColumns = ref<TableColumnsType>([
  {
    title: "股票代码",
    dataIndex: "code",
    fixed: "left",
    width: 120,
  },
  {
    title: "名称",
    dataIndex: "name",
    fixed: "left",
    width: 120,
  },
  {
    title: "每手数量",
    dataIndex: "lotSize",
    width: 100,
  },
  {
    title: "上市日期",
    dataIndex: "listingDate",
    width: 120,
  },
  {
    title: "是否退市",
    dataIndex: "delisting",
    width: 100,
  },
  {
    title: "行情市场",
    dataIndex: "market",
    width: 100,
  },
  {
    title: "所属交易所",
    dataIndex: "exchangeType",
    width: 120,
  },
  {
    title: "操作",
    key: "action",
    width: 420,
    fixed: "right",
  },
]);

const pagination = computed<Object>(() => {
  return {
    total: stocks.value.total,
    current: stocks.value.current,
    pageSize: stocks.value.pageSize,
    showTotal: (total: Number, range: Array<any>) =>
      `${range[0]}-${range[1]} of ${total} items`,
  };
});

onMounted(() => {
  queryStocks({
    delisting: 0,
    stockType: 3,
    size: 10,
    current: 1,
  });
  queryTradeCodes();
});

function onChangeTable(tableProps: Object) {
  let queryForm = tableProps.form;
  let { pageSize, current } = tableProps.pagination;
  queryStocks({
    ...queryForm,
    size: pageSize,
    current: current,
  });
}

const formState = reactive({
  code: {
    name: "代码",
    type: "input",
    bindValue: "",
  },
  name: {
    name: "名称",
    type: "input",
    bindValue: "",
  },
  market: {
    name: "市场",
    type: "select",
    selectOptions: marketTypeToSelectOptions(),
    bindValue: "1",
  },
  stockType: {
    name: "标的物类型",
    type: "select",
    selectOptions: stockTypeToSelectOptions(),
    bindValue: "3",
  },
  delisting: {
    name: "是否退市",
    type: "select",
    selectOptions: [
      { label: "否", value: "0" },
      { label: "是", value: "1" },
    ],
    bindValue: "0",
  },
});

function onFinish(queryForm: Object) {
  queryStocks({
    ...queryForm,
    size: pagination.value.pageSize,
    current: 1,
  });
}

const subTypes = computed(() => {
  let arr: Array<Object> = [];
  Object.keys(FT_SUB_TYPE).forEach((key) => {
    arr.push({
      label: FT_SUB_TYPE[key],
      value: key,
    });
  });
  return arr;
});

const selectedSubType = ref([]);

function onClick2Subscribe(row: Stock) {
  let { marketCode, code, name, stockTypeCode } = row;
  let subMessage: SubOrUnSubCommand = {
    type: "SUBSCRIPTION",
    securityList: [
      {
        market: marketCode,
        code: code,
        name: name,
        type: stockTypeCode,
      },
    ],
    subTypeList: selectedSubType.value,
    unsub: false,
  };
  sendFtCommandOnNotifyEndPoint(subMessage);
}

const checkAll = ref<boolean>(false);
const indeterminate = ref<boolean>(false);

function onCheckAllChange(e: any) {
  indeterminate.value = false;
  selectedSubType.value = e.target.checked
    ? subTypes.value.map((v) => v.value)
    : [];
}

watch(
  () => selectedSubType,
  (val) => {
    indeterminate.value =
      !!val.value.length && val.value.length < subTypes.value.length;
    checkAll.value = val.value.length === subTypes.value.length;
  },
  { deep: true }
);

const market = ref<string>("1");
const stockType = ref<string>("3");

const requestStocks = (): void => {
  let stocksCommand: StocksCommand = {
    type: "STOCKS",
    market: parseInt(market.value),
    stockType: parseInt(stockType.value),
  };
  sendFtCommandOnNotifyEndPoint(stocksCommand);
};

const requestStockOwnerPlates = (row: Stock): void => {
  let stockOwnerPlatesCommand: StockOwnerPlatesCommand = {
    type: "STOCK_OWNER_PLATE",
    securities: [
      {
        market: row.marketCode,
        code: row.code,
      },
    ],
  };
  sendFtCommandOnNotifyEndPoint(stockOwnerPlatesCommand);
};

const requestCapitalDistribution = (row: Stock): void => {
  let capitalDistributionCommand: CapitalDistributionCommand = {
    type: "CAPITAL_DISTRIBUTION",
    security: {
      market: row.marketCode,
      code: row.code,
    },
  };
  sendFtCommandOnNotifyEndPoint(capitalDistributionCommand);
};
const requestRehabs = (row: Stock): void => {
  let rehabsCommand: RehabsCommand = {
    type: "REHABS",
    security: {
      market: row.marketCode,
      code: row.code,
    },
  };
  sendFtCommandOnNotifyEndPoint(rehabsCommand);
};

const setPriceReminderForm = ref({
  op: 1,
  remindType: 1,
  remindFreq: 1,
  value: 0,
  note: "",
});

const requestSetPriceReminder = (row: Stock): void => {
  let setPriceReminderCommand: SetPriceReminderCommand = {
    type: "SET_PRICE_REMINDER",
    market: row.marketCode,
    code: row.code,
    op: setPriceReminderForm.value?.op,
    remindType: setPriceReminderForm.value?.remindType,
    remindFreq: setPriceReminderForm.value?.remindFreq,
    value: setPriceReminderForm.value?.value,
    note: setPriceReminderForm.value?.note,
  };
  sendFtCommandOnNotifyEndPoint(setPriceReminderCommand);
};

const stockInPlateMarket = ref<string>("1");
const requestStockInPlatesByMarket = () => {
  let command: StockInPlateByMarketMessage = {
    type: "STOCK_IN_PLATE_BY_MARKET",
    market: parseInt(stockInPlateMarket.value),
  };
  sendFtCommandOnNotifyEndPoint(command);
};
const plateSnapshotMarket = ref<string>("1");
const requestPlatesSnapshotsByMarket = () => {
  let command: SnapshotCommand = {
    type: "SNAPSHOT",
    market: parseInt(plateSnapshotMarket.value),
    isPlate: 1,
  };
  sendFtCommandOnNotifyEndPoint(command);
};
</script>
<template>
  <div class="stock-list-container">
    <a-space>
      <a-popover title="选择市场和标的物类型" trigger="click">
        <a-button type="primary">同步静态标的物</a-button>
        <template #content>
          <a-space>
            <a-select
              style="width: 100px"
              v-model:value="market"
              size="small"
              :options="marketTypeToCheckBoxOptions()"
            />
            <a-select
              style="width: 100px"
              v-model:value="stockType"
              size="small"
              :options="stockTypeToCheckBoxOptions()"
            ></a-select>
            <a-button type="primary" size="small" @click="requestStocks()"
              >确定</a-button
            >
          </a-space>
        </template>
      </a-popover>
      <a-popover title="选择市场" trigger="click">
        <a-button type="primary">批量同步板块下股票(按市场)</a-button>
        <template #content>
          <a-space>
            <a-radio-group
              style="width: 100px"
              v-model:value="stockInPlateMarket"
              size="small"
              :options="marketTypeToCheckBoxOptions()"
            >
            </a-radio-group>
            <a-button
              type="primary"
              size="small"
              @click="requestStockInPlatesByMarket()"
              >确定</a-button
            >
          </a-space>
        </template>
      </a-popover>
      <a-popover title="选择市场" trigger="click">
        <a-button type="primary">批量请求板块快照数据(按市场)</a-button>
        <template #content>
          <a-space>
            <a-radio-group
              style="width: 100px"
              v-model:value="plateSnapshotMarket"
              size="small"
              :options="marketTypeToCheckBoxOptions()"
            >
            </a-radio-group>
            <a-button
              type="primary"
              size="small"
              @click="requestPlatesSnapshotsByMarket()"
              >确定</a-button
            >
          </a-space>
        </template>
      </a-popover>
    </a-space>
    <a-divider />
    <AdvancedTable
      :form="formState"
      @on-finish="onFinish"
      :columns="stocksColumns"
      :data-source="stocks.data"
      :loading="stockLoading"
      :row-key="(record:Stock) => record.id"
      :pagination="pagination"
      :scroll="{ x: 1000 }"
      @on-change-table="onChangeTable"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <HistoryKLineButton
              :sub-type="11"
              :market="record.marketCode"
              :code="record.code"
            />
            <SnapshotButton :market="record.marketCode" :code="record.code" />
            <a-popover title="选择订阅类型" trigger="click">
              <a-button type="link" size="small">订阅</a-button>
              <template #content>
                <a-menu style="padding: 10px 10px">
                  <a-checkbox
                    v-model:checked="checkAll"
                    :indeterminate="indeterminate"
                    @change="onCheckAllChange"
                    >全选
                  </a-checkbox>
                  <br />
                  <a-checkbox-group
                    style="width: 100px"
                    v-model:value="selectedSubType"
                    :options="subTypes"
                  />
                  <br />
                  <a-button
                    type="primary"
                    size="small"
                    @click="onClick2Subscribe(record)"
                    >确定
                  </a-button>
                </a-menu>
              </template>
            </a-popover>
            <a-popover title="确定" trigger="click">
              <a-button type="link" size="small" disabled>板块数据</a-button>
              <template #content>
                <a-button
                  type="primary"
                  size="small"
                  @click="requestStockOwnerPlates(record)"
                  >确定</a-button
                >
              </template>
            </a-popover>
            <a-popover title="确定" trigger="click">
              <a-button type="link" size="small" disabled>资金分布</a-button>
              <template #content>
                <a-button
                  type="primary"
                  size="small"
                  @click="requestCapitalDistribution(record)"
                  >确定</a-button
                >
              </template>
            </a-popover>
            <a-popover title="确定" trigger="click">
              <a-button type="link" size="small" disabled>复权因子</a-button>
              <template #content>
                <a-button
                  type="primary"
                  size="small"
                  @click="requestRehabs(record)"
                  >确定</a-button
                >
              </template>
            </a-popover>
            <a-popover title="确定" trigger="click">
              <a-button type="link" size="small" disabled
                >设置到价提醒</a-button
              >
              <template #content>
                <a-form>
                  <a-form-item label="价格">
                    <a-input-number
                      v-model:value="setPriceReminderForm.value"
                    />
                  </a-form-item>
                  <a-form-item label="操作类型">
                    <a-select
                      v-model:value="setPriceReminderForm.op"
                      :options="computedTradeCodes?.setPriceReminderOps"
                    />
                  </a-form-item>
                  <a-form-item label="提醒类型">
                    <a-select
                      v-model:value="setPriceReminderForm.remindType"
                      :options="computedTradeCodes?.setPriceReminderTypes"
                    />
                  </a-form-item>
                  <a-form-item label="提醒频率">
                    <a-select
                      v-model:value="setPriceReminderForm.remindFreq"
                      :options="computedTradeCodes?.setPriceReminderFreqs"
                    />
                  </a-form-item>
                  <a-form-item label="备注">
                    <a-input v-model:value="setPriceReminderForm.note" />
                  </a-form-item>
                </a-form>
                <a-button
                  type="primary"
                  size="small"
                  @click="requestSetPriceReminder(record)"
                  >确定</a-button
                >
              </template>
            </a-popover>
          </a-space>
        </template>
      </template>
    </AdvancedTable>
  </div>
</template>
<style lang="less" scoped></style>
