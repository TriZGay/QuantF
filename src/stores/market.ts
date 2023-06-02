import { defineStore } from "pinia";
import { fetchGlobalMartketState } from '@/api/global';
import { useRequest } from "vue-request";

export const useMarketState = defineStore("market", () => {
    const {
        data,
        run,
        loading
    } = useRequest(fetchGlobalMartketState)

    return {
        data,
        run,
        loading
    }
})