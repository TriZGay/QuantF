<script setup lang="ts">
import { useWebSocket } from "@vueuse/core";
import type { Message } from '@/types/message'
const { status, data, send, open, close } = useWebSocket("ws://localhost:9090/websocket?sessionId=1", {
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
    autoReconnect: {
        retries: 3,
        delay: 1000,
        onFailed() {
            console.error("连接Websocket失败.")
        }
    },
    // heartbeat: true
})

</script>
<template>
    <div>实时K 连接状态{{ status }} 接收数据 {{ data }}</div>
</template>
<style lang="less" scoped></style>