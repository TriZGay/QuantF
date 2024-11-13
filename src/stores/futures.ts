import { fetchStocks } from "@/api/stock";
import { defineStore } from "pinia";
import { usePagination } from "vue-request";
import { computed } from "vue";

export const useFuturesStore = defineStore("futures", () => {
    const {
        data,
        run,
        loading,
        pageSize,
        total,
        current
    } = usePagination(fetchStocks, {
        defaultParams: [{
            delisting: 0,
            exchangeType: 3,
            market: 1,
            stockType: 10
        }],
        pagination: {
            currentKey: "current",
            pageSizeKey: "size",
            totalKey: "data.total",
        }
    })
    const list = computed(() => {
        return data.value?.data.records || []
    })
    return {
        list,
        run,
        loading,
        pageSize,
        total,
        current
    }
})