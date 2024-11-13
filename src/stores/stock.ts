import { fetchStocks } from "@/api/stock";
import { defineStore } from "pinia";
import { computed } from "vue";
import { usePagination } from 'vue-request'

export const useStockStore = defineStore("stock", () => {

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
            exchangeType: 1,
            market: 1,
            stockType: 3
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