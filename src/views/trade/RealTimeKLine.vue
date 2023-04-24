<script setup lang="ts">
import { RSocketConnector, type RSocket } from 'rsocket-core'
import { WebsocketClientTransport } from 'rsocket-websocket-client'

function makeConnector() {
    return new RSocketConnector({
        transport: new WebsocketClientTransport({
            url: "ws://localhost:9000/rsocket",
        })
    })
}

const numberRequester = (socket: RSocket) => {
    socket.requestStream({
        data: Buffer.from("hello world")
    }, 3, {
        onError: (e) => console.log("我出错了",e),
        onNext: (payload, isComlpete) => {
            console.log(payload, isComlpete)
        },
        onComplete: () => {
            console.log('complete')
        },
        onExtension: () => { }
    })
}

const rsocket = makeConnector().connect()
rsocket.then(socket => {
    numberRequester(socket)
})
</script>
<template>
    <div>实时K</div>
</template>
<style lang="less" scoped></style>