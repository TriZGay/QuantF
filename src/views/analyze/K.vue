<script lang="ts" setup>
import TradingPane from "@/components/TradingPane/index.vue";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useAnalyzeMeta } from "@/stores/ana-meta";
import { useAnalyzeKline } from "@/stores/ana-k";
import { useCapitalDistribution } from "@/components/CapitalDistributionButton/capitalDistribution";
import { useCapitalFlow } from "@/components/CapitalFlowButton/capiflow";
import dayjs from "dayjs";
import {
  klTypeToSelectOptions,
  parseRehabType,
  rehabTypeToRadioOptions,
} from "@/api/code";
import HistoryKLineButton from "@/components/HistoryKLineButton/index.vue";
import { useFutuStomp } from "@/stores/futu-stomp";
import { useTimeoutFn } from "@vueuse/core/index";
import type {
  CommonSecurity,
  IndicatorCalcCommand,
  IndicatorListCommand,
} from "@/types/message";
import type { CascaderProps } from "ant-design-vue";
import type {
  CascaderOptionType,
  ShowSearchType,
} from "ant-design-vue/lib/cascader";
import type { KLine } from "@/api/analyze";

const { sendCapitalDistributionCommand, capitalDistribution } =
  useCapitalDistribution();
const { sendCapitalFlowCommand, capitalFlow } = useCapitalFlow();

const analyzeMetaStores = useAnalyzeMeta();
const fetchCodes = analyzeMetaStores.requestMetaData;
const fetchTbInfoPerCode = analyzeMetaStores.requestTbInfoPerCode;
const { metaCodes, computedTbInfoPerCode } = storeToRefs(analyzeMetaStores);
// k线
const analyzeKStores = useAnalyzeKline();
const fetchKLine = analyzeKStores.requestK;
const { kData } = storeToRefs(analyzeKStores);
// 指标
const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();
const { futuIndicatorList, futuIndicatorCalcReq, futuIndicatorCalcResult } =
  storeToRefs(useFutuStomp());

const volumes = computed(() => {
  let xAxisTime: Array<String> = [];
  let volumes: Array<Array> = [];
  kData.value.forEach((k, index) => {
    xAxisTime.push(k.datetime);
    volumes.push([index, k.volume, k.openPrice > k.closePrice ? 1 : -1]);
  });
  return {
    datetime: xAxisTime,
    value: volumes,
  };
});

const kLines = computed(() => {
  let xAxisTime: Array<String> = [];
  let candelstickArray: Array<Array> = [];
  kData.value.forEach((k, index) => {
    xAxisTime.push(k.datetime);
    candelstickArray.push([k.openPrice, k.closePrice, k.lowPrice, k.highPrice]);
  });
  return {
    datetime: xAxisTime,
    value: candelstickArray,
  };
});

const query = ref({
  code: "",
  granularity: 1,
  rehabType: "1",
  start: dayjs().startOf("month"),
  end: dayjs().startOf("day"),
});

const metaCodeSelectOptions = ref<Array<any>>([]);

watch(
  () => query.value.code,
  (code) => {
    let realCode = code.split(":")[0];
    marketOnSelect.value = parseInt(code.split(":")[1]);
    codeOnSelect.value = realCode;
    klTypeForHistoryK.value = query.value.granularity;
    fetchTbInfoPerCode(
      query.value.granularity,
      realCode,
      parseInt(query.value.rehabType)
    );
  }
);

watch(
  () => metaCodes,
  (newVal) => {
    if (newVal.value.length > 0) {
      let options: Array<any> = [];
      newVal.value.forEach((item) => {
        options.push({
          icon: item.market,
          label: item.code,
          value: item.code + ":" + item.market,
        });
      });
      metaCodeSelectOptions.value = options;
      query.value.code = newVal.value[0].code + ":" + newVal.value[0].market;
    } else {
      metaCodeSelectOptions.value = [];
    }
  },
  { deep: true }
);

const marketOnSelect = ref();
const codeOnSelect = ref();
const klTypeForHistoryK = ref();

const onSelectGranularity = (value) => {
  query.value.code = "";
  query.value.granularity = value;
  fetchCodes({
    granularity: query.value.granularity,
  });
};

const onSearchDataset = () => {
  let realCode = query.value.code.split(":")[0];
  let market = parseInt(query.value.code.split(":")[1]);
  fetchKLine({
    rehabType: parseInt(query.value.rehabType),
    granularity: query.value.granularity,
    code: realCode,
    start: dayjs(query.value.start).format("YYYY-MM-DD HH:mm:ss"),
    end: dayjs(query.value.end).format("YYYY-MM-DD HH:mm:ss"),
  });
  sendCapitalDistributionCommand({
    marketCode: market,
    code: realCode,
  });
  //k线周期 1分K的码表值刚好为1-实时
  let periodType = query.value.granularity;
  sendCapitalFlowCommand(
    market,
    realCode,
    periodType,
    dayjs(query.value.start).format("YYYY-MM-DD HH:mm:ss"),
    dayjs(query.value.end).format("YYYY-MM-DD HH:mm:ss")
  );
};

onMounted(() => {
  fetchCodes({
    granularity: 1,
  });
  queryIndicatorList();
});

const indies = ref([]);

const { start: queryIndicatorList } = useTimeoutFn(() => {
  let command: IndicatorListCommand = {
    type: "INDICATOR_LIST",
    langType: 1,
  };
  sendFtCommandOnNotifyEndPoint(command);
}, 1000);

