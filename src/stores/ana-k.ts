import { fetchKLineData } from "@/api/analyze";
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

  return {
    kLoading,
    requestK
  };
});
