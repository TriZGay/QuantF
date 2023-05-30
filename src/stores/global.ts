import type { Message } from "@/types/message";
import { useWebSocket } from "@vueuse/core";
import { defineStore } from "pinia";

export const useGlobalFTState = defineStore("global", () => {
    const { status, data } = useWebSocket("ws://localhost:9090/websocket?sessionId=1", {
        onMessage(ws, event) {
            console.log("Ws onMessage:" + event.data)
        },
        onDisconnected(ws, event) {
            console.log("Ws disconnected:" + event.code)
        },
        onError(ws, event) {
            console.log("Ws error:" + event)
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