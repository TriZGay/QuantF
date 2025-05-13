<script lang="ts" setup>
import AdvancedTable from "@/components/AdvancedTable/AdvancedTable.vue";
import { FT_MARKET, marketTypeToCheckBoxOptions } from "@/api/code";
import { computed, onMounted, reactive, ref } from "vue";
import { useFutuStomp } from "@/stores/futu-stomp";
import type { PlatesCommand, StockInPlateCommand } from "@/types/message";
import { useFutuApi } from "@/stores/futu-api";
import { storeToRefs } from "pinia";
import type { TableColumnProps } from "ant-design-vue";
import type { Plate } from "@/api/futu";

const { queryPlates } = useFutuApi();
const { plates, platesLoading } = storeToRefs(useFutuApi());

const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();
const markets = ref<Array<Number>>([]);

onMounted(() => {
  queryPlates({
    size: 10,
    current: 1
  });
});

const requestPlates = (): void => {
  let command: PlatesCommand = {
    type: "PLATES",
    markets: markets.value
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(command));
};
const pagination = computed<Object>(() => {
  return {
    total: plates.value.total,
    current: plates.value.current,
    pageSize: plates.value.pageSize,
    showTotal: (total: Number, range: Array<any>) => `${range[0]}-${range[1]} of ${total} items`
  };
});

function onChangeTable(tableProps: Object) {
  let queryForm = tableProps.form;
  let { pageSize, current } = tableProps.pagination;
  queryPlates({
    ...queryForm,
    size: pageSize,
    current: current
  });
}

const platesColumns = ref<TableColumnProps[]>([
  {
    title: "代码",
    dataIndex: "code",
    fixed: "left"
  },
  {
    title: "名称",
    dataIndex: "name"
  },
  {
    title: "市场",
    dataIndex: "market"
  },
  {
    title: "板块类型",
    dataIndex: "plateType"
  },
  {
    title: "操作",
    key: "action"
  }
]);

function onFinish(queryForm: Object) {
  queryPlates({
    ...queryForm,
    size: pagination.value.pageSize,
    current: 1
  });
}

const formState = reactive({
  name: {
    name: "名称",
    type: "input",
    bindValue: ""
  },
  market: {
    name: "行情市场",
    type: "select",
    kv: FT_MARKET,
    bindValue: Object.keys(FT_MARKET)[1]
  }
});

const requestStockInPlate = (plate: Plate): void => {
  let { marketCode, code } = plate;
  let command: StockInPlateCommand = {
    type: "STOCK_IN_PLATE",
    all: false,
    plates: [{
      market: marketCode,
      code: code
    }]
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(command));
};
const requestStocksInPlates = (): void => {
  let command: StockInPlateCommand = {
    type: "STOCK_IN_PLATE",
    all: true
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(command));
};
</script>
<template>
  <div class="stock-list-container">
    <a-space>
      <a-popover
        title="选择市场"
        trigger="click">
        <a-button type="primary">同步板块数据</a-button>
        <template #content>
          <a-space>
            <a-checkbox-group style="width: 100px" v-model:value="markets" size="small"
                              :options="marketTypeToCheckBoxOptions()">
            </a-checkbox-group>
            <a-button type="primary" size="small" @click="requestPlates()">确定</a-button>
          </a-space>
        </template>
      </a-popover>
      <a-popover
        title="是否全量同步"
        trigger="click">
        <a-button type="primary" disabled>全量同步板块下股票(缺陷,建议逐个板块同步 )</a-button>
        <template #content>
          <a-button type="primary" disabled @click="requestStocksInPlates()">确定</a-button>
        </template>
      </a-popover>
    </a-space>
    <a-divider />
    <AdvancedTable :form="formState" @on-finish="onFinish" :columns="platesColumns" :data-source="plates.data"
                   :loading="platesLoading" :pagination="pagination"
                   @on-change-table="onChangeTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a-popconfirm
              title="是否执行?"
              @confirm="requestStockInPlate(record)">
              <a-button type="link" size="small" disabled>查询板块下股票</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </AdvancedTable>

  </div>
</template>
<style scoped lang="less"></style>
