import { fetchKLineData } from "@/api/analyze";
import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import { computed } from "vue";

export const useAnalyzeKline = defineStore("ana-k", () => {
  const {
    loading: kLoading,
    run: requestK,
    data
  } = useRequest(fetchKLineData, {
    manual: true
  });

  const kData = computed(() => {
    return data.value?.data || [];
  });

  return {
    kLoading,
    kData,
    requestK
  };
});
