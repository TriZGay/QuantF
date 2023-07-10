<script lang="ts" setup>
import { useAnalyzeQuote } from '@/stores/ana-quote';
import { storeToRefs } from 'pinia';
import { reactive } from 'vue';

const quoteStores = useAnalyzeQuote();
const fetchMethod = quoteStores.requestBasicQuotes;
const { loading, quotesData } = storeToRefs(quoteStores);

const kLineOptions = reactive({
    xAxis: {
        data: quotesData.value.map(data => data.updateTime)
    },
    yAxis: {
        scale: true,
        splitArea: {
            show: true
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    dataZoom: [
        {
            type: "inside",
            start: 50,
            end: 100
        },
        {
            show: true,
            type: 'slider',
            top: '90%',
            start: 50,
            end: 100
        }
    ],
    series: [
        {
            type: "candlestick",
            data: quotesData.value.map(data => {
                return [
                    data.openPrice,
                    data.lastClosePrice,
                    data.lowPrice,
                    data.highPrice
                ]
            })

        }
    ]
})

fetchMethod({
    code: "000001",
    start: "2023-07-06 00:00:00",
    end: "2023-07-06 23:59:59"
})

</script>
<template>
    <div>
        <v-chart style="height: 400px;" :loading="loading" :autoresize="true" :option="kLineOptions"></v-chart>
    </div>
</template>
<style lang="less" scoped></style>