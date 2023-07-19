import { fetchDayKData, fetchMin15KData, fetchMin1KData, fetchMin30KData, fetchMin3KData, fetchMin5KData, fetchMin60KData, fetchMonthKData, fetchQuarterKData, fetchWeekKData, fetchYearKData } from "@/api/analyze";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useRequest } from "vue-request";

export const useAnalyzeKline = defineStore("ana-k", () => {
    const {
        loading: dayKLoading,
        data: dayK,
        run: requestDayK
    } = useRequest(fetchDayKData, {
        manual: true
    })

    const dayKData = computed(() => {
        return dayK.value?.data || []
    })

    const {
        loading: min15KLoading,
        data: min15K,
        run: requestMin15K
    } = useRequest(fetchMin15KData, {
        manual: true
    })

    const min15KData = computed(() => {
        return min15K.value?.data || []
    })

    const {
        loading: min1KLoading,
        data: min1K,
        run: requestMin1K
    } = useRequest(fetchMin1KData, {
        manual: true
    })

    const min1KData = computed(() => {
        return min1K.value?.data || []
    })

    const {
        loading: min3KLoading,
        data: min3K,
        run: requestMin3K
    } = useRequest(fetchMin3KData, {
        manual: true
    })

    const min3KData = computed(() => {
        return min3K.value?.data || []
    })

    const {
        loading: min5KLoading,
        data: min5K,
        run: requestMin5K
    } = useRequest(fetchMin5KData, {
        manual: true
    })

    const min5KData = computed(() => {
        return min5K.value?.data || []
    })

    const {
        loading: min30KLoading,
        data: min30K,
        run: requestMin30K
    } = useRequest(fetchMin30KData, {
        manual: true
    })

    const min30KData = computed(() => {
        return min30K.value?.data || []
    })

    const {
        loading: min60KLoading,
        data: min60K,
        run: requestMin60K
    } = useRequest(fetchMin60KData, {
        manual: true
    })

    const min60KData = computed(() => {
        return min60K.value?.data || []
    })

    const {
        loading: weekKLoading,
        data: weekK,
        run: requestWeekK
    } = useRequest(fetchWeekKData, {
        manual: true
    })

    const weekKData = computed(() => {
        return weekK.value?.data || []
    })

    const {
        loading: monthKLoading,
        data: monthK,
        run: requestMonthK
    } = useRequest(fetchMonthKData, {
        manual: true
    })

    const monthKData = computed(() => {
        return monthK.value?.data || []
    })

    const {
        loading: quarterKLoading,
        data: quarterK,
        run: requestQuarterK
    } = useRequest(fetchQuarterKData, {
        manual: true
    })

    const quarterKData = computed(() => {
        return quarterK.value?.data || []
    })

    const {
        loading: yearKLoading,
        data: yearK,
        run: requestYearK
    } = useRequest(fetchYearKData, {
        manual: true
    })

    const yearKData = computed(() => {
        return yearK.value?.data || []
    })

    return {
        dayKLoading,
        dayKData,
        requestDayK,
        min15KLoading,
        min15KData,
        requestMin15K,
        min1KLoading,
        min1KData,
        requestMin1K,
        min3KLoading,
        min3KData,
        requestMin3K,
        min5KLoading,
        min5KData,
        requestMin5K,
        min30KLoading,
        min30KData,
        requestMin30K,
        min60KLoading,
        min60KData,
        requestMin60K,
        weekKLoading,
        weekKData,
        requestWeekK,
        monthKLoading,
        monthKData,
        requestMonthK,
        quarterKLoading,
        quarterKData,
        requestQuarterK,
        yearKLoading,
        yearKData,
        requestYearK
    }
})