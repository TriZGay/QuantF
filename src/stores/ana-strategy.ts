import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import { fetchBackTest, fetchStrategyTypes } from "@/api/analyze";
import { computed } from "vue";

export const useAnalyzeStrategy = defineStore("ana-strategy", () => {
  const {
    loading: backTestLoading,
    runAsync: addBackTest
  } = useRequest(fetchBackTest, {
    manual: true
  });

  const {
    run: requestStrategyTypes,
    data: strategyTypesData
  } = useRequest(fetchStrategyTypes, {
    manual: true
  });
  const strategyTypes = computed(() => {
    return strategyTypesData.value?.data || [];
  });
  return {
    backTestLoading,
    addBackTest,
    requestStrategyTypes,
    strategyTypes
  };
});
