import { fetchKLineData, fetchKLineTrans } from "@/api/analyze";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useRequest } from "vue-request";

export const useAnalyzeKline = defineStore("ana-k", () => {
  const {
    loading: kLoading,
    data,
    runAsync: requestK
  } = useRequest(fetchKLineData, {
    manual: true
  });

  const {
    runAsync: requestKTrans
  } = useRequest(fetchKLineTrans, {
    manual: true
  });

  const kLines = computed(() => {
    return data.value?.data || [];
  });

  return {
    kLoading,
    kLines,
    requestK,
    requestKTrans
  };
});
