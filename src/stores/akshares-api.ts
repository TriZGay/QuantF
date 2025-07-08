import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import { fetchBigAStockTodaySummary } from "@/api/akshares";
import { computed } from "vue";

export const useAkSharesApi = defineStore("akshares-api", () => {
  const {
    data: bigASummaries,
    run: requestBigAStockTodaySummary
  } = useRequest(fetchBigAStockTodaySummary, {
    manual: true
  });

  const computedBigASummaries = computed(() => {
    return bigASummaries.value?.data || {};
  });

  return {
    //
    requestBigAStockTodaySummary,
    computedBigASummaries
    //
  };
});
