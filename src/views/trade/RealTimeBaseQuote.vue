<script setup lang="ts">
//@ts-nocheck
import { watch, reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useWsBasicQuote } from '@/stores/rt-basic-quote'

const rtWsBasicQuoteStore = useWsBasicQuote();
const { rtBasicQuote } = storeToRefs(rtWsBasicQuoteStore);

//一个标的物对应一个echarts配置
const echartsOptionMap = reactive({
    subscribing: [],//market+code
    optionsMap: {},
    timeMap: {},// {key : []}
    curPriceMap: {},  //当前价 {key : []}
    volumeMap: {}, //成交量
    turnoverMap: {}, // 成交额
    lowPriceMap: {}, //最低价
    highPriceMap: {}, //最高价
    openPriecMap: {}, //开盘价
    lastClosePriceMap: {}//昨收价
})

watch(() => rtBasicQuote, (message) => {
    let marketAndCode = message.value.market + "+" + message.value.code;
    if (echartsOptionMap.subscribing.indexOf(marketAndCode) > -1) {
        echartsOptionMap.timeMap[marketAndCode].push(message.value.updateTime)
        echartsOptionMap.curPriceMap[marketAndCode].push(message.value.curPrice)
        echartsOptionMap.volumeMap[marketAndCode].push(message.value.volume)
        echartsOptionMap.turnoverMap[marketAndCode].push(message.value.turnover)
        echartsOptionMap.lowPriceMap[marketAndCode].push(message.value.lowPrice)
        echartsOptionMap.highPriceMap[marketAndCode].push(message.value.highPrice)
        echartsOptionMap.openPriecMap[marketAndCode].push(message.value.openPrice)
        echartsOptionMap.lastClosePriceMap[marketAndCode].push(message.value.lastClosePrice)
        echartsOptionMap.optionsMap[marketAndCode] = {
            title: {
                text: marketAndCode + "基础报价",
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56'
                    }
                }
            },
            legend: {},
            xAxis: [{
                type: "category",
                boundaryGap: true,
                data: echartsOptionMap.timeMap[marketAndCode]
            }],
            yAxis: [{
                type: "value",
            }],
            series: [
                {
                    name: "最新价",
                    type: "line",
                    data: echartsOptionMap.curPriceMap[marketAndCode]
                },
                {
                    name: "成交量",
                    type: "line",
                    data: echartsOptionMap.volumeMap[marketAndCode]
                },
                {
                    name: "成交额",
                    type: "line",
                    data: echartsOptionMap.turnoverMap[marketAndCode]
                },
                {
                    name: "最低价",
                    type: "line",
                    data: echartsOptionMap.lowPriceMap[marketAndCode]
                },
                {
                    name: "最高价",
                    type: "line",
                    data: echartsOptionMap.highPriceMap[marketAndCode]
                },
                {
                    name: "开盘价",
                    type: "line",
                    data: echartsOptionMap.openPriecMap[marketAndCode]
                },
                {
                    name: "昨天收盘价",
                    type: "line",
                    data: echartsOptionMap.lastClosePriceMap[marketAndCode]
                }
            ]
        }
    } else {
        echartsOptionMap.subscribing.push(marketAndCode);
        echartsOptionMap.timeMap[marketAndCode] = [];
        echartsOptionMap.curPriceMap[marketAndCode] = [];
        echartsOptionMap.volumeMap[marketAndCode] = [];
        echartsOptionMap.turnoverMap[marketAndCode] = [];
        echartsOptionMap.lowPriceMap[marketAndCode] = [];
        echartsOptionMap.highPriceMap[marketAndCode] = [];
        echartsOptionMap.openPriecMap[marketAndCode] = [];
        echartsOptionMap.lastClosePriceMap[marketAndCode] = []
        echartsOptionMap.optionsMap[marketAndCode] = {
            title: {
                text: marketAndCode + "基础报价",
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56'
                    }
                }
            },
            legend: {},
            xAxis: [{
                type: "category",
                boundaryGap: true,
                data: []
            }],
            yAxis: [{
                type: "value",
            }],
            series: [
                {
                    name: "最新价",
                    type: "line",
                    data: []
                }
            ]
        }
    }
}, { deep: true })

const panes = ref([
    { title: "tab1", content: `<div style='width:20px;height:20px;background-color:red'>ddd</div>`, key: "1" },
    { title: "tab2", content: "content2", key: "2" }
])

const activeKey = ref(panes.value[0].key)

</script>
<template>
    <div>
        <a-tabs v-model:activeKey="activeKey" type="editable-card">
            <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title">
                {{ pane.content }}
            </a-tab-pane>
        </a-tabs>
        <v-chart style="height: 400px;" :autoresize="true" v-for="(item, index) in Object.keys(echartsOptionMap.optionsMap)"
            :option="echartsOptionMap.optionsMap[item]"></v-chart>
    </div>
</template>
<style lang="less" scoped></style>