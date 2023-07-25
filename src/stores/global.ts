import type { Message } from "@/types/message";
import { useWebSocket } from "@vueuse/core";
import { defineStore } from "pinia";
import { notification } from "ant-design-vue";
import { computed } from 'vue';
export const useGlobalFTState = defineStore("global", () => {
    const { status, data } = useWebSocket("ws://localhost:9093/websocket/notify", {
        onMessage(ws, event) {
            const notify = JSON.parse(event.data);
            if (notify.type === 'NOTIFY') {
                notification.info({
                    message: notify.content,
                    placement: "bottomRight"
                })
            }
        },
        onDisconnected(ws, event) {
            notification.info({
                message: "Ws disconnected:" + event.code,
                placement: "bottomRight"
            })
        },
        onError(ws, event) {
            notification.error({
                message: "Ws error:" + event.type,
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
    const notify = computed(() => JSON.parse(data.value))

    return {
        status,
        notify
    }
})