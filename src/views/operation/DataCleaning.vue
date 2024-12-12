<script setup lang="ts">
import { useAnalyzeMeta } from "@/stores/ana-meta";
import { useAnalyzeKline } from "@/stores/ana-k";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import type { ColumnProps } from "ant-design-vue/es/table";
import Cron from "@/components/CronPicker/Cron.vue";

const analyzeMetaStores = useAnalyzeMeta();
const fetchTables = analyzeMetaStores.requestTables;
const fetchDbInfos = analyzeMetaStores.requestMetaDbInfo;
const { metaTables, metaDnInfos } = storeToRefs(analyzeMetaStores);

const analyzeKStores = useAnalyzeKline();
const fetchKLinesTrans = analyzeKStores.requestKTrans;

const expression = ref<string>();
const start = ref<string>();
const end = ref<string>();
const dbInfoColumns = ref<ColumnProps[]>([{
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


const dataClean = (tableName: string): void => {
  fetchKLinesTrans({
    tableName,
    start: dayjs(start.value).format("YYYY-MM-DD HH:mm:ss"),
    end: dayjs(end.value).format("YYYY-MM-DD HH:mm:ss")
  }).then(res => {
    if (res.status === 200) {
      message.success(res.data.toString());
    }
  }).catch(error => {
    message.error(error.response.data.toString());
  });
};

fetchDbInfos();
fetchTables();
</script>

<template>
  <div class="container">数据清洗
    <a-table :data-source="metaDnInfos" :columns="dbInfoColumns"
             size="small" />
    <Cron v-model="expression" />
    <a-date-picker show-time v-model:value="start" />
    -
    <a-date-picker show-time v-model:value="end" />
    <a-list size="small"
            :data-source="metaTables"
            item-layout="horizontal">
      <template #renderItem="{item}">
        <a-list-item>
          <template #actions>
            <a key="list-loadmore-edit" @click="dataClean(item)">trans</a>
          </template>
          {{ item }}
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<style scoped lang="less">

</style>