const indiesFilter: ShowSearchType["filter"] = (inputValue, path) => {
  return path.some(
    (option) =>
      option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  );
};

const computeIndicatorList = computed(() => {
  let options: CascaderProps["options"] = [];
  futuIndicatorList.value?.content?.indicatorList.forEach((item) => {
    let cascaderItem: CascaderOptionType = {};
    cascaderItem.value = item?.myLang?.shortName;
    cascaderItem.label = item?.myLang?.shortName + "-" + item?.myLang?.fullName;
    let inputs: CascaderProps["options"] = [];
    item?.myLang?.inputs?.forEach((i) => {
      let children: CascaderOptionType = {};
      children.value = i.index;
      children.label = i.name;
      inputs.push(children);
    });
    cascaderItem.children = inputs;
    options.push(cascaderItem);
  });
  return options;
});

const onSearchIndiesData = () => {
  indies.value.forEach((item) => {
    let shortName = item[0];
    let index = item[1];
    sendIndicatorCalcReq(shortName, index);
  });
};

const sendIndicatorCalcReq = (shortName: string, index: number) => {
  let kLine = kData.value.map((item: KLine) => {
    return {
      time: item.datetime,
      highPrice: item.highPrice,
      openPrice: item.openPrice,
      lowPrice: item.lowPrice,
      closePrice: item.closePrice,
    };
  });
  let klType = query.value.granularity;
  let sec: CommonSecurity = {
    market: parseInt(query.value.code.split(":")[1]),
    code: query.value.code.split(":")[0],
  };
  let command: IndicatorCalcCommand = {
    type: "INDICATOR_CALC",
    langType: 1,
    shortName: shortName,
    data: {
      security: sec,
      klType: klType,
      kLine: kLine,
    },
    num: kLine.length,
    inputs: [{ index: index, value: 20 }],
  };
  sendFtCommandOnNotifyEndPoint(command);
};
</script>
<template>
  <div>
    <a-descriptions title="该标的库内情况" size="small" :column="6">
      <a-descriptions-item label="标的物">
        {{ computedTbInfoPerCode?.kInfo?.code }} -
        {{ computedTbInfoPerCode?.name }}
      </a-descriptions-item>
      <a-descriptions-item label="复权">
        {{ parseRehabType(computedTbInfoPerCode?.kInfo?.rehabType) }}
      </a-descriptions-item>
      <a-descriptions-item label="K线表最大时间" span="2">
        {{ computedTbInfoPerCode?.kInfo?.maxTime }}
      </a-descriptions-item>
      <a-descriptions-item label="K线表最小时间" span="2">
        {{ computedTbInfoPerCode?.kInfo?.minTime }}
      </a-descriptions-item>
      <a-descriptions-item label="操作">
        <HistoryKLineButton
          :kl-type="klTypeForHistoryK"
          :market="marketOnSelect"
          :code="codeOnSelect"
        />
      </a-descriptions-item>
    </a-descriptions>
    <a-divider />
    <div class="search-area">
      <a-form :model="query" :label-col="{ span: 4 }" :label-align="'left'">
        <div class="grid grid-cols-[50%_50%] gap-4">
          <div>
            <a-form-item label="标的物">
              <a-select
                v-model:value="query.code"
                :options="metaCodeSelectOptions"
              >
                <template #option="{ value, label, icon }">
                  <span role="img" :aria-label="value" v-if="icon === 21">
                    🇨🇳
                  </span>
                  <span role="img" :aria-label="value" v-if="icon === 1">
                    hk
                  </span>
                  &nbsp;&nbsp;{{ label }}
                </template>
              </a-select>
            </a-form-item>
            <a-form-item label="周期">
              <a-select
                v-model:value="query.granularity"
                :options="klTypeToSelectOptions()"
                @select="onSelectGranularity"
              />
            </a-form-item>
            <a-form-item label="复权">
              <a-radio-group
                v-model:value="query.rehabType"
                :options="rehabTypeToRadioOptions()"
              />
            </a-form-item>
            <a-form-item label="时间范围">
              <div class="flex gap-4">
                <a-date-picker
                  v-model:value="query.start"
                  show-time
                  placeholder="开始时间"
                  class="flex-1"
                />
                <a-date-picker
                  v-model:value="query.end"
                  show-time
                  placeholder="结束时间"
                  class="flex-1"
                />
              </div>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="onSearchDataset">
                <template #icon><SearchOutlined /></template>
                查询
              </a-button>
            </a-form-item>
          </div>
          <div>
            <a-form-item label="指标">
              <a-cascader
                v-model:value="indies"
                multiple
                placeholder="选择指标..."
                :show-search="{ indiesFilter }"
                :options="computeIndicatorList"
              />
            </a-form-item>
            {{ indies }}
            {{ futuIndicatorCalcReq }}
            {{ futuIndicatorCalcResult }}
            <a-form-item>
              <a-button type="primary" @click="onSearchIndiesData">
                <template #icon><SearchOutlined /></template>
                查询
              </a-button>
            </a-form-item>
          </div>
        </div>
      </a-form>
    </div>
    <TradingPane
      :k="kLines"
      :volumes="volumes"
      :capital-distribution="capitalDistribution"
      :capital-flow="capitalFlow"
    />
  </div>
</template>
<style lang="less" scoped></style>
