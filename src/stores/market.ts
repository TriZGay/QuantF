import { defineStore } from "pinia";
import { fetchGlobalMartketState } from '@/api/global';
import { useRequest } from "vue-request";

export const useMarketState = defineStore("market", () => {
    const {
        data,
        run,
        loading
    } = useRequest(fetchGlobalMartketState, {
        manual: true
    })

    return {
        data,
        run,
        loading
    }
})