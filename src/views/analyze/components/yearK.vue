<script lang="ts" setup>
//@ts-nocheck
import { storeToRefs } from 'pinia';
import { reactive, ref, watch } from 'vue';
import { useAnalyzeMeta } from "@/stores/ana-meta";
import { useAnalyzeKline } from '@/stores/ana-k';
import type { FormInstance } from 'ant-design-vue';
import * as dayjs from 'dayjs'

const analyzeMetaStores = useAnalyzeMeta();
const fetchCodes = analyzeMetaStores.requestYearKCodes;
const { yearKCodes } = storeToRefs(analyzeMetaStores);

const analyzeKStores = useAnalyzeKline();
const fetchMethod = analyzeKStores.requestYearK;
const { yearKData, yearKLoading } = storeToRefs(analyzeKStores);
const kLineOptions = ref({})

watch(() => yearKData, kline => {
    let xAxisTime = [];
    let candelstickArray = [];
    kline.value.forEach(k => {
        xAxisTime.push(k.updateTime);
        candelstickArray.push([k.openPrice, k.closePrice, k.lowPrice, k.highPrice])
    })
    kLineOptions.value = {
        xAxis: {
            data: xAxisTime
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
                data: candelstickArray
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
        kv: yearKCodes,
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
    <v-chart style="height: 400px;" :loading="yearKLoading" :autoresize="true" :option="kLineOptions"></v-chart>
</template>
<style scoped lang="less"></style>