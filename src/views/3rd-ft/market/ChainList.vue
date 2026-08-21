<script setup lang="ts">
//@ts-nocheck
import { useFutuStomp } from "@/stores/futu-stomp";
import { storeToRefs } from "pinia";
import AdvancedTable from "@/components/AdvancedTable/AdvancedTable.vue";
import { onMounted, ref, watch } from "vue";
import { CHAIN_TYPE, marketTypeToSelectOptions } from "@/api/code";
import { useTimeoutFn } from "@vueuse/core/index";
import type { ChainListCommand } from "@/types/message";

const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();
const { futuChainList } = storeToRefs(useFutuStomp());

const { start: requestChainList } = useTimeoutFn((filter) => {
  const command: ChainListCommand = {
    type: "INDUSTRIAL_CHAIN_LIST",
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
  page.value = 1;
  hasMore.value = true;
  requestChainList({
    ...form,
  });
};
const columns = ref([
  {
    title: "产业链ID",
    dataIndex: "chainId",
  },
  {
    title: "产业链类型",
    dataIndex: "chainType",
  },
  {
    title: "名称",
    dataIndex: "name",
  },
  {
    title: "详情描述",
    dataIndex: "detail",
  },
  {
    title: "市值",
    dataIndex: "marketCap",
  },
  {
    title: "成分股数量",
    dataIndex: "stocksNum",
  },
  {
    title: "相关股票",
    dataIndex: "relationSecurityList",
  },
  {
    title: "操作",
    key: "action",
    width: 350,
    fixed: "right",
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
const hasMore = ref(true);
const loading = ref(false);
const page = ref(1);
const resetFlag = ref(0); //todo
const nextPageRef = ref(null);

watch(
  () => futuChainList,
  (chainList) => {
    let dataList = chainList.value.content.dataList;
    if (dataList !== null && dataList.length > 0) {
      let { nextPage } = chainList.value.content;
      nextPageRef.value = nextPage;
      tableData.value = tableData.value.concat(dataList);
      if (nextPage == null) {
        hasMore.value = false;
      }
    }
    loading.value = false;
  },
  { deep: true }
);

const onLoadMore = (form) => {
  if (!hasMore.value) return;
  loading.value = true;
  if (page.value === 1) {
    requestChainList({
      market: 1,
    });
  } else {
    requestChainList({
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
        futuChainList?.content?.allCount
      }}</a-descriptions-item>
      <a-descriptions-item label="NextPgae">{{
        futuChainList?.content?.nextPage
      }}</a-descriptions-item>
    </a-descriptions>
    <AdvancedTable
      :loading="loading"
      :row-key="'chainId'"
      :virtual="true"
      :pagination="false"
      :scroll="{ y: 450, x: 1500 }"
      :has-more="hasMore"
      :reset-flag="resetFlag"
      @load-more="onLoadMore"
      :form="queryForm"
      @on-finish="onFinish"
      :columns="columns"
      :data-source="tableData"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'chainType'">
          {{ CHAIN_TYPE[record.chainType] }}
        </template>
        <template v-if="column.dataIndex === 'relationSecurityList'">
          <div v-for="r in record.relationSecurityList">
            {{r.marketStr}}-{{r.code}}
          </div>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small">详情</a-button>
          </a-space>
        </template>
      </template>
    </AdvancedTable>
  </div>
</template>

<style scoped lang="less"></style>
