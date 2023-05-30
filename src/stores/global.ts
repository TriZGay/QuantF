import type { Message } from "@/types/message";
import { useWebSocket } from "@vueuse/core";
import { defineStore } from "pinia";
import { notification } from "ant-design-vue";

export const useGlobalFTState = defineStore("global", () => {
    const { status, data } = useWebSocket("ws://localhost:9090/websocket?sessionId=1", {
        onMessage(ws, event) {
            console.log(event.data)
            notification.info({
                message: "Ws onMessage:" + event.data,
                placement: "bottomRight"
            })
        },
        onDisconnected(ws, event) {
            notification.info({
                message: "Ws disconnected:" + event.code,
                placement: "bottomRight"
            })
        },
        onError(ws, event) {
            notification.error({
                message: "Ws error:" + event,
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
    return {
        status,
        data
    }
})