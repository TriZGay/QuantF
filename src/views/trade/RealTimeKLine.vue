<script setup lang="ts">
import { RSocketClient, JsonSerializer, IdentitySerializer } from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import FlowableProcessor from 'rsocket-flowable'
import { ref } from 'vue';

const result = ref<string>("")

const client = new RSocketClient({
    serializers: {
        data: JsonSerializer,
        metadata: IdentitySerializer
    },
    setup: {
        keepAlive: 60000,
        lifetime: 180000,
        dataMimeType: 'application/json',
        metadataMimeType: 'message/x.rsocket.routing.v0',
    },
    transport: new RSocketWebSocketClient({
        url: "ws://localhost:9000/rsocket"
    })
})

const errorHanlder = (e) => console.log(e)

const responseHanlder = (payload) => {
    console.log(payload)
    result.value = payload.data
}

const processor = new FlowableProcessor(sub => {
    console.log(sub)
})


const numberRequester = (socket, processor) => {
    console.log(processor)
    socket.requestChannel(processor.map(i => {
        return {
            data: i,
            metadata: String.fromCharCode('number.channel'.length) + 'number.channel'
        }
    })).subscribe({
        onError: errorHanlder,
        onNext: responseHanlder,
        onSubscribe: subscription => {
            subscription.request(100); // set it to some max value
        }
    })

}

const n = ref(null)

client.connect().then(socket => {
    numberRequester(socket, processor);
}, errorHanlder)

function publish() {
    processor.onNext(parseInt('1'))
}
</script>
<template>
    <div>实时K
        <input type="text" @keyup="publish">
        <div>RSocket推送结果 : {{ result }}</div>
    </div>
</template>
<style lang="less" scoped></style>