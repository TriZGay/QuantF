import { fetchMetaDayKCodes, fetchMetaIndiesCodes, fetchMetaMin15KCodes, fetchMetaMin1KCodes, fetchMetaMin3KCodes, fetchMetaMin5KCodes, fetchMin5KData } from "@/api/analyze";
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

    const {
        data: min1KMetaCodes,
        run: requestMin1KCodes
    } = useRequest(fetchMetaMin1KCodes, {
        manual: true
    })

    const min1KCodes = computed(() => {
        return min1KMetaCodes.value?.data || []
    })

    const {
        data: min3KMetaCodes,
        run: requestMin3KCodes
    } = useRequest(fetchMetaMin3KCodes, {
        manual: true
    })

    const min3KCodes = computed(() => {
        return min3KMetaCodes.value?.data || []
    })

    const {
        data: min5KMetaCodes,
        run: requestMin5KCodes,
    } = useRequest(fetchMetaMin5KCodes, {
        manual: true
    })

    const min5KCodes = computed(() => {
        return min5KMetaCodes.value?.data || []
    })

    return {
        indiesCodes,
        requestIndiesCodes,
        dayKCodes,
        requestDayKCodes,
        min15KCodes,
        requestMin15KCodes,
        min1KCodes,
        requestMin1KCodes,
        min3KCodes,
        requestMin3KCodes,
        min5KCodes,
        requestMin5KCodes
    }
})