import { syncSubscribeInfo } from "@/api/sub";
import { defineStore } from "pinia";
import { useRequest } from "vue-request";

export const useSubStores = defineStore("sub", () => {
    const {
        loading: syncLoading,
        data,
        run: syncSub
    } = useRequest(syncSubscribeInfo, {
        manual: true
    });

    return {
        syncLoading,
        syncSub
    }
})