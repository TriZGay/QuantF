<script setup lang="ts">
import { klTypeToSelectOptions } from "@/api/code";
import { defineProps, ref } from "vue";
import type { Dayjs } from "dayjs";
import type { HistoryKLCommand } from "@/types/message";
import { useFutuStomp } from "@/stores/futu-stomp";

const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();

const beginDate = ref<Dayjs>();
const endDate = ref<Dayjs>();

const props = defineProps<{
  klType: number,
  market: number,
  code: string,
}>();

const requestHistoryK = (): void => {
  let historyKLCommand: HistoryKLCommand = {
    type: "KL_HISTORY",
    market: props.market,
    code: props.code,
    klType: props.klType,
    beginDate: beginDate.value.format("YYYY-MM-DD"),
    endDate: endDate.value.format("YYYY-MM-DD")
  };
  sendFtCommandOnNotifyEndPoint(historyKLCommand);
};
</script>

<template>
  <a-popover
    title="选择时间段"
    trigger="click">
    <a-button type="link" size="small">历史K</a-button>
    <template #content>
      <a-space>
        <a-select style="width: 100px" :value="klType" size="small"
                  :options="klTypeToSelectOptions()">
        </a-select>
        <a-date-picker size="small" v-model:value="beginDate" />
        <a-date-picker size="small" v-model:value="endDate" />
        <a-button type="primary" size="small" @click="requestHistoryK">确定</a-button>
      </a-space>
    </template>
  </a-popover>
</template>

<style scoped lang="less">

</style>
