import { defineStore } from "pinia";
import { usePagination } from "vue-request";
import { fetchSubscribeDetails, fetchSubscribeInfos } from "@/api/futu";
import { computed } from "vue";

export const useFutuApi = defineStore("futu-api", () => {
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
      pageSize: detailsPageSize,
      current: detailsCurrent,
      total: detailsTotal,
      data: details.value?.data.records || []
    };
  });

  return {
    subscribeDetailsLoading,
    querySubscribeDetails,
    subscribeDetails,
    subscribeInfoLoading,
    querySubscribeInfo,
    subscribeInfos
  };

});
