<script setup lang="ts">
import { useFutuApi } from "@/stores/futu-api";
import { storeToRefs } from "pinia";
import { computed, onMounted, reactive, ref, watch } from "vue";
import type { TableColumnsType } from "ant-design-vue";

import AdvancedTable from "@/components/AdvancedTable/AdvancedTable.vue";
import {
  FT_SUB_TYPE,
  klTypeToSelectOptions,
  marketTypeToCheckBoxOptions,
  marketTypeToSelectOptions,
  stockTypeToCheckBoxOptions,
  stockTypeToSelectOptions
} from "@/api/code";
import type { Stock } from "@/api/futu";
import type {
  CapitalDistributionCommand,
  HistoryKLCommand,
  RehabsCommand,
  SnapshotCommand,
  StockOwnerPlatesCommand,
  StocksCommand,
  SubOrUnSubCommand
} from "@/types/message";
import { useFutuStomp } from "@/stores/futu-stomp";
import type { Dayjs } from "dayjs";

const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();

const { queryStocks } = useFutuApi();
const { stockLoading, stocks } = storeToRefs(useFutuApi());

const stocksColumns = ref<TableColumnsType>([
  {
    title: "股票代码",
    dataIndex: "code",
    fixed: "left",
    width: 120
  },
  {
    title: "名称",
    dataIndex: "name",
    fixed: "left",
    width: 120
  },
  {
    title: "每手数量",
    dataIndex: "lotSize",
    width: 100
  },
  {
    title: "上市日期",
    dataIndex: "listingDate",
    width: 120
  },
  {
    title: "是否退市",
    dataIndex: "delisting",
    width: 100
  },
  {
    title: "行情市场",
    dataIndex: "market",
    width: 100
  },
  {
    title: "所属交易所",
    dataIndex: "exchangeType",
    width: 120
  },
  {
    title: "操作",
    key: "action",
    width: 400,
    fixed: "right"
  }
]);

const pagination = computed<Object>(() => {
  return {
    total: stocks.value.total,
    current: stocks.value.current,
    pageSize: stocks.value.pageSize,
    showTotal: (total: Number, range: Array<any>) => `${range[0]}-${range[1]} of ${total} items`
  };
});

onMounted(() => {
  queryStocks({
    delisting: 0,
    stockType: 3,
    size: 10,
    current: 1
  });
});

function onChangeTable(tableProps: Object) {
  let queryForm = tableProps.form;
  let { pageSize, current } = tableProps.pagination;
  queryStocks({
    ...queryForm,
    size: pageSize,
    current: current
  });
}

const formState = reactive({
  code: {
    name: "代码",
    type: "input",
    bindValue: ""
  },
  name: {
    name: "名称",
    type: "input",
    bindValue: ""
  },
  market: {
    name: "市场",
    type: "select",
    selectOptions: marketTypeToSelectOptions(),
    bindValue: "1"
  },
  stockType: {
    name: "标的物类型",
    type: "select",
    selectOptions: stockTypeToSelectOptions(),
    bindValue: "3"
  },
  delisting: {
    name: "是否退市",
    type: "select",
    selectOptions: [
      { label: "否", value: "0" },
      { label: "是", value: "1" }],
    bindValue: "0"
  }
});

function onFinish(queryForm: Object) {
  queryStocks({
    ...queryForm,
    size: pagination.value.pageSize,
    current: 1
  });
}

const subTypes = computed(() => {
  let arr: Array<Object> = [];
  Object.keys(FT_SUB_TYPE).forEach(key => {
    arr.push({
      label: FT_SUB_TYPE[key],
      value: key
    });
  });
  return arr;
});


const selectedSubType = ref([]);

function onClick2Subscribe(row: Stock) {
  let { marketCode, code, name, stockTypeCode } = row;
  let subMessage: SubOrUnSubCommand = {
    type: "SUBSCRIPTION",
    securityList: [{
      market: marketCode,
      code: code,
      name: name,
      type: stockTypeCode
    }],
    subTypeList: selectedSubType.value,
    unsub: false
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(subMessage));
}

const checkAll = ref<boolean>(false);
const indeterminate = ref<boolean>(false);

function onCheckAllChange(e: any) {
  indeterminate.value = false;
  selectedSubType.value = e.target.checked ? subTypes.value.map(v => v.value) : [];
}

watch(() => selectedSubType, (val) => {
  indeterminate.value = !!val.value.length && val.value.length < subTypes.value.length;
  checkAll.value = val.value.length === subTypes.value.length;
}, { deep: true });

const market = ref<number>();
const stockType = ref<number>();

const requestStocks = (): void => {
  let stocksCommand: StocksCommand = {
    type: "STOCKS",
    market: market.value,
    stockType: stockType.value
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(stocksCommand));
};

