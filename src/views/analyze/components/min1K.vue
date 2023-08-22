<script lang="ts" setup>
//@ts-nocheck
import { storeToRefs } from 'pinia';
import { reactive, ref, watch } from 'vue';
import { useAnalyzeMeta } from "@/stores/ana-meta";
import { useAnalyzeKline } from '@/stores/ana-k';
import type { FormInstance } from 'ant-design-vue';
import * as dayjs from 'dayjs'

const analyzeMetaStores = useAnalyzeMeta();
const fetchCodes = analyzeMetaStores.requestMin1KCodes;
const { min1KCodes } = storeToRefs(analyzeMetaStores);

const analyzeKStores = useAnalyzeKline();
const fetchMethod = analyzeKStores.requestMin1K;
const { min1KData, min1KLoading } = storeToRefs(analyzeKStores);
const kLineOptions = ref({})

watch(() => min1KData, kline => {
    let xAxisTime = [];
    let candelstickArray = [];
    let volumes = [];
    kline.value.forEach((k, index) => {
        xAxisTime.push(k.updateTime);
        candelstickArray.push([k.openPrice, k.closePrice, k.lowPrice, k.highPrice])
        volumes.push([index, k.volume, k.openPrice > k.closePrice ? 1 : -1])
    })
    kLineOptions.value = {
        toolbox: {
            feature: {
                myTool1: {
                    show: true,
                    title: "前复权",
                    icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                    onclick: function () {
                        fetchMethod({
                            rehabType: 1,
                            code: formState.code.bindValue,
                            start: dayjs(formState.range.bindValue[0]).format("YYYY-MM-DD HH:mm:ss"),
                            end: dayjs(formState.range.bindValue[1]).format("YYYY-MM-DD HH:mm:ss")
                        })
                    }
                },
                myTool2: {
                    show: true,
                    title: "后复权",
                    icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                    onclick: function () {
                        fetchMethod({
                            rehabType: 2,
                            code: formState.code.bindValue,
                            start: dayjs(formState.range.bindValue[0]).format("YYYY-MM-DD HH:mm:ss"),
                            end: dayjs(formState.range.bindValue[1]).format("YYYY-MM-DD HH:mm:ss")
                        })
                    }
                },
                myTool3: {
                    show: true,
                    title: "不复权",
                    icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                    onclick: function () {
                        fetchMethod({
                            rehabType: 0,
                            code: formState.code.bindValue,
                            start: dayjs(formState.range.bindValue[0]).format("YYYY-MM-DD HH:mm:ss"),
                            end: dayjs(formState.range.bindValue[1]).format("YYYY-MM-DD HH:mm:ss")
                        })
                    }
                }
            },
        },
        xAxis: [{
            type: "category",
            data: xAxisTime,
            boundaryGap: false,
            axisLine: { onZero: false },
            splitLine: { show: false },
            axisPointer: {
                z: 100
            }
        }, {
            type: "category",
            data: xAxisTime,
            boundaryGap: false,
            gridIndex: 1,
            axisLine: { onZero: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
        }],
        yAxis: [{
            scale: true,
            splitArea: {
                show: true
            }
        }, {
            scale: true,
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false }
        }],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        axisPointer: {
            link: [
                {
                    xAxisIndex: 'all'
                }
            ],

        },
        visualMap: {
            show: false,
            seriesIndex: 1,
            dimension: 2,
            pieces: [
                {
                    value: 1,
                    color: '#00da3c'
                },
                {
                    value: -1,
                    color: '#ec0000'
                }
            ]
        },
        grid: [
            {
                height: '50%'
            },
            {
                top: '65%',
                height: '25%'
            }
        ],
        dataZoom: [
            {
                type: "inside",
                xAxisIndex: [0, 1],
                start: 0,
                end: 100
            },
            {
                show: true,
                type: 'slider',
                xAxisIndex: [0, 1],
                top: '90%',
                start: 0,
                end: 100
            }
        ],
        series: [
            {
                name: formState.code.bindValue,
                type: "candlestick",
                data: candelstickArray,
            },
            {
                name: '成交量',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: volumes
            }
        ]
    }
}, { deep: true })

const expand = ref<boolean>(false);
const formRef = ref<FormInstance>();
const formState = reactive({
    code: {
        name: "标的物代码",
        type: "select",
        kv: min1KCodes,
        bindValue: ""
    },
    range: {
        name: "时间范围",
        type: "date-range",
        bindValue: [dayjs(), dayjs().subtract(1, "minute")],
        ranges: {
            '大A交易时段': [dayjs().hour(9).minute(30).second(0), dayjs().hour(15).minute(0).second(0)]
        }
    }
});
function onFinish(values: any) {
    fetchMethod({
        rehabType: 1,
        code: values.code.bindValue,
        start: dayjs(values.range.bindValue[0]).format("YYYY-MM-DD HH:mm:ss"),
        end: dayjs(values.range.bindValue[1]).format("YYYY-MM-DD HH:mm:ss")
    })
}

fetchCodes()
</script>
<template>
    <a-form ref="formRef" :model="formState" @finish="onFinish">
        <a-row :gutter="24">
            <template v-for="(value, key, index) in formState" :key="key">
                <a-col v-show="expand || index <= 6" :span="8">
                    <a-form-item :name="key" :label="value.name">
                        <template v-if="value.type === 'select'">
                            <a-select v-model:value="value.bindValue">
                                <a-select-option v-for="(option, index) in value.kv " :value="option[1]" :key="index">
                                    {{ option }}
                                </a-select-option>
                            </a-select>
                        </template>
                        <template v-if="value.type === 'date-range'">
                            <a-range-picker style="width: 350px;" v-model:value="value.bindValue" :ranges="value.ranges"
                                show-time />
                        </template>
                    </a-form-item>
                </a-col>
            </template>
        </a-row>
        <a-row>
            <a-col :span="24" style="text-align:right">
                <a-button type="primary" html-type="submit">搜索</a-button>
                <a-button style="margin:0 8px" @click="() => formRef.resetFields()">清空</a-button>
                <a style="font-size:12px" @click="expand = !expand">
                    <template v-if="expand">
                        <UpOutlined />
                    </template>
                    <template v-else>
                        <DownOutlined />
                    </template>
                    展开
                </a>
            </a-col>
        </a-row>
    </a-form>
    <v-chart style="height: 400px;" :loading="min1KLoading" :autoresize="true" :option="kLineOptions"></v-chart>
</template>
<style lang="less" scoped></style>