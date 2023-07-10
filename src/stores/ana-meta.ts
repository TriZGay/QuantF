import { fetchMetaIndiesCodes } from "@/api/analyze";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useRequest } from "vue-request";

export const useAnalyzeMeta = defineStore("analyzeMeta", () => {
    const {
        data,
        run: requestIndiesCodes
    } = useRequest(fetchMetaIndiesCodes, {
        manual: true
    })

    const indiesCodes = computed(() => {
        return data.value?.data || {}
    })

    return {
        indiesCodes,
        requestIndiesCodes,
    }
})