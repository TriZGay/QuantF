<script setup lang="ts">
import { useWebSocket } from "@vueuse/core";

const { status, data, send, open, close } = useWebSocket("ws://localhost:9090/websocket/", {
    autoReconnect: {
        retries: 3,
        delay: 1000,
        onFailed() {
            console.error("连接Websocket失败.")
        }
    },
    heartbeat: {
        message: "ping",
        interval: 1000,
        pongTimeout: 1000
    }
})
send("hhhh")

</script>
<template>
    <div>实时K 连接状态{{ status }} 接收数据 {{ data }}</div>
</template>
<style lang="less" scoped></style>