<script setup lang="ts">
import {
    type OnExtensionSubscriber,
    type OnNextSubscriber,
    type OnTerminalSubscriber,
    type Payload,
    RSocketConnector,
    RSocketServer,
} from 'rsocket-core'
import { WebsocketClientTransport } from 'rsocket-websocket-client'
import { WebsocketServerTransport } from 'rsocket-websocket-server'
import WebSocket from 'isomorphic-ws'

function makeServer() {
    return new RSocketServer({
        transport: new WebsocketServerTransport({
            host: "localhost",
            port: 9000
        }),
        acceptor: {
            accept: async () => {
                return {
                    requestStream: (payload: Payload,
                        initialRequestN,
                        responderStream: OnTerminalSubscriber & OnNextSubscriber & OnExtensionSubscriber) => {
                        console.log(
                            `[server] requestStream payload[data: ${payload.data}; metadata: ${payload.metadata}]|initialRequestN: ${initialRequestN}`
                        );

                        let interval: any = null;
                        let requestedResponse = initialRequestN;
                        let sentResponse = 0;

                        interval = setInterval(() => {
                            sentResponse++;
                            let isComplete = sentResponse >= requestedResponse;
                            responderStream.onNext(
                                {
                                    data: Buffer.from(new Date()),
                                    metadata: undefined
                                },
                                isComplete
                            );
                            if (isComplete) {
                                clearInterval(interval)
                            }
                        }, 750)

                        return {
                            cancel() {
                                console.log("[server] stream cancelled by client");
                                clearInterval(interval)
                            },
                            request(n) {
                                requestedResponse += n;
                                console.log(
                                    `[server] request n: ${n}, requestedResponses: ${requestedResponse}, sentResponses: ${sentResponse}`)
                            },
                            onExtension: () => { }
                        }
                    }
                }
            }
        }
    })
}

function makeConnector() {
    return new RSocketConnector({
        transport: new WebsocketClientTransport({
            url: "ws://localhost:9000"
        })
    })
}

let serverCloseable: any;

async function main() {
    const server = makeServer();
    const connector = makeConnector();

    serverCloseable = await server.bind();
    const rsocket = await connector.connect();

    await new Promise((resolve, reject) => {
        let payloadsReceived = 0;
        const maxPayloads = 10;
        const requester = rsocket.requestStream({
            data: Buffer.from("hello world")
        },
            3,
            {
                onError: (e) => console.log(e),
                onNext: (payload, isComplete) => {
                    console.log(`[client] payload[data: ${payload.data}; metadata: ${payload.metadata}]|isComplete: ${isComplete}`)
                    payloadsReceived++;
                    // request 5 more payloads every 5th payload, until a max total payloads received
                    if (payloadsReceived % 2 == 0 && payloadsReceived < maxPayloads) {
                        requester.request(2);
                    } else if (payloadsReceived >= maxPayloads) {
                        requester.cancel();
                        setTimeout(() => {
                            resolve(null);
                        });
                    }

                    if (isComplete) {
                        resolve(null);
                    }
                },
                onComplete: () => {
                    resolve(null);
                },
                onExtension: () => { }
            }
        )
    })
}

main()
    .then(() => { })
    .catch((error: Error) => {
        console.error(error);
    })
    .finally(() => {
        serverCloseable.close();
    });

</script>
<template>
    <div>实时K

    </div>
</template>
<style lang="less" scoped></style>