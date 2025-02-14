<script setup lang="ts">
import { useFutuApi } from "@/stores/futu-api";
import { storeToRefs } from "pinia";
import { computed, onMounted, reactive, ref, watch } from "vue";
import type { TableColumnsType } from "ant-design-vue";
import { DownOutlined } from "@ant-design/icons-vue";

import AdvancedTable from "@/components/AdvancedTable/AdvancedTable.vue";
import { FT_MARKET, FT_SECURITY_TYPE, FT_SUB_TYPE } from "@/api/code";
import type { Stock } from "@/api/futu";
import type { SubOrUnSubCommand } from "@/types/message";
import { useFutuStomp } from "@/stores/futu-stomp";

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
  },
  stockType: {
    name: "标的物类型",
    type: "select",
    kv: FT_SECURITY_TYPE,
    bindValue: Object.keys(FT_SECURITY_TYPE)[3]
  },
  delisting: {
    name: "是否退市",
    type: "select",
    kv: {
      1: "是",
      0: "否"
    },
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

const checkAll = ref(false);
const indeterminate = ref(false);

function onCheckAllChange(e: any) {
  indeterminate.value = false;
  selectedSubType.value = e.target.checked ? subTypes.value.map(v => v.value) : [];
}

const capitalForm = ref({
  periodType: 1,
  dateRange: []
});

const isRealTime = computed(() => capitalForm.value.periodType === 1);

// function onSyncCapitalFlow(row) {
//   let { market, code } = row;
//   let periodType = capitalForm.value.periodType;
//   syncCapitalFlow({
//     periodType: periodType,
//     market: market,
//     code: code,
//     beginDate: capitalForm.value.dateRange[0],
//     endDate: capitalForm.value.dateRange[1]
//   }).then(res => {
//     message.success(res.data);
//   }).catch(err => {
//     message.error(err.response.data);
//   });
//
// }

// function onSyncCapitalDtb(row) {
//   let { market, code } = row;
//   syncCapitalDistribution({
//     market: market,
//     code: code
//   }).then(res => {
//     message.success(res.data);
//   }).catch(err => {
//     message.error(err.response.data);
//   });
// }

// function onSyncRehabs(row) {
//   let { market, code } = row;
//   syncRehabs({
//     market: market,
//     code: code
//   }).then(res => {
//     message.success(res.data);
//   }).catch(err => {
//     message.error(err.response.data);
//   });
// }

// const kTypes = computed(() => {
//   let arr = [];
//   Object.keys(FT_KL_TYPE)
//     .filter(key => {
//       return parseInt(key) !== 0;
//     }).forEach(key => {
//     arr.push({
//       value: key,
//       label: FT_KL_TYPE[key]
//     });
//   });
//   return arr;
// });


watch(() => selectedSubType, (val) => {
  indeterminate.value = !!val.value.length && val.value.length < subTypes.value.length;
  checkAll.value = val.value.length === subTypes.value.length;
}, { deep: true });
</script>
<template>
  <div class="stock-list-container">
    <AdvancedTable :form="formState" @on-finish="onFinish" :columns="stocksColumns" :data-source="stocks.data"
                   :loading="stockLoading" :row-key="(record:Stock) => record.id" :pagination="pagination"
                   :scroll="{x:1000}" @on-change-table="onChangeTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a-dropdown :trigger="['click']">
              <a @click.prevent>
                订阅
                <DownOutlined />
              </a>
              <template #overlay>
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
            </a-dropdown>
            <a-dropdown :trigger="['click']">
              <a @click.prevent>
                查询资金流向
                <DownOutlined />
              </a>
              <template #overlay>
                <a-menu style="padding: 10px 10px;">
                  <a-form layout="horizontal" :model="capitalForm">
                    <a-form-item label="周期类型">
                      <a-radio-group v-model:value="capitalForm.periodType"
                                     name="periodTypeName">
                        <a-radio :value="1">实时</a-radio>
                        <a-radio :value="2">日</a-radio>
                        <a-radio :value="3">周</a-radio>
                        <a-radio :value="4">月</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="时间范围">
                      <a-range-picker v-model:value="capitalForm.dateRange"
                                      value-format="YYYY-MM-DD"
                                      :disabled="isRealTime" />
                    </a-form-item>
                  </a-form>
                  <a-button type="primary" size="small"
                            @click="onSyncCapitalFlow(record)">确定
                  </a-button>
                </a-menu>
              </template>
            </a-dropdown>
            <a @click="onSyncCapitalDtb(record)">查询资金分布</a>
            <a @click="onSyncRehabs(record)">查询复权因子</a>
          </a-space>
        </template>
      </template>
    </AdvancedTable>
  </div>
</template>
<style lang="less" scoped></style>
