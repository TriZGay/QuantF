import { fetchDayKMa10Data, fetchDayKMa20Data, fetchDayKMa30Data, fetchDayKMa5Data } from "@/api/analyze";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useRequest } from "vue-request";

export const useAnalyzeMa = defineStore("ana-ma", () => {
    const {
        loading: dayKMa10Loading,
        data: dayKMa10Data,
        run: requestDayKMa10
    } = useRequest(fetchDayKMa10Data, {
        manual: true
    })

    const dayKMa10 = computed(() => {
        return dayKMa10Data.value?.data || []
    })
    const {
        loading: dayKMa20Loading,
        data: dayKMa20Data,
        run: requestDayKMa20
    } = useRequest(fetchDayKMa20Data, {
        manual: true
    })

    const dayKMa20 = computed(() => {
        return dayKMa20Data.value?.data || []
    })

    const {
        loading: dayKMa30Loading,
        data: dayKMa30Data,
        run: requestDayKMa30
    } = useRequest(fetchDayKMa30Data, {
        manual: true
    })

    const dayKMa30 = computed(() => {
        return dayKMa30Data.value?.data || []
    })

    const {
        loading: dayKMa5Loading,
        data: dayKMa5Data,
        run: requestDayKMa5
    } = useRequest(fetchDayKMa5Data, {
        manual: true
    })

    const dayKMa5 = computed(() => {
        return dayKMa5Data.value?.data || []
    })


    return {
        dayKMa5Loading,
        dayKMa5,
        requestDayKMa5,
        dayKMa10Loading,
        dayKMa10,
        requestDayKMa10,
        dayKMa20Loading,
        dayKMa20,
        requestDayKMa20,
        dayKMa30Loading,
        dayKMa30,
        requestDayKMa30
    }
})