<script setup lang="ts">
import { useFutuApi } from "@/stores/futu-api";
import { storeToRefs } from "pinia";
import { onMounted, ref, reactive } from "vue";
import type { FormInstance, TableColumnProps } from "ant-design-vue";
import { useFutuStomp } from "@/stores/futu-stomp";
import type {
  AccumulateFilter,
  BasicFilter, CustomIndicatorFilter,
  FinancialFilter,
  PatternFilter,
  StockFilterCommand
} from "@/types/message";

const { queryStockFilterCodes } = useFutuApi();
const { computedStockFilterCodes } = storeToRefs(useFutuApi());
const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();
const { futuStockFilters } = storeToRefs(useFutuStomp());
onMounted(() => {
  queryStockFilterCodes();
});

const columns = ref<TableColumnProps[]>([
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
    title: "简单属性结果"
  },
  {
    title: "累积属性结果"
  },
  {
    title: "财务属性结果"
  },
  {
    title: "形态技术指标属性结果"
  },
  {
    title: "操作",
    key: "action"
  }
]);

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 }
  }
};
//简单属性
const basicFilterForm = reactive<{ basicFilters: BasicFilter[] }>({
  basicFilters: []
});
const removeBasicFilter = (item: BasicFilter) => {
  let index = basicFilterForm.basicFilters.indexOf(item);
  if (index !== -1) {
    basicFilterForm.basicFilters.splice(index, 1);
  }
};
const addBasicFilter = () => {
  basicFilterForm.basicFilters.push({
    fieldName: 1,
    isNoFilter: true,
    sortDir: 0
  });
};
//累积属性
const accFilterForm = reactive<{ accFilters: AccumulateFilter[] }>({
  accFilters: []
});
const removeAccFilter = (item: AccumulateFilter) => {
  let index = accFilterForm.accFilters.indexOf(item);
  if (index !== -1) {
    accFilterForm.accFilters.splice(index, 1);
  }
};
const addAccFilter = () => {
  accFilterForm.accFilters.push({
    fieldName: 1,
    isNoFilter: true,
    sortDir: 0,
    days: 5
  });
};
//财务属性
const finFilterForm = reactive<{ finFilters: FinancialFilter[] }>({
  finFilters: []
});
const removeFinFilter = (item: FinancialFilter) => {
  let index = finFilterForm.finFilters.indexOf(item);
  if (index !== -1) {
    finFilterForm.finFilters.splice(index, 1);
  }
};
const addFinFilter = () => {
  finFilterForm.finFilters.push({
    fieldName: 1,
    isNoFilter: true,
    sortDir: 0,
    quarter: 1
  });
};
//形态属性
const patternFilterForm = reactive<{ patternFilters: PatternFilter[] }>({
  patternFilters: []
});
const removePatternFilter = (item: PatternFilter) => {
  let index = patternFilterForm.patternFilters.indexOf(item);
  if (index !== -1) {
    patternFilterForm.patternFilters.splice(index, 1);
  }
};
const addPatternFilter = () => {
  patternFilterForm.patternFilters.push({
    fieldName: 1,
    klType: 1,
    isNoFilter: true
  });
};

const sendFilterCommand = () => {
  let command: StockFilterCommand = {
    type: "STOCK_FILTER",
    market: 1,
    begin: 0,
    num: 100,
    baseFilterList: basicFilterForm.basicFilters,
    accumulateFilterList: accFilterForm.accFilters,
    financialFilterList: finFilterForm.finFilters,
    patternFilterList: patternFilterForm.patternFilters
    // customIndicatorFilterList?: Array<CustomIndicatorFilter>;
  };
  sendFtCommandOnNotifyEndPoint(JSON.stringify(command));
};
</script>

