<script setup lang="ts">
import { klTypeToSelectOptions } from "@/api/code";
import { defineProps, ref, watch } from "vue";
import type { Dayjs } from "dayjs";
import type { HistoryKLCommand } from "@/types/message";
import { useFutuStomp } from "@/stores/futu-stomp";

const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();

const beginDate = ref<Dayjs>();
const endDate = ref<Dayjs>();

const visible = ref<boolean>(false);
const props = defineProps<{
  subType: number,
  market: number,
  code: string,
}>();
const klType = ref<number>(0);
const computeKlType = (subType: number) => {
  if (subType === 11) {
    //订阅1分K
    return 1;
  } else if (subType === 17) {
    //订阅3分K
    return 10;
  } else if (subType === 7) {
    //订阅5分K
    return 6;
  } else if (subType === 8) {
    //订阅15分K
    return 7;
  } else if (subType === 9) {
    //订阅30分K
    return 8;
  } else if (subType === 10) {
    //订阅60分K
    return 9;
  } else if (subType === 6) {
    //订阅日K
    return 2;
  } else if (subType === 12) {
    //订阅周K
    return 3;
  } else if (subType === 13) {
    //订阅月K
    return 4;
  } else if (subType === 15) {
    //订阅季K
    return 11;
  } else if (subType === 16) {
    //订阅年K
    return 5;
  }
};
const requestHistoryK = (): void => {
  let historyKLCommand: HistoryKLCommand = {
    type: "KL_HISTORY",
    market: props.market,
    code: props.code,
    klType: klType.value,
    beginDate: beginDate.value.format("YYYY-MM-DD"),
    endDate: endDate.value.format("YYYY-MM-DD")
  };
  sendFtCommandOnNotifyEndPoint(historyKLCommand);
};

const openModal = () => {
  klType.value = computeKlType(props.subType);
  visible.value = true;
};
</script>

<template>
  <div>
    <a-button type="link" size="small" @click="openModal">历史K</a-button>
    <a-modal v-model:visible="visible" title="选择时间段"
             @ok="requestHistoryK"
             @cancel="visible=false">
      <a-space>
        <a-select style="width: 100px" v-model:value="klType" size="small"
                  :options="klTypeToSelectOptions()">
        </a-select>
        <a-date-picker size="small" v-model:value="beginDate" />
        <a-date-picker size="small" v-model:value="endDate" />
      </a-space>
    </a-modal>
  </div>
</template>

<style scoped lang="less">

</style>
