import {
  fetchMetaData, fetchMetaDbInfo,
  fetchMetaTables, fetchTableInfo,
  fetchTruncateTable, fetchDataQaPerDay
} from "@/api/analyze";
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
    data: dbInfos,
    loading: dbInfoLoading,
    run: requestMetaDbInfo
  } = useRequest(fetchMetaDbInfo, {
    manual: true
  });

  const {
    data: tableInfos,
    loading: tableInfoLoading,
    runAsync: requestTableInfo
  } = useRequest(fetchTableInfo, {
    manual: true
  });

  const {
    runAsync: requestTruncateTable
  } = useRequest(fetchTruncateTable, {
    manual: true
  });

  const {
    run: requestDataQa,
    data: dataQa
  } = useRequest(fetchDataQaPerDay, {
    manual: true
  });

  const dataQaPerDay = computed(() => {
    return dataQa.value?.data || {};
  });

  const metaTableInfo = computed(() => {
    return tableInfos.value?.data || [];
  });

  const metaDbInfos = computed(() => {
    return dbInfos.value?.data || [];
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
    metaDbInfos,
    dbInfoLoading,
    requestMetaDbInfo,
    metaTableInfo,
    tableInfoLoading,
    requestTableInfo,
    requestTruncateTable,
    dataQaPerDay,
    requestDataQa
  };
});
