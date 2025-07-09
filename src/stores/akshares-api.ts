import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import { fetchBigAStockIndividual, fetchBigAStockTodaySummary } from "@/api/akshares";
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

  const {
    data: bigAStockIndividual,
    run: requestBigAStockIndividual
  } = useRequest(fetchBigAStockIndividual, {
    manual: true
  });

  const computedBigAStockIndividual = computed(() => {
    return bigAStockIndividual.value?.data || {};
  });

  return {
    //
    requestBigAStockTodaySummary,
    computedBigASummaries,
    //
    requestBigAStockIndividual,
    computedBigAStockIndividual

  };
});
