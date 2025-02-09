import { cancelSubscribeInfo, fetchSubscribeInfos, syncSubscribeInfo } from "@/api/futu";
import { defineStore } from "pinia";
import { computed } from "vue";
import { usePagination, useRequest } from "vue-request";

export const useSubStores = defineStore("sub", () => {
    const {
        loading: syncLoading,
        run: syncSub
    } = useRequest(syncSubscribeInfo, {
        manual: true
    });

    const {
        loading: queryLoading,
        data: subscribeInfo,
        run: querySubscribeInfo,
        pageSize: queryPageSize,
        current: queryCurrent,
        total: queryTotal
    } = usePagination(fetchSubscribeInfos, {
        manual: true,
        pagination: {
            currentKey: "current",
            pageSizeKey: "size",
            totalKey: "data.total",
        }
    })
    const subscribeInfoList = computed(() => {
        return subscribeInfo.value?.data.records || []
    })

    const {
        loading: cancelLoading,
        data: cancelResult,
        run: cancelSubscribeFn
    } = useRequest(cancelSubscribeInfo, {
        manual: true
    })
    return {
        syncLoading,
        syncSub,

        queryLoading,
        subscribeInfoList,
        querySubscribeInfo,
        queryPageSize,
        queryCurrent,
        queryTotal,

        cancelLoading,
        cancelResult,
        cancelSubscribeFn
    }
})
