import type { Message } from "@/types/message";
import { useWebSocket } from "@vueuse/core";
import { notification } from "ant-design-vue";
import { defineStore } from "pinia";
import { computed } from "vue";

export const useWsBasicQuote = defineStore("ws-basicQuote", () => {
    const { status, data } = useWebSocket("ws://localhost:9093/websocket/bq", {
        onDisconnected(ws, event) {
            notification.info({
                message: "实时报价Ws disconnected:" + event.type,
                placement: "bottomRight"
            })
        },
        onError(ws, event) {
            notification.error({
                message: "实时报价Ws error:" + event.type,
                placement: "bottomRight"
            })
        },
        onConnected(websocket) {
            let message: Message = {
                type: "JOIN_IN"
            };
            websocket.send(JSON.stringify(message))
        }
    })

    const rtBasicQuote = computed(() => {
        return JSON.parse(data.value)
    })

    return {
        rtBasicQuote,
    }
})