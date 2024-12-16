<script setup lang="ts">
import { useAnalyzeMeta } from "@/stores/ana-meta";
import { useTaskStore } from "@/stores/task";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import dayjs from "dayjs";
import { type FormInstance, message } from "ant-design-vue";
import type { ColumnProps } from "ant-design-vue/es/table";
import Cron from "@/components/CronPicker/Cron.vue";
import type { AddKLineRaw2ArcTaskRequest } from "@/api/task";

const analyzeMetaStores = useAnalyzeMeta();
const fetchTables = analyzeMetaStores.requestTables;
const fetchDbInfos = analyzeMetaStores.requestMetaDbInfo;
const { metaTables, metaDnInfos } = storeToRefs(analyzeMetaStores);

const taskStores = useTaskStore();
const fetchKLineRaw2Arc = taskStores.requestAddKLineRaw2ArcTask;

const dbInfoColumns = ref<ColumnProps[]>([
  {
    title: "数据库",
    dataIndex: "database",
    key: "database"
  }, {
    title: "表格",
    dataIndex: "table",
    key: "table"
  }, {
    title: "大小",
    dataIndex: "size",
    key: "size"
  }, {
    title: "硬盘里的大小",
    dataIndex: "bytesOnDisk",
    key: "bytesOnDisk"
  }, {
    title: "未压缩大小",
    dataIndex: "dataUncompressedBytes",
    key: "dataUncompressedBytes"
  }, {
    title: "压缩大小",
    dataIndex: "dataCompressedBytes",
    key: "dataCompressedBytes"
  }, {
    title: "压缩比率(%)",
    dataIndex: "compressedRate",
    key: "compressedRate"
  }, {
    title: "数据行数",
    dataIndex: "rows",
    key: "rows"
  }
]);

fetchDbInfos();
fetchTables();

const showModal = ref<boolean>(false);
const taskForm = ref<FormInstance>();
const isImmediate = ref<Number>(1);
const kLineRaw2ArcTaskModel = ref<AddKLineRaw2ArcTaskRequest>({
  jobName: "",
  fromTable: "",
  toTable: ""
});
const kLineRawTablesOptions = computed(() => {
  return metaTables.value.filter((tableName: string) => {
    return tableName.includes("kl") && tableName.includes("raw");
  }).map((filter: string) => {
    return {
      label: filter,
      value: filter
    };
  });
});
const kLineArcTablesOptions = computed(() => {
  return metaTables.value.filter((tableName: string) => {
    return tableName.includes("kl") && tableName.includes("arc");
  }).map((filter: string) => {
    return {
      label: filter,
      value: filter
    };
  });
});
const handleKLineRaw2ArcOk = (): void => {
  fetchKLineRaw2Arc(kLineRaw2ArcTaskModel.value)
    .then(res => {
      if (res.status === 200) {
        message.success(res.data.toString());
      }
    }).catch(err => {
    message.error(err.response.data.toString());
  });
};
</script>

<template>
  <div class="container">数据清洗
    <a-table :data-source="metaDnInfos" :columns="dbInfoColumns"
             size="small" />
    <a-button type="primary" shape="round" size="small" @click="showModal=true">
      <template #icon>
        <PlusOutlined />
      </template>
      K线[raw->arc]
    </a-button>
    <a-modal v-model:visible="showModal" title="新建定时任务" @ok="handleKLineRaw2ArcOk">
      <a-form :ref="taskForm" :model="kLineRaw2ArcTaskModel" layout="vertical" name="taskFormInModal">
        <a-form-item name="jobName" label="任务名称">
          <a-input v-model:value="kLineRaw2ArcTaskModel.jobName" />
        </a-form-item>
        <a-form-item name="fromTable" label="源表">
          <a-select v-model:value="kLineRaw2ArcTaskModel.fromTable" :options="kLineRawTablesOptions" />
        </a-form-item>
        <a-form-item name="toTable" label="目的表">
          <a-select v-model:value="kLineRaw2ArcTaskModel.toTable" :options="kLineArcTablesOptions" />
        </a-form-item>
        <a-form-item name="updateRange" label="数据时间">
          <a-date-picker :show-time="{defaultValue:dayjs('09:30:00','HH:mm:ss')}"
                         v-model:value="kLineRaw2ArcTaskModel.updateTimeStart"
                         value-format="YYYY-MM-DD HH:mm:ss"
                         :show-now="false" />
          -
          <a-date-picker :show-time="{defaultValue:dayjs('15:00:00','HH:mm:ss')}"
                         v-model:value="kLineRaw2ArcTaskModel.updateTimeEnd"
                         value-format="YYYY-MM-DD HH:mm:ss"
                         :show-now="false" />
        </a-form-item>
        <a-form-item name="isImmediate" label="是否立即执行">
          <a-radio-group v-model:value="isImmediate">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="cron" label="Cron表达式" v-if="isImmediate===0">
          <Cron v-model="taskModel.cron" />
        </a-form-item>
      </a-form>
    </a-modal>
    <!--    <a-list size="small"-->
    <!--            :data-source="metaTables"-->
    <!--            item-layout="horizontal">-->
    <!--      <template #renderItem="{item}">-->
    <!--        <a-list-item>-->
    <!--          <template #actions>-->
    <!--            <a key="list-loadmore-edit" @click="dataClean(item)">trans</a>-->
    <!--          </template>-->
    <!--          {{ item }}-->
    <!--        </a-list-item>-->
    <!--      </template>-->
    <!--    </a-list>-->
  </div>
</template>

<style scoped lang="less">

</style>
