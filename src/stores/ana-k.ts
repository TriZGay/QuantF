import { fetchDayKData, fetchMin15KData } from "@/api/analyze";
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

    return {
        dayKLoading,
        dayKData,
        requestDayK,
        min15KLoading,
        min15KData,
        requestMin15K
    }
})