<template>
  <div class="filter-container">
    <a-row type="flex" justify="space-between" align="bottom">
      <a-col :span="12">
        <h4>简单属性</h4>
        <a-form
          name="dynamic_form_item"
          :model="basicFilterForm"
          v-bind="formItemLayoutWithOutLabel">
          <a-form-item
            v-for="(domain, index) in basicFilterForm.basicFilters"
            v-bind="index === 0 ? formItemLayout : {}"
            :label="index === 0 ? '筛选项' : ''">
            <a-select
              v-model:value="domain.fieldName"
              size="small"
              :options="computedStockFilterCodes.baseFiltersFields"
              style="width: 30%; margin-right: 8px"
            />
            <a-input-number
              v-model:value="domain.filterMin"
              size="small"
              placeholder="下限"
              style="width: 16%; "
            />
            ~
            <a-input-number
              v-model:value="domain.filterMax"
              size="small"
              placeholder="上限"
              style="width: 16%; margin-right: 8px"
            />
            <a-select
              v-model:value="domain.sortDir"
              size="small"
              :options="computedStockFilterCodes.sortDirs"
              style="width: 20%; margin-right: 8px"
            />
            <MinusCircleOutlined
              v-if="basicFilterForm.basicFilters.length > 1"
              class="dynamic-delete-button"
              :disabled="basicFilterForm.basicFilters.length === 1"
              @click="removeBasicFilter(domain)"
            />
          </a-form-item>
          <a-form-item v-bind="formItemLayoutWithOutLabel">
            <a-button type="dashed" style="width: 60%" @click="addBasicFilter">
              <PlusOutlined />
              增加
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :span="12">
        <h4>累积属性</h4>
        <a-form
          name="dynamic_form_item"
          :model="accFilterForm"
          v-bind="formItemLayoutWithOutLabel">
          <a-form-item
            v-for="(domain, index) in accFilterForm.accFilters"
            v-bind="index === 0 ? formItemLayout : {}"
            :label="index === 0 ? '筛选项' : ''">
            <a-select
              v-model:value="domain.fieldName"
              size="small"
              :options="computedStockFilterCodes.accumulateFiltersFields"
              style="width: 30%; margin-right: 8px"
            />
            <a-input-number
              v-model:value="domain.filterMin"
              size="small"
              placeholder="下限"
              style="width: 16%; "
            />
            ~
            <a-input-number
              v-model:value="domain.filterMax"
              size="small"
              placeholder="上限"
              style="width: 16%; margin-right: 8px"
            />
            <a-select
              v-model:value="domain.sortDir"
              size="small"
              :options="computedStockFilterCodes.sortDirs"
              style="width: 20%; margin-right: 8px"
            />
            <a-input-number
              v-model:value="domain.days"
              size="small"
              placeholder="累积时间"
              style="width: 16%; margin-right: 8px"
            />
            <MinusCircleOutlined
              v-if="accFilterForm.accFilters.length > 1"
              class="dynamic-delete-button"
              :disabled="accFilterForm.accFilters.length === 1"
              @click="removeAccFilter(domain)"
            />
          </a-form-item>
          <a-form-item v-bind="formItemLayoutWithOutLabel">
            <a-button type="dashed" style="width: 60%" @click="addAccFilter">
              <PlusOutlined />
              增加
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :span="12">
        <h4>财务属性</h4>
        <a-form
          name="dynamic_form_item"
          :model="finFilterForm"
          v-bind="formItemLayoutWithOutLabel">
          <a-form-item
            v-for="(domain, index) in finFilterForm.finFilters"
            v-bind="index === 0 ? formItemLayout : {}"
            :label="index === 0 ? '筛选项' : ''">
            <a-select
              v-model:value="domain.fieldName"
              size="small"
              :options="computedStockFilterCodes.financialFiltersFields"
              style="width: 30%; margin-right: 8px"
            />
            <a-input-number
              v-model:value="domain.filterMin"
              size="small"
              placeholder="下限"
              style="width: 16%; "
            />
            ~
            <a-input-number
              v-model:value="domain.filterMax"
              size="small"
              placeholder="上限"
              style="width: 16%; margin-right: 8px"
            />
            <a-select
              v-model:value="domain.sortDir"
              size="small"
              :options="computedStockFilterCodes.sortDirs"
              style="width: 20%; margin-right: 8px"
            />
            <a-select
              v-model:value="domain.quarter"
              size="small"
              :options="computedStockFilterCodes.financialQuarters"
              style="width: 20%; margin-right: 8px"
            />
            <MinusCircleOutlined
              v-if="finFilterForm.finFilters.length > 1"
              class="dynamic-delete-button"
              :disabled="finFilterForm.finFilters.length === 1"
              @click="removeFinFilter(domain)"
            />
          </a-form-item>
          <a-form-item v-bind="formItemLayoutWithOutLabel">
            <a-button type="dashed" style="width: 60%" @click="addFinFilter">
              <PlusOutlined />
              增加
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :span="12">
        <h4>形态技术指标属性</h4>
        <a-form
          name="dynamic_form_item"
          :model="patternFilterForm"
          v-bind="formItemLayoutWithOutLabel">
          <a-form-item
            v-for="(domain, index) in patternFilterForm.patternFilters"
            v-bind="index === 0 ? formItemLayout : {}"
            :label="index === 0 ? '筛选项' : ''">
            <a-select
              v-model:value="domain.fieldName"
              size="small"
              :options="computedStockFilterCodes.patternFiltersFields"
              style="width: 30%; margin-right: 8px"
            />
            <a-select
              v-model:value="domain.klType"
              size="small"
              :options="computedStockFilterCodes.klTypes"
              style="width: 20%; margin-right: 8px"
            />
            <a-input-number
              v-model:value="domain.consecutivePeriod"
              size="small"
              placeholder="连续周期"
              :min="1"
              :max="12"
              style="width: 18%; margin-right: 8px"
            />
            <MinusCircleOutlined
              v-if="patternFilterForm.patternFilters.length > 1"
              class="dynamic-delete-button"
              :disabled="patternFilterForm.patternFilters.length === 1"
              @click="removePatternFilter(domain)"
            />
          </a-form-item>
          <a-form-item v-bind="formItemLayoutWithOutLabel">
            <a-button type="dashed" style="width: 60%" @click="addPatternFilter">
              <PlusOutlined />
              增加
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :span="12">
        <h4>自定义技术指标属性</h4>
        <!--        <a-form-->
        <!--          name="dynamic_form_item"-->
        <!--          :model="basicFilterForm"-->
        <!--          v-bind="formItemLayoutWithOutLabel">-->
        <!--          <a-form-item-->
        <!--            v-for="(domain, index) in basicFilterForm.basicFilters"-->
        <!--            v-bind="index === 0 ? formItemLayout : {}"-->
        <!--            :label="index === 0 ? '筛选项' : ''">-->
        <!--            <a-select-->
        <!--              v-model:value="domain.fieldName"-->
        <!--              size="small"-->
        <!--              :options="computedStockFilterCodes.baseFiltersFields"-->
        <!--              style="width: 20%; margin-right: 8px"-->
        <!--            />-->
        <!--            <a-input-number-->
        <!--              v-model:value="domain.filterMin"-->
        <!--              size="small"-->
        <!--            />-->
        <!--            ~-->
        <!--            <a-input-number-->
        <!--              v-model:value="domain.filterMax"-->
        <!--              size="small"-->
        <!--              style="margin-right: 8px"-->
        <!--            />-->
        <!--            <MinusCircleOutlined-->
        <!--              v-if="basicFilterForm.basicFilters.length > 1"-->
        <!--              class="dynamic-delete-button"-->
        <!--              :disabled="basicFilterForm.basicFilters.length === 1"-->
        <!--              @click="removeBasicFilter(domain)"-->
        <!--            />-->
        <!--          </a-form-item>-->
        <!--          <a-form-item v-bind="formItemLayoutWithOutLabel">-->
        <!--            <a-button type="dashed" style="width: 60%" @click="addBasicFilter">-->
        <!--              <PlusOutlined />-->
        <!--              增加-->
        <!--            </a-button>-->
        <!--          </a-form-item>-->
        <!--        </a-form>-->
      </a-col>
    </a-row>
    <a-button type="primary" @click="sendFilterCommand">
      提交(共:{{ futuStockFilters?.stockFilterContent.allCount || 0 }}条)
    </a-button>
    <a-table :data-source="futuStockFilters?.stockFilterContent.dataList"
             :columns="columns"
             size="small">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'code'">
          {{ record.security.code }}
        </template>
        <template v-if="column.dataIndex === 'market'">
          {{ record.security.market }}
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped lang="less">

</style>
