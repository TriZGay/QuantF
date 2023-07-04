import { refreshPositions } from "@/api/trade";
import { defineStore } from "pinia";
import { usePagination, useRequest } from "vue-request";


export const usePositionStore = defineStore("position", () => {
    const { } = usePagination

    const {
        run: refreshPos
    } = useRequest(refreshPositions, {
        manual: true
    });

    return {
        refreshPos
    }
})