import { fetchMetaDayKCodes, fetchMetaIndiesCodes, fetchMetaMin15KCodes, fetchMetaMin1KCodes, fetchMetaMin30KCodes, fetchMetaMin3KCodes, fetchMetaMin5KCodes, fetchMetaMin60KCodes, fetchMetaMonthKCodes, fetchMetaQuarterKCodes, fetchMetaWeekKCodes, fetchMetaYearKCodes, fetchMin5KData } from "@/api/analyze";
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

    const {
        data: min30KMetaCodes,
        run: requestMin30KCodes
    } = useRequest(fetchMetaMin30KCodes, {
        manual: true
    })

    const min30KCodes = computed(() => {
        return min30KMetaCodes.value?.data || []
    })

    const {
        data: min60KMetaCodes,
        run: requestMin60KCodes
    } = useRequest(fetchMetaMin60KCodes, {
        manual: true
    })

    const min60KCodes = computed(() => {
        return min60KMetaCodes.value?.data || []
    })

    const {
        data: weekKMetaCodes,
        run: requestWeekKCodes
    } = useRequest(fetchMetaWeekKCodes, {
        manual: true
    })

    const weekKCodes = computed(() => {
        return weekKMetaCodes.value?.data || []
    })

    const {
        data: monthKMetaCodes,
        run: requestMonthKCodes
    } = useRequest(fetchMetaMonthKCodes, {
        manual: true
    })

    const monthKCodes = computed(() => {
        return monthKMetaCodes.value?.data || []
    })

    const {
        data: quarterKMetaCodes,
        run: requestQuarterKCodes
    } = useRequest(fetchMetaQuarterKCodes, {
        manual: true
    })

    const quarterKCodes = computed(() => {
        return quarterKMetaCodes.value?.data || []
    })

    const {
        data: yearKMetaCodes,
        run: requestYearKCodes
    } = useRequest(fetchMetaYearKCodes, {
        manual: true
    })

    const yearKCodes = computed(() => {
        return yearKMetaCodes.value?.data || []
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
        requestMin5KCodes,
        min30KCodes,
        requestMin30KCodes,
        min60KCodes,
        requestMin60KCodes,
        weekKCodes,
        requestWeekKCodes,
        monthKCodes,
        requestMonthKCodes,
        quarterKCodes,
        requestQuarterKCodes,
        yearKCodes,
        requestYearKCodes
    }
})