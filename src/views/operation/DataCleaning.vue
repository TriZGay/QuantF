<script setup lang="ts">
import { useAnalyzeMeta } from "@/stores/ana-meta";
import { useAnalyzeKline } from "@/stores/ana-k";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";

const analyzeMetaStores = useAnalyzeMeta();
const fetchTables = analyzeMetaStores.requestTables;
const { metaTables } = storeToRefs(analyzeMetaStores);

const analyzeKStores = useAnalyzeKline();
const fetchKLinesTrans = analyzeKStores.requestKTrans;

const start = ref<string>();
const end = ref<string>();

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

fetchTables();
</script>

<template>
  <div class="container">数据清洗
    <a-date-picker show-time v-model:value="start"  />
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
