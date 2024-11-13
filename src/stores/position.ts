import { fetchPositions, refreshPositions } from "@/api/trade";
import { defineStore } from "pinia";
import { usePagination, useRequest } from "vue-request";
import { computed } from "vue";

export const usePositionStore = defineStore("position", () => {
    const {
        data,
        run: queryPositionList,
        loading,
        pageSize,
        total,
        current
    } = usePagination(fetchPositions, {
        // defaultParams: [{

        // }],
        pagination: {
            currentKey: "current",
            pageSizeKey: "size",
            totalKey: "data.total",
        }
    })

    const positions = computed(() => {
        return data.value?.data.records || []
    })

    const {
        run: refreshPos
    } = useRequest(refreshPositions, {
        manual: true
    });

    return {
        refreshPos,
        positions,
        queryPositionList,
        loading,
        pageSize,
        current,
        total
    }
})