import { fetchStocks, type Stock } from "@/api/stock";
import { defineStore } from "pinia";
import { ref } from "vue";
import { message } from 'ant-design-vue'

export const useStockStore = defineStore("stock", () => {
    const stocks = ref<Stock[]>([])

    function getStocks() {
        fetchStocks().then(res => {
            console.log(res.data)
            stocks.value = res.data
            message.success({
                //@ts-ignore
                content: res.message
            })
        }).catch(err => {
            console.log(err)
        })
    }

    return {
        stocks,
        getStocks
    }
})