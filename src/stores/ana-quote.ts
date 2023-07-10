import { fetchBasicQuotes } from "@/api/analyze";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useRequest } from "vue-request";


export const useAnalyzeQuote = defineStore("basicQuote", () => {
    const {
        loading,
        data,
        run: requestBasicQuotes
    } = useRequest(fetchBasicQuotes, {
        manual: true
    });

    const quotesData = computed(() => {
        return data.value?.data || []
    })

    return {
        loading,
        quotesData,
        requestBasicQuotes
    }
})