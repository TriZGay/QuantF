<script setup lang="ts">
//@ts-nocheck
import { useWarrantStore } from '@/stores/warrant';
import AdvancedTable from '@/components/AdvancedTable/AdvancedTable.vue'
import { storeToRefs } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';
import * as dayjs from 'dayjs';
import * as arraySupport from 'dayjs/plugin/arraySupport';
dayjs.extend(arraySupport);
import { FT_MARKET, FT_EXCHANGE_TYPE, FT_SUB_TYPE } from '@/api/code'
import { message } from 'ant-design-vue';
import { subscribe } from '@/api/futu';

const warrantStore = useWarrantStore();
const queryWarrants = warrantStore.run;
const { list, loading, pageSize, current, total } = storeToRefs(warrantStore);

const stocksColumns = ref([
    {
        title: "股票代码",
        dataIndex: "code",
        fixed: "left"
    },
    {
        title: "名称",
        dataIndex: "name",
    },
    {
        title: "每手数量",
        dataIndex: "lotSize"
    },
    {
        title: "上市日期",
        dataIndex: "listingDate"
    },
    {
        title: "是否退市",
        dataIndex: "delisting"
    },
    {
        title: "行情市场",
        dataIndex: "market"
    },
    {
        title: "所属交易所",
        dataIndex: "exchangeType"
    },
    {
        title: "操作",
        key: "action",
        fixed: "right"
    }
])

const pagination = computed<Object>(() => {
    return {
        total: total.value,
        current: current.value,
        pageSize: pageSize.value,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
    }
})
function onChangeTable(tableProps: Object) {
    let queryForm = tableProps.form
    let { pageSize, current } = tableProps.pagination
    queryWarrants({
        ...queryForm,
        stockType: 5,
        size: pageSize,
        current: current
    })
}
function parseDate(date: Array<Number>) {
    return dayjs(date).format("DD/MM/YYYY")
}
function parseMarket(marketValue: Number) {
    return FT_MARKET[marketValue];
}
function parseExchangeType(exchangeValue: Number) {
    return FT_EXCHANGE_TYPE[exchangeValue];
}

const formState = reactive({
    market: {
        name: "行情市场",
        type: "select",
        kv: FT_MARKET,
        bindValue: Object.keys(FT_MARKET)[1]
    },
    exchangeType: {
        name: "交易所",
        type: "select",
        kv: FT_EXCHANGE_TYPE,
        bindValue: Object.keys(FT_EXCHANGE_TYPE)[1]
    },
    delisting: {
        name: "是否退市",
        type: "select",
        kv: {
            1: "是",
            0: "否"
        },
        bindValue: '0'
    },
    name: {
        name: "名称",
        type: "input",
        bindValue: ""
    }
});
function onFinish(queryForm) {
    queryWarrants({
        ...queryForm,
        stockType: 5,
        size: 10,
        current: 1
    })
}
const subTypes = computed(() => {
    let arr = []
    Object.keys(FT_SUB_TYPE).forEach(key => {
        arr.push({
            label: FT_SUB_TYPE[key],
            value: key
        })
    })
    return arr;
})

const selectedSubType = ref([]);

function onClick2Subscribe(row) {
    let { market, code, name, stockType } = row;
    subscribe({
        securityList: [{
            market: market,
            code: code,
            name: name,
            type: stockType
        }],
        subTypeList: selectedSubType.value
    }).then(res => {
        message.success(res.data)
    }).catch(err => {
        message.error(err.response.data)
    })
}
const checkAll = ref(false);
const indeterminate = ref(false)

function onCheckAllChange(e: any) {
    indeterminate.value = false;
    selectedSubType.value = e.target.checked ? subTypes.value.map(v => v.value) : [];
}
watch(() => selectedSubType, (val) => {
    indeterminate.value = !!val.value.length && val.value.length < subTypes.value.length;
    checkAll.value = val.value.length === subTypes.value.length;
}, { deep: true })
</script>
<template>
    <div class="warrant-list-container">
        <AdvancedTable :form="formState" @on-finish="onFinish" :columns="stocksColumns" :data-source="list"
            :loading="loading" :row-key="(record) => record.id" :pagination="pagination" @on-change-table="onChangeTable">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'listingDate'">
                    {{ parseDate(record.listingDate) }}
                </template>
                <template v-if="column.dataIndex === 'delisting'">
                    {{ record.delisting === 1 ? "是" : "否" }}
                </template>
                <template v-if="column.dataIndex === 'market'">
                    {{ parseMarket(record.market) }}
                </template>
                <template v-if="column.dataIndex === 'exchangeType'">
                    {{ parseExchangeType(record.exchangeType) }}
                </template>
                <template v-if="column.key === 'action'">
                    <span>
                        <a-dropdown :trigger="['click']">
                            <a @click.prevent>
                                订阅
                                <DownOutlined />
                            </a>
                            <template #overlay>
                                <a-menu style="padding: 10px 10px;">
                                    <a-checkbox v-model:checked="checkAll" :indeterminate="indeterminate"
                                        @change="onCheckAllChange">全选</a-checkbox>
                                    <br />
                                    <a-checkbox-group style="width:100px" v-model:value="selectedSubType"
                                        :options="subTypes" />
                                    <br />
                                    <a-button type="primary" size="small" @click="onClick2Subscribe(record)">确定</a-button>
                                </a-menu>
                            </template>
                        </a-dropdown>
                        <a-divider type="vertical" />
                    </span>
                </template>
            </template>
        </AdvancedTable>
    </div>
</template>
<style lang="less" scoped></style>
