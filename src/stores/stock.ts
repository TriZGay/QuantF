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

    console.log(data)
    console.log(data.value)
    // console.log(loading)
    // console.log(pageSize)
    // console.log(totalPage)
    // console.log(current)
    return {
        data,
        queryStocks,
        loading,
        pageSize,
        totalPage,
        current
    }
})