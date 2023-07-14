import { fetchMetaDayKCodes, fetchMetaIndiesCodes } from "@/api/analyze";
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

    const {
        data: dayKMetaCodes,
        run: requestDayKCodes
    } = useRequest(fetchMetaDayKCodes, {
        manual: true
    })

    const dayKCodes = computed(() => {
        return dayKMetaCodes.value?.data || []
    })

    return {
        indiesCodes,
        requestIndiesCodes,
        dayKCodes,
        requestDayKCodes
    }
})