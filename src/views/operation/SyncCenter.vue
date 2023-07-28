<script setup lang="ts">
import { connect2FT, disconnect2FT, syncTradeDate } from '@/api/global';
import { syncStocks, syncPlates } from '@/api/stock'
import { message } from 'ant-design-vue';

function syncStock(event: any) {
    syncStocks()
        .then(response => {
            message.success(response.data)
        })
        .catch(err => {
            message.error("程序未知错误" + err)
        })
}

function syncPlate(event: any) {
    syncPlates()
        .then(res => {
            message.success(res.data)
        }).catch(err => {
            message.error("程序未知错误" + err)
        })
}

function connect() {
    connect2FT().then(res => {
        message.success(res.data)
    })
}
function disconnect() {
    disconnect2FT().then(res => {
        message.success(res.data)
    })
}
function syncTradeDatePermarket() {
    syncTradeDate().then(res => {
        message.success(res.data)
    }).catch(err => {
        message.error("出错" + err)
    })
}
</script>
<template>
    <div>
        <span>数据同步</span>
        <a-button type="primary" @click="syncStock">全量同步基础股票数据</a-button>
        <a-button type="primary" @click="syncPlate">全量同步基础板块数据</a-button>
        <a-button type="primary" @click="syncTradeDatePermarket">同步交易日情况</a-button>
        <a-button type="primary" @click="connect">连接到FutuD</a-button>
        <a-button type="primary" @click="disconnect">FutuD断开连接</a-button>
    </div>
</template>
<style lang="less" scoped></style>