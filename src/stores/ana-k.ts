import { fetchDayKData } from "@/api/analyze";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useRequest } from "vue-request";

export const useAnalyzeKline = defineStore("ana-k", () => {
    const {
        loading:dayKLoading,
        data: dayK,
        run: requestDayK
    } = useRequest(fetchDayKData, {
        manual: true
    })

    const dayKData = computed(() => {
        return dayK.value?.data || []
    })
    return {
        dayKLoading,
        dayKData,
        requestDayK
    }
})