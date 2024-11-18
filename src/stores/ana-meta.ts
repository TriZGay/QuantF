import { fetchMetaData } from "@/api/analyze";
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

    const metaCodes = computed(() => {
    return data.value?.data || [];
  });

  return {
    metaCodes,
    requestMetaData
  };
});
