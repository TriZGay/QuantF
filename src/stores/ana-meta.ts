import { fetchMetaData, fetchMetaDbInfo, fetchMetaTables } from "@/api/analyze";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useRequest } from "vue-request";

export const useAnalyzeMeta = defineStore("analyzeMeta", () => {
  const {
    data,
    run: requestMetaData
  } = useRequest(fetchMetaData, {
    manual: true
  });

  const {
    data: tables,
    run: requestTables
  } = useRequest(fetchMetaTables, {
    manual: true
  });

  const {
    data: dnInfos,
    run: requestMetaDbInfo
  } = useRequest(fetchMetaDbInfo, {
    manual: true
  });

  const metaDnInfos = computed(() => {
    return dnInfos.value?.data || [];
  });

  const metaTables = computed(() => {
    return tables.value?.data || [];
  });

  const metaCodes = computed(() => {
    return data.value?.data || [];
  });

  return {
    metaCodes,
    requestMetaData,
    metaTables,
    requestTables,
    metaDnInfos,
    requestMetaDbInfo
  };
});