const klType = ref<string>("1");
const beginDate = ref<Dayjs>();
const endDate = ref<Dayjs>();

const requestHistoryK = (row: Stock): void => {
  let historyKLCommand: HistoryKLCommand = {
    type: "KL_HISTORY",
    market: row.marketCode,
    code: row.code,
    klType: parseInt(klType.value),
    beginDate: beginDate.value.format("YYYY-MM-DD"),
    endDate: endDate.value.format("YYYY-MM-DD")
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(historyKLCommand));
};
const requestStockOwnerPlates = (row: Stock): void => {
  let stockOwnerPlatesCommand: StockOwnerPlatesCommand = {
    type: "STOCK_OWNER_PLATE",
    securities: [{
      market: row.marketCode,
      code: row.code
    }]
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(stockOwnerPlatesCommand));
};

const requestCapitalDistribution = (row: Stock): void => {
  let capitalDistributionCommand: CapitalDistributionCommand = {
    type: "CAPITAL_DISTRIBUTION",
    security: {
      market: row.marketCode,
      code: row.code
    }
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(capitalDistributionCommand));
};
const requestRehabs = (row: Stock): void => {
  let rehabsCommand: RehabsCommand = {
    type: "REHABS",
    security: {
      market: row.marketCode,
      code: row.code
    }
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(rehabsCommand));
};
const requestSnapshot = (row: Stock): void => {
  let snapshotCommand: SnapshotCommand = {
    type: "SNAPSHOT",
    securities: [{
      market: row.marketCode,
      code: row.code
    }]
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(snapshotCommand));
};
</script>
<template>
  <div class="stock-list-container">
    <a-space>
      <a-popover
        title="选择市场和标的物类型"
        trigger="click">
        <a-button type="primary">同步静态标的物</a-button>
        <template #content>
          <a-space>
            <a-select style="width: 100px" v-model:value="market" size="small"
                      :options="marketTypeToCheckBoxOptions()" />
            <a-select style="width: 100px" v-model:value="stockType" size="small"
                      :options="stockTypeToCheckBoxOptions()"></a-select>
            <a-button type="primary" size="small" @click="requestStocks()">确定</a-button>
          </a-space>
        </template>
      </a-popover>
    </a-space>
    <a-divider />
    <AdvancedTable :form="formState" @on-finish="onFinish" :columns="stocksColumns" :data-source="stocks.data"
                   :loading="stockLoading" :row-key="(record:Stock) => record.id" :pagination="pagination"
                   :scroll="{x:1000}" @on-change-table="onChangeTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a-popover
              title="选择时间段"
              trigger="click">
              <a-button type="link" size="small">历史K</a-button>
              <template #content>
                <a-space>
                  <a-select style="width: 100px" v-model:value="klType" size="small"
                            :options="klTypeToSelectOptions()">
                  </a-select>
                  <a-date-picker size="small" v-model:value="beginDate" />
                  <a-date-picker size="small" v-model:value="endDate" />
                  <a-button type="primary" size="small" @click="requestHistoryK(record)">确定</a-button>
                </a-space>
              </template>
            </a-popover>
            <a-popover
              title="选择订阅类型"
              trigger="click">
              <a-button type="link" size="small">订阅</a-button>
              <template #content>
                <a-menu style="padding: 10px 10px;">
                  <a-checkbox v-model:checked="checkAll" :indeterminate="indeterminate"
                              @change="onCheckAllChange">全选
                  </a-checkbox>
                  <br />
                  <a-checkbox-group style="width:100px" v-model:value="selectedSubType"
                                    :options="subTypes" />
                  <br />
                  <a-button type="primary" size="small"
                            @click="onClick2Subscribe(record)">确定
                  </a-button>
                </a-menu>
              </template>
            </a-popover>
            <a-popover title="确定" trigger="click">
              <a-button type="link" size="small">板块数据</a-button>
              <template #content>
                <a-button type="primary" size="small" @click="requestStockOwnerPlates(record)">确定</a-button>
              </template>
            </a-popover>
            <a-popover title="确定" trigger="click">
              <a-button type="link" size="small">快照数据</a-button>
              <template #content>
                <a-button type="primary" size="small" @click="requestSnapshot(record)">确定</a-button>
              </template>
            </a-popover>
            <a-popover title="确定" trigger="click">
              <a-button type="link" size="small">资金分布</a-button>
              <template #content>
                <a-button type="primary" size="small" @click="requestCapitalDistribution(record)">确定</a-button>
              </template>
            </a-popover>
            <a-popover title="确定" trigger="click">
              <a-button type="link" size="small">复权因子</a-button>
              <template #content>
                <a-button type="primary" size="small" @click="requestRehabs(record)">确定</a-button>
              </template>
            </a-popover>
          </a-space>
        </template>
      </template>
    </AdvancedTable>
  </div>
</template>
<style lang="less" scoped></style>
