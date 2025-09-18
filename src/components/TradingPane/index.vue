<script setup>
import { klTypeToSelectOptions, rehabTypeToRadioOptions } from "@/api/code";
import VChart, { THEME_KEY } from "vue-echarts";
import { provide, ref } from "vue";
import dayjs from "dayjs";

import { useK } from "./k";
import { useVolumes } from "./volumes";
import { useMa } from "./ma";

provide(THEME_KEY, "dark");

const props = defineProps({
  height: {
    type: Number,
    default: 600
  },
  codes: {
    type: Array,
    default: []
  },
  k: {
    type: Object,
    default: {
      datetime: [],
      value: []
    }
  },
  volumes: {
    type: Object,
    default: {
      datetime: [],
      value: []
    }
  },
  ma: {
    type: Object,
    default: {
      datetime: [],
      ma5: [],
      ma10: [],
      ma20: [],
      ma30: [],
      ma60: [],
      ma120: []
    }
  }
});
const emit = defineEmits(["on-select-code", "on-select-indies"]);
const query = ref({
  code: "",
  granularity: 1,
  rehabType: "1",
  start: dayjs().startOf("month"),
  end: dayjs().startOf("day"),
  indies: []
});

const { kOptions } = useK(props);
const { volumeOptions } = useVolumes(props);
useMa(props, kOptions);

const handleCodeChange = (value) => {
  emit("on-select-code", query.value);
};

const handleIndiesChange = (value) => {
  emit("on-select-indies", query.value);
};

</script>

<template>
  <div class="search-area">
    <a-form layout="inline" :model="query">
      <a-form-item label="标的物" class="w-40">
        <a-select size="small" v-model:value="query.code" :options="codes" @change="handleCodeChange" />
      </a-form-item>
      <a-form-item label="周期" class="w-36">
        <a-select size="small" v-model:value="query.granularity" :options="klTypeToSelectOptions()" />
      </a-form-item>
      <a-form-item label="复权" class="w-72">
        <a-radio-group size="small" v-model:value="query.rehabType" :options="rehabTypeToRadioOptions()" />
      </a-form-item>
      <a-form-item label="开始时间">
        <a-date-picker size="small" v-model:value="query.start" show-time />
      </a-form-item>
      <a-form-item label="结束时间">
        <a-date-picker size="small" v-model:value="query.end" show-time />
      </a-form-item>
      <a-form-item label="指标">
        <a-checkbox-group size="small" v-model:value="query.indies" :options="[
        { label: 'MA(5/10/20/30/60/120)', value: 'ma' },
        { label:'BOLL(20,2.0)', value: 'boll' },
        { label: 'EMA(5/10/20/60/120)', value: 'ema' },
        { label: 'MACD(12,26,9)', value: 'macd' },
        { label: 'RSI(6,12,24)', value: 'rsi' },
        { label: 'KDJ(9,3,3)', value: 'kdj' },
        { label: 'ARBR(26)', value: 'arbr' }
        ]" @change="handleIndiesChange" />
      </a-form-item>
    </a-form>
  </div>
  <div :style="{height:height+'px'}" class="trading-pane">
    <v-chart :autoresize="true" class="k-area" group="trading-pane" :option="kOptions" />
    <v-chart :autoresize="true" class="order-area" />
    <v-chart :autoresize="true" class="volume-area" group="trading-pane" :option="volumeOptions" />
    <v-chart :autoresize="true" class="depth-area" />
  </div>
</template>

<style scoped>
.trading-pane {
  @apply grid grid-cols-4 grid-rows-6;
}

.order-area {
  @apply col-span-2 row-span-3;
  background-color: #000c17;
}

.depth-area {
  @apply col-start-4 col-end-6 row-start-4 row-end-7;
  background-color: #000c17;
}

.k-area {
  @apply col-span-3 row-span-4;
}

.volume-area {
  @apply col-span-3 row-span-2;
}
</style>
<style scoped lang="less">
</style>
