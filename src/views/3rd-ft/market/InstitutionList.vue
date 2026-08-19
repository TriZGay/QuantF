<script setup lang="ts">
//@ts-nocheck
import { useTimeoutFn } from "@vueuse/core";
import { useFutuStomp } from "@/stores/futu-stomp";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import type {
  InstitutionListCommand,
  InstitutionProfileCommand,
} from "@/types/message";
import AdvancedTable from "@/components/AdvancedTable/AdvancedTable.vue";
import { marketTypeToSelectOptions } from "@/api/code";

const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();
const { futuInstitutionList, futuInstitutionProfile } = storeToRefs(
  useFutuStomp()
);

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
  {
    title: "操作",
    key: "action",
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

const queryInstitutionProfile = (institutionId) => {
  let command: InstitutionProfileCommand = {
    type: "INSTITUTION_PROFILE",
    market: queryForm.value.market.bindValue,
    institutionId: institutionId,
  };
  sendFtCommandOnNotifyEndPoint(command);
};

watch(
  () => futuInstitutionProfile,
  (profile) => {
    profileVisible.value = true;
  },
  { deep: true }
);

const profileVisible = ref(false);
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
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button
              size="small"
              type="link"
              @click="queryInstitutionProfile(record.institutionId)"
              >概况</a-button
            >
          </a-space>
        </template>
      </template>
    </AdvancedTable>
    <a-modal v-model:visible="profileVisible" :width="900" title="概况">
      <a-descriptions :title="futuInstitutionProfile?.content?.institutionName">
        <a-descriptions-item label="持仓市值">
          {{ futuInstitutionProfile?.content?.positionValue }}
        </a-descriptions-item>
        <a-descriptions-item label="上期持仓市值">
          {{ futuInstitutionProfile?.content?.lastPositionValue }}
        </a-descriptions-item>
        <a-descriptions-item label="市值变化比例(%)">
          {{ futuInstitutionProfile?.content?.positionValueChangePct }}
        </a-descriptions-item>
        <a-descriptions-item label="总持仓数">
          {{ futuInstitutionProfile?.content?.totalHoldingCount }}
        </a-descriptions-item>
        <a-descriptions-item label="持仓变动数">
          {{ futuInstitutionProfile?.content?.holdingChangeCount }}
        </a-descriptions-item>
        <a-descriptions-item label="建仓标的数">
          {{ futuInstitutionProfile?.content?.newCount }}
        </a-descriptions-item>
        <a-descriptions-item label="清仓标的数">
          {{ futuInstitutionProfile?.content?.soldOutCount }}
        </a-descriptions-item>
        <a-descriptions-item label="增持标的数">
          {{ futuInstitutionProfile?.content?.increaseCount }}
        </a-descriptions-item>
        <a-descriptions-item label="减持标的数">
          {{ futuInstitutionProfile?.content?.decreaseCount }}
        </a-descriptions-item>
        <a-descriptions-item label="Top10持股占比(%)">
          {{ futuInstitutionProfile?.content?.top10Pct }}
        </a-descriptions-item>
        <a-descriptions-item label="Top10占比变动(%)">
          {{ futuInstitutionProfile?.content?.top10PctChange }}
        </a-descriptions-item>
        <a-descriptions-item label="披露日期">
          {{ futuInstitutionProfile?.content?.disclosureDate }}
        </a-descriptions-item>
        <a-descriptions-item label="机构简介">
          {{ futuInstitutionProfile?.content?.description }}
        </a-descriptions-item>
        <a-descriptions-item label="币种">
          {{ futuInstitutionProfile?.content?.currency }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<style scoped lang="less"></style>
