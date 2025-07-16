import { defineStore } from "pinia";
import { useRequest } from "vue-request";
import {
  fetchBigABidAsk, fetchBigAHistory, fetchBigARealTime,
  fetchBigAStockIndividual,
  fetchBigAStockIndividualInfo,
  fetchBigAStockTodaySummary
} from "@/api/akshares";
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

  const {
    data: bigAStockIndividualInfo,
    run: requestBigAStockIndividualInfo
  } = useRequest(fetchBigAStockIndividualInfo, {
    manual: true
  });
  const computedBigAStockIndividualInfo = computed(() => {
    return bigAStockIndividualInfo.value?.data || {};
  });

  const {
    data: bidAskData,
    run: requestBigABidAsk
  } = useRequest(fetchBigABidAsk, {
    manual: true
  });
  const computedBigABidAsk = computed(() => {
    return bidAskData.value?.data || {};
  });

  const {
    data: bigRealTimeData,
    run: requestBigARealTime,
    loading: bigARealTimeLoading
  } = useRequest(fetchBigARealTime, {
    manual: true
  });
  const computedBigARealTime = computed(() => {
    return bigRealTimeData.value?.data || {};
  });

  const {
    data: bigAHistoryData,
    run: requestBigAHistory
  } = useRequest(fetchBigAHistory, {
    manual: true
  });
  const computedBigAHistory = computed(() => {
    return bigAHistoryData.value?.data || {};
  });

  return {
    //
    requestBigAStockTodaySummary,
    computedBigASummaries,
    //
    requestBigAStockIndividual,
    computedBigAStockIndividual,
    //
    requestBigAStockIndividualInfo,
    computedBigAStockIndividualInfo,
    //
    requestBigABidAsk,
    computedBigABidAsk,
    //
    requestBigARealTime,
    computedBigARealTime,
    bigARealTimeLoading,
    //
    requestBigAHistory,
    computedBigAHistory

  };
});
