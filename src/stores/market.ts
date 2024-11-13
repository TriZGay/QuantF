import { defineStore } from "pinia";
import { fetchGlobalMartketState, fetchHistoryKDetail } from '@/api/global';
import { useRequest } from "vue-request";
import type { Message } from "@/types/message";
import { useWebSocket } from "@vueuse/core";
import { computed } from 'vue';
import { notification } from "ant-design-vue";

export const useMarketState = defineStore("market", () => {
    const {
        data,
        run,
        loading
    } = useRequest(fetchGlobalMartketState, {
        manual: true
    })

    const { status, data: marketStateWs } = useWebSocket("ws://localhost:9093/websocket/ms", {
        onDisconnected(ws, event) {
            notification.info({
                message: "全局市场Ws disconnected:" + event.type,
                placement: "bottomRight"
            })
        },
        onError(ws, event) {
            notification.error({
                message: "全局市场Ws error:" + event.type,
                placement: "bottomRight"
            })
        },
        onConnected(websocket) {
            let message: Message = {
                type: "JOIN_IN"
            };
            websocket.send(JSON.stringify(message))
        },
    })

    const rtMarketState = computed(() => {
        return JSON.parse(marketStateWs.value)
    })

    const {
        run: requestHistoryKDetail
    } = useRequest(fetchHistoryKDetail, {
        manual: true
    })


    const { data: historyKDetail } = useWebSocket("ws://localhost:9093/websocket/kl_history_detail", {
        onDisconnected(ws, event) {
            notification.info({
                message: "历史K线额度明细Ws disconnected:" + event.type,
                placement: "bottomRight"
            })
        },
        onError(ws, event) {
            notification.error({
                message: "历史K线额度明细Ws error:" + event.type,
                placement: "bottomRight"
            })
        },
        onConnected(websocket) {
            let message: Message = {
                type: "JOIN_IN"
            };
            websocket.send(JSON.stringify(message))
        },
    })

    const nowHistoryKDetail = computed(() => {
        return JSON.parse(historyKDetail.value)
    })

    return {
        data,
        run,
        loading,
        rtMarketState,
        requestHistoryKDetail,
        nowHistoryKDetail
    }
})