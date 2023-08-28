import type { Message } from "@/types/message";
import { useWebSocket } from "@vueuse/core";
import { notification } from "ant-design-vue";
import { defineStore } from "pinia";
import { computed } from "vue";

export const useWsKLine = defineStore("ws-k", () => {
    const { status, data, open: min1RTConnect } = useWebSocket("ws://localhost:9093/websocket/kl_min1", {
        immediate: false,
        onDisconnected(ws, event) {
            notification.info({
                message: "实时1分K线Ws disconnected:" + event.type,
                placement: "bottomRight"
            })
        },
        onError(ws, event) {
            notification.error({
                message: "实时1分K线Ws error:" + event.type,
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
    const rtKlineMin1 = computed(() => {
        return JSON.parse(data.value)
    })
    
    return {
        rtKlineMin1,
        min1RTConnect
    }
})