<script setup lang="ts">
//@ts-nocheck
import { useTimeoutFn } from "@vueuse/core";
import { useFutuStomp } from "@/stores/futu-stomp";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import type {
  InstitutionDistributionCommand,
  InstitutionHoldingChangeCommand,
  InstitutionHoldingListCommand,
  InstitutionListCommand,
  InstitutionProfileCommand,
} from "@/types/message";
import AdvancedTable from "@/components/AdvancedTable/AdvancedTable.vue";
import { marketTypeToSelectOptions } from "@/api/code";

const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();
const {
  futuInstitutionList,
  futuInstitutionProfile,
  futuInstitutionDistribution,
  futuInstitutionHoldingChange,
  futuInstitutionHoldingList,
} = storeToRefs(useFutuStomp());

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
  page.value = 1;
  hasMore.value = true;
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
  () => futuInstitutionList,
  (institutionList) => {
    let dataList = institutionList.value.content.dataList;
    if (dataList !== null && dataList.length > 0) {
      let { nextPage } = institutionList.value.content;
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

const queryInstitutionDistr = (institutionId) => {
  let command: InstitutionDistributionCommand = {
    type: "INSTITUTION_DISTR",
    market: queryForm.value.market.bindValue,
    institutionId: institutionId,
  };
  sendFtCommandOnNotifyEndPoint(command);
};

watch(
  () => futuInstitutionDistribution,
  (distr) => {
    distrVisible.value = true;
  },
  { deep: true }
);

const distrVisible = ref(false);
const distrColumns = ref([
  {
    title: "行业ID",
    dataIndex: "industryId",
  },
  {
    title: "行业名称",
    dataIndex: "industryName",
  },
  {
    title: "持仓市值",
    dataIndex: "positionValue",
  },
  {
    title: "行业占比(%)",
    dataIndex: "portfolioPct",
  },
]);

//持仓变动
const queryInstitutionHoldingChange = (form) => {
  let command: InstitutionHoldingChangeCommand = {
    type: "INSTITUTION_HOLDING_CHANGE",
    market: queryForm.value.market.bindValue,
    institutionId: holdingChangeInstitutionId.value,
    ...form,
  };
  sendFtCommandOnNotifyEndPoint(command);
};

const holdingChangeInstitutionId = ref();
const holdingChangeVisible = ref(false);
const holdingChangeColumns = ref([
  {
    title: "代码",
    dataIndex: ["security", "code"],
  },
  {
    title: "名称",
    dataIndex: "name",
  },
  {
    title: "持股比例(%)",
    dataIndex: "portfolioPct",
  },
  {
    title: "变动股数",
    dataIndex: "changeShares",
  },
  {
    title: "变动比例(%)",
    dataIndex: "changePct",
  },
  {
    title: "持仓时间",
    dataIndex: "holdingDate",
  },
  {
    title: "披露来源",
    dataIndex: "source",
  },
]);
const holdingChangeTableData = ref([]);
const holdingChangeHasMore = ref(true);
const holdingChangeLoading = ref(false);
const holdingChangePage = ref(1);
const holdingChangeResetFlag = ref(0); //todo
const holdingChangeNextPageRef = ref(null);

const cancelHoldingChange = (e) => {
  holdingChangeVisible.value = false;
  holdingChangePage.value = 1;
  holdingChangeHasMore.value = true;
  holdingChangeTableData.value = [];
};

const holdingChangeOnFinish = (form) => {
  holdingChangeLoading.value = true;
  holdingChangeTableData.value = [];
  holdingChangePage.value = 1;
  holdingChangeHasMore.value = true;
  queryInstitutionHoldingChange(form);
};

const onClickHoldingChange = (institutionId) => {
  holdingChangeInstitutionId.value = institutionId;
  holdingChangeOnLoadMore({
    institutionId: institutionId,
  });
};

const holdingChangeOnLoadMore = (form) => {
  if (!holdingChangeHasMore.value) return;
  holdingChangeLoading.value = true;
  if (holdingChangePage.value === 1) {
    queryInstitutionHoldingChange(form);
  } else {
    queryInstitutionHoldingChange({
      ...form,
      page: holdingChangeNextPageRef.value,
    });
  }
  holdingChangePage.value++;
};

const holdingChangeQueryForm = ref({
  changeType: {
    name: "变动类型",
    type: "select",
    selectOptions: [
      { label: "建仓", value: 1 },
      { label: "清仓", value: 2 },
      { label: "增仓", value: 3 },
      { label: "减仓", value: 4 },
    ],
    bindValue: 1,
  },
});

watch(
  () => futuInstitutionHoldingChange,
  (holdingChange) => {
    let dataList = holdingChange.value.content.dataList;
    if (dataList !== null && dataList.length > 0) {
      let { nextPage } = holdingChange.value.content;
      holdingChangeNextPageRef.value = nextPage;
      holdingChangeTableData.value =
        holdingChangeTableData.value.concat(dataList);
      if (nextPage == null) {
        holdingChangeHasMore.value = false;
      }
    }
    holdingChangeLoading.value = false;
    holdingChangeVisible.value = true;
  },
  { deep: true }
);

//持股列表
const queryInstitutionHoldingList = (form) => {
  let command: InstitutionHoldingListCommand = {
    type: "INSTITUTION_HOLDING_LIST",
    market: queryForm.value.market.bindValue,
    institutionId: holdingListInstitutionId.value,
    ...form,
  };
  sendFtCommandOnNotifyEndPoint(command);
};

const holdingListInstitutionId = ref();
const holdingListColumns = ref([
  {
    title: "代码",
    dataIndex: ["security", "code"],
  },
  {
    title: "名称",
    dataIndex: "name",
  },
  {
    title: "所属行业",
    dataIndex: "industryName",
  },
  {
    title: "持股市值",
    dataIndex: "holdingValue",
  },
  {
    title: "持股比例-占股票总市值(%)",
    dataIndex: "holdingPct",
  },
  {
    title: "上期持股比例(%)",
    dataIndex: "lastHoldingPct",
  },
  {
    title: "变动股数",
    dataIndex: "changeShares",
  },
  {
    title: "占机构总仓位比例(%)",
    dataIndex: "portfolioPct",
  },
  {
    title: "变动比例(%)",
    dataIndex: "changePct",
  },
  {
    title: "持仓时间",
    dataIndex: "holdingDate",
  },
  {
    title: "披露来源",
    dataIndex: "source",
  },
]);
const holdingListVisible = ref(false);
const holdingListTableData = ref([]);
const holdingListHasMore = ref(true);
const holdingListLoading = ref(false);
const holdingListPage = ref(1);
const holdingListResetFlag = ref(0); //todo
const holdingListNextPageRef = ref(null);

const holdingListQueryForm = ref({
  changeType: {
    name: "变动类型",
    type: "select",
    selectOptions: [
      { label: "建仓", value: 1 },
      { label: "清仓", value: 2 },
      { label: "增仓", value: 3 },
      { label: "减仓", value: 4 },
    ],
    bindValue: 1,
  },
});

const holdingListOnFinish = (form) => {
  holdingListLoading.value = true;
  holdingListTableData.value = [];
  holdingListPage.value = 1;
  holdingListHasMore.value = true;
  queryInstitutionHoldingList(form);
};

const cancelHoldingList = (e) => {
  holdingListVisible.value = false;
  holdingListPage.value = 1;
  holdingListHasMore.value = true;
  holdingListTableData.value = [];
};

const holdingListOnLoadMore = (form) => {
  if (!holdingListHasMore.value) return;
  holdingListLoading.value = true;
  if (holdingListPage.value === 1) {
    queryInstitutionHoldingList(form);
  } else {
    queryInstitutionHoldingList({
      ...form,
      page: holdingListNextPageRef.value,
    });
  }
  holdingListPage.value++;
};

const onClickHoldingList = (institutionId) => {
  holdingListInstitutionId.value = institutionId;
  holdingListOnLoadMore({
    institutionId: institutionId,
  });
};

watch(
  () => futuInstitutionHoldingList,
  (holdingList) => {
    let dataList = holdingList.value.content.dataList;
    if (dataList !== null && dataList.length > 0) {
      let { nextPage } = holdingList.value.content;
      holdingListNextPageRef.value = nextPage;
      holdingListTableData.value = holdingListTableData.value.concat(dataList);
      if (nextPage == null) {
        holdingListHasMore.value = false;
      }
    }
    holdingListLoading.value = false;
    holdingListVisible.value = true;
  },
  { deep: true }
);
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
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button
              size="small"
              type="link"
              @click="queryInstitutionProfile(record.institutionId)"
              >概况</a-button
            >
            <a-button
              size="small"
              type="link"
              @click="queryInstitutionDistr(record.institutionId)"
            >
              持仓行业分布</a-button
            >
            <a-button
              size="small"
              type="link"
              @click="onClickHoldingChange(record.institutionId)"
              >持仓变动
            </a-button>
            <a-button
              size="small"
              type="link"
              @click="onClickHoldingList(record.institutionId)"
              >持股列表</a-button
            >
          </a-space>
        </template>
      </template>
    </AdvancedTable>
    <a-modal
      v-model:visible="profileVisible"
      :width="900"
      title="概况"
      :footer="null"
      :closable="false"
    >
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
    <a-modal
      v-model:visible="distrVisible"
      :width="900"
      title="持仓行业分布"
      :footer="null"
      :closable="false"
    >
      <a-table
        size="small"
        :columns="distrColumns"
        :data-source="futuInstitutionDistribution?.content?.dataList"
      />
    </a-modal>
    <a-modal
      v-model:visible="holdingChangeVisible"
      :width="900"
      title="持仓变动"
      @cancel="cancelHoldingChange"
      :footer="null"
      :closable="false"
    >
      <a-descriptions>
        <a-descriptions-item label="总条数">{{
          futuInstitutionHoldingChange?.content?.allCount
        }}</a-descriptions-item>
        <a-descriptions-item label="NextPgae">{{
          futuInstitutionHoldingChange?.content?.nextPage
        }}</a-descriptions-item>
      </a-descriptions>
      <AdvancedTable
        :loading="holdingChangeLoading"
        :row-key="'institutionId'"
        :virtual="true"
        :pagination="false"
        :scroll="{ y: 450, x: 1500 }"
        :has-more="holdingChangeHasMore"
        :reset-flag="holdingChangeResetFlag"
        @load-more="holdingChangeOnLoadMore"
        :form="holdingChangeQueryForm"
        @on-finish="holdingChangeOnFinish"
        :columns="holdingChangeColumns"
        :data-source="holdingChangeTableData"
      >
      </AdvancedTable>
    </a-modal>
    <a-modal
      v-model:visible="holdingListVisible"
      :width="900"
      title="持股列表"
      @cancel="cancelHoldingList"
      :footer="null"
      :closable="false"
    >
      <a-descriptions>
        <a-descriptions-item label="总条数">{{
          futuInstitutionHoldingList?.content?.allCount
        }}</a-descriptions-item>
        <a-descriptions-item label="NextPgae">{{
          futuInstitutionHoldingList?.content?.nextPage
        }}</a-descriptions-item>
        <a-descriptions-item label="币种">{{
          futuInstitutionHoldingList?.content?.currency
        }}</a-descriptions-item>
      </a-descriptions>
      <AdvancedTable
        :loading="holdingListLoading"
        :row-key="'institutionId'"
        :virtual="true"
        :pagination="false"
        :scroll="{ y: 450, x: 1500 }"
        :has-more="holdingListHasMore"
        :reset-flag="holdingListResetFlag"
        @load-more="holdingListOnLoadMore"
        :form="holdingListQueryForm"
        @on-finish="holdingListOnFinish"
        :columns="holdingListColumns"
        :data-source="holdingListTableData"
      >
      </AdvancedTable>
    </a-modal>
  </div>
</template>

<style scoped lang="less"></style>
