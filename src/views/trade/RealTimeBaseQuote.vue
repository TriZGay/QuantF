<script setup lang="ts">
//@ts-nocheck
import { ref, watch, reactive, computed } from 'vue';
import { useGlobalFTState } from '@/stores/global'
import { storeToRefs } from 'pinia';

const messageStore = useGlobalFTState();
const { notify } = storeToRefs(messageStore);
const basicQuoteMessage = computed(() => {
    if (notify.value != null && notify.value.type === 'RT_BASIC_QUOTE') {
        return notify.value
    }
})

//一个标的物对应一个echarts配置
const echartsOptionMap = reactive({
    subscribing: [],//market+code
    optionsMap: {}
})

const timeAxis = ref([]);
const basicQuoteValue = ref([]);

watch(() => basicQuoteMessage, (message) => {
    let marketAndCode = message.value.content.security.market + "+" + message.value.content.security.code;
    if (echartsOptionMap.subscribing.indexOf(marketAndCode) > -1) {
        timeAxis.value.push(basicQuote.content.updateTime);
        basicQuoteValue.value.push(basicQuote.content.curPrice)
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
                data: timeAxis
            }],
            yAxis: [{
                type: "value",

            }],
            series: [
                {
                    name: "Dynamic line",
                    type: "line",
                    data: basicQuoteValue
                }
            ]
        }
    } else {
        echartsOptionMap.subscribing.push(marketAndCode);
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
                    name: "Dynamic line",
                    type: "line",
                    data: []
                }
            ]
        }
    }
}, { deep: true })

</script>
<template>
    <div>
        <v-chart style="height: 400px;" :autoresize="true" v-for="(item, index) in Object.keys(echartsOptionMap.optionsMap)"
            :option="echartsOptionMap.optionsMap[item]"></v-chart>
    </div>
</template>
<style lang="less" scoped></style>