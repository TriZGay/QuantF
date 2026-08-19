<script setup lang="ts">
//@ts-nocheck
import { useTimeoutFn } from "@vueuse/core";
import { useFutuStomp } from "@/stores/futu-stomp";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref, watch } from "vue";
import type { InstitutionListCommand } from "@/types/message";
import AdvancedTable from "@/components/AdvancedTable/AdvancedTable.vue";
import { marketTypeToSelectOptions } from "@/api/code";

const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();
const { futuInstitutionList } = storeToRefs(useFutuStomp());

const { start: requestInstitutionList } = useTimeoutFn((filter) => {
  const command: InstitutionListCommand = {
    type: "INSTITUTION_LIST",
    ...filter,
  };
  sendFtCommandOnNotifyEndPoint(command);
}, 1000);

onMounted(() => {
  onLoadMore();
});

const onFinish = (form) => {
  loading.value = true;
  tableData.value = [];
  requestInstitutionList({
    ...form,
  });
};
const columns = ref([
  {
    title: "机构ID",
    dataIndex: "institutionId",
  },
  {
    title: "机构名称",
    dataIndex: "institutionName",
  },
  {
    title: "持仓市值",
    dataIndex: "positionValue",
  },
  {
    title: "持仓市值变化",
    dataIndex: "positionValueChange",
  },
  {
    title: "持仓股票数",
    dataIndex: "positionCount",
  },
  {
    title: "持仓股票数变化",
    dataIndex: "positionCountChange",
  },
  {
    title: "披露日期",
    dataIndex: "disclosureDate",
  },
]);

const queryForm = ref({
  market: {
    name: "市场",
    type: "select",
    selectOptions: marketTypeToSelectOptions(),
    bindValue: "1",
  },
});

const tableData = ref([]);
const hasMore = ref(true); //todo
const loading = ref(false);
const page = ref(1);
const resetFlag = ref(0); //todo
const nextPageRef = ref(null);

watch(
  () => futuInstitutionList,
  (institutionList) => {
    if (institutionList.value.content.dataList.length > 0) {
      let { nextPage } = institutionList.value.content;
      nextPageRef.value = nextPage;
      tableData.value = tableData.value.concat(
        institutionList.value.content.dataList
      );
      loading.value = false;
    }
  },
  { deep: true }
);

const onLoadMore = (form) => {
  if (!hasMore.value) return;
  loading.value = true;
  if (page.value === 1) {
    requestInstitutionList({
      market: 1,
    });
  } else {
    requestInstitutionList({
      ...form,
      page: nextPageRef.value,
    });
  }
  page.value++;
};
</script>

<template>
  <div>
    <a-descriptions>
      <a-descriptions-item label="总条数">{{
        futuInstitutionList?.content?.allCount
      }}</a-descriptions-item>
      <a-descriptions-item label="NextPgae">{{
        futuInstitutionList?.content?.nextPage
      }}</a-descriptions-item>
      <a-descriptions-item label="币种">{{
        futuInstitutionList?.content?.currency
      }}</a-descriptions-item>
    </a-descriptions>
    <AdvancedTable
      :loading="loading"
      :row-key="'institutionId'"
      :virtual="true"
      :pagination="false"
      :scroll="{ y: 450 }"
      :has-more="hasMore"
      :reset-flag="resetFlag"
      @load-more="onLoadMore"
      :form="queryForm"
      @on-finish="onFinish"
      :columns="columns"
      :data-source="tableData"
    >
    </AdvancedTable>
  </div>
</template>

<style scoped lang="less"></style>
