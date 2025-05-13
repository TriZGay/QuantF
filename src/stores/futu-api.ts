import { defineStore } from "pinia";
import { usePagination, useRequest } from "vue-request";
import {
  fetchPlates,
  fetchStockFilterCodes,
  fetchStocks,
  fetchSubscribeDetails,
  fetchSubscribeInfos
} from "@/api/futu";
import { computed } from "vue";

export const useFutuApi = defineStore("futu-api", () => {
  const {
    data: stockFilterCodes,
    run: queryStockFilterCodes
  } = useRequest(fetchStockFilterCodes, {
    manual: true
  });
  const computedStockFilterCodes = computed(() => {
    return stockFilterCodes.value?.data || {};
  });

  const {
    loading: subscribeInfoLoading,
    data: subscribeInfo,
    run: querySubscribeInfo,
    pageSize: subscribeInfoPageSize,
    current: subscribeInfoCurrent,
    total: subscribeInfoTotal
  } = usePagination(fetchSubscribeInfos, {
    manual: true,
    pagination: {
      currentKey: "current",
      pageSizeKey: "size",
      totalKey: "data.total"
    }
  });
  const subscribeInfos = computed(() => {
    return {
      pageSize: subscribeInfoPageSize.value,
      current: subscribeInfoCurrent.value,
      total: subscribeInfoTotal.value,
      data: subscribeInfo.value?.data.records || []
    };
  });
  const {
    loading: subscribeDetailsLoading,
    data: details,
    run: querySubscribeDetails,
    pageSize: detailsPageSize,
    current: detailsCurrent,
    total: detailsTotal
  } = usePagination(fetchSubscribeDetails, {
    manual: true,
    pagination: {
      currentKey: "current",
      pageSizeKey: "size",
      totalKey: "data.total"
    }
  });

  const subscribeDetails = computed(() => {
    return {
      pageSize: detailsPageSize.value,
      current: detailsCurrent.value,
      total: detailsTotal.value,
      data: details.value?.data.records || []
    };
  });

  const {
    data: stocksData,
    run: queryStocks,
    loading: stockLoading,
    pageSize: stocksPageSize,
    total: stocksTotal,
    current: stocksCurrent
  } = usePagination(fetchStocks, {
    pagination: {
      currentKey: "current",
      pageSizeKey: "size",
      totalKey: "data.total"
    },
    manual: true
  });

  const stocks = computed(() => {
    return {
      pageSize: stocksPageSize.value,
      current: stocksCurrent.value,
      total: stocksTotal.value,
      data: stocksData.value?.data.records || []
    };
  });

  const {
    data: platesData,
    run: queryPlates,
    loading: platesLoading,
    pageSize: platesPageSize,
    total: platesTotal,
    current: platesCurrent
  } = usePagination(fetchPlates, {
    pagination: {
      currentKey: "current",
      pageSizeKey: "size",
      totalKey: "data.total"
    },
    manual: true
  });

  const plates = computed(() => {
    return {
      pageSize: platesPageSize.value,
      current: platesCurrent.value,
      total: platesTotal.value,
      data: platesData.value?.data.records || []
    };
  });

  return {
    subscribeDetailsLoading,
    querySubscribeDetails,
    subscribeDetails,
    //
    subscribeInfoLoading,
    querySubscribeInfo,
    subscribeInfos,
    //
    stockLoading,
    queryStocks,
    stocks,
    //
    platesLoading,
    queryPlates,
    plates,
    //
    computedStockFilterCodes,
    queryStockFilterCodes
  };

});
