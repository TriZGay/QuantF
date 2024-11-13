import type { Message } from "@/types/message";
import { useWebSocket } from "@vueuse/core";
import { notification } from "ant-design-vue";
import { defineStore } from "pinia";
import { computed } from "vue";

export const useWsKLine = defineStore("ws-k", () => {
    const { data: min1Data, open: min1RTConnect } = useWebSocket("ws://localhost:9093/websocket/kl_min1", {
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
        return JSON.parse(min1Data.value)
    })

    const { data: min3Data, open: min3RTConnect } = useWebSocket("ws://localhost:9093/websocket/kl_min3", {
        immediate: false,
        onDisconnected(ws, event) {
            notification.info({
                message: "实时3分K线Ws disconnected:" + event.type,
                placement: "bottomRight"
            })
        },
        onError(ws, event) {
            notification.error({
                message: "实时3分K线Ws error:" + event.type,
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

    const rtKlineMin3 = computed(() => {
        return JSON.parse(min3Data.value)
    })


    const { data: min5Data, open: min5RTConnect } = useWebSocket("ws://localhost:9093/websocket/kl_min5", {
        immediate: false,
        onDisconnected(ws, event) {
            notification.info({
                message: "实时5分K线Ws disconnected:" + event.type,
                placement: "bottomRight"
            })
        },
        onError(ws, event) {
            notification.error({
                message: "实时5分K线Ws error:" + event.type,
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

    const rtKlineMin5 = computed(() => {
        return JSON.parse(min5Data.value)
    })

    const { data: min15Data, open: min15RTConnect } = useWebSocket("ws://localhost:9093/websocket/kl_min15", {
        immediate: false,
        onDisconnected(ws, event) {
            notification.info({
                message: "实时15分K线Ws disconnected:" + event.type,
                placement: "bottomRight"
            })
        },
        onError(ws, event) {
            notification.error({
                message: "实时15分K线Ws error:" + event.type,
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

    const rtKlineMin15 = computed(() => {
        return JSON.parse(min15Data.value)
    })

    const { data: min30Data, open: min30RTConnect } = useWebSocket("ws://localhost:9093/websocket/kl_min30", {
        immediate: false,
        onDisconnected(ws, event) {
            notification.info({
                message: "实时30分K线Ws disconnected:" + event.type,
                placement: "bottomRight"
            })
        },
        onError(ws, event) {
            notification.error({
                message: "实时30分K线Ws error:" + event.type,
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

    const rtKlineMin30 = computed(() => {
        return JSON.parse(min30Data.value)
    })

    const { data: min60Data, open: min60RTConnect } = useWebSocket("ws://localhost:9093/websocket/kl_min60", {
        immediate: false,
        onDisconnected(ws, event) {
            notification.info({
                message: "实时60分K线Ws disconnected:" + event.type,
                placement: "bottomRight"
            })
        },
        onError(ws, event) {
            notification.error({
                message: "实时60分K线Ws error:" + event.type,
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

    const rtKlineMin60 = computed(() => {
        return JSON.parse(min60Data.value)
    })


    return {
        rtKlineMin1,
        min1RTConnect,
        rtKlineMin3,
        min3RTConnect,
        rtKlineMin5,
        min5RTConnect,
        rtKlineMin15,
        min15RTConnect,
        rtKlineMin30,
        min30RTConnect,
        rtKlineMin60,
        min60RTConnect
    }
})