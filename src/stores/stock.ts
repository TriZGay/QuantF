import { fetchStocks } from "@/api/stock";
import { defineStore } from "pinia";
import { computed } from "vue";
import { usePagination } from 'vue-request'

export const useStockStore = defineStore("stock", () => {

    const {
        data,
        run: queryStocks,
        loading,
        pageSize,
        totalPage,
        current
    } = usePagination(fetchStocks, {
        defaultParams: [
            {
                limit: 5,
                page: 1
            }
        ],
        pagination: {
            currentKey: "page",
            pageSizeKey: "limit",
        }
    })

    const list = computed(() => data.value?.data || [])

    return {
        list,
        queryStocks,
        loading,
        pageSize,
        totalPage,
        current
    }
})