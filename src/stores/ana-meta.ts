import { fetchMetaDayKCodes, fetchMetaIndiesCodes, fetchMetaMin15KCodes } from "@/api/analyze";
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

    const {
        data: min15KMetaCodes,
        run: requestMin15KCodes
    } = useRequest(fetchMetaMin15KCodes, {
        manual: true
    })

    const min15KCodes = computed(() => {
        return min15KMetaCodes.value?.data || []
    })

    return {
        indiesCodes,
        requestIndiesCodes,
        dayKCodes,
        requestDayKCodes,
        min15KCodes,
        requestMin15KCodes
    }
})