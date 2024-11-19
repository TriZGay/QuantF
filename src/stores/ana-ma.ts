import { fetchMaData } from "@/api/analyze";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useRequest } from "vue-request";

export const useAnalyzeMa = defineStore("ana-ma", () => {
  const {
    loading: maLoading,
    data,
    runAsync: requestMaData
  } = useRequest(fetchMaData, {
    manual: true
  });

  const maData = computed(() => {
    return data.value?.data || [];
  });

  return {
    maLoading,
    maData,
    requestMaData
  };
});
