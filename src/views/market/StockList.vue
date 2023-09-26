<script setup lang="ts">
//@ts-nocheck
import { useStockStore } from '@/stores/stock';
import { storeToRefs } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';
import * as dayjs from 'dayjs';
import * as arraySupport from 'dayjs/plugin/arraySupport';
dayjs.extend(arraySupport);
import { parseMarket, parseExchangeType, FT_MARKET, FT_EXCHANGE_TYPE, FT_SUB_TYPE, FT_KL_TYPE } from '@/api/code'
import { message } from 'ant-design-vue';
import { DownOutlined } from '@ant-design/icons-vue'
import { subscribe } from '@/api/sub'
import { syncCapitalFlow, syncCapitalDistribution, syncRehabs, syncHistoryKL } from '@/api/stock'

import AdvancedTable from '@/components/AdvancedTable/AdvancedTable.vue'

const stockStore = useStockStore()
const queryStocks = stockStore.run;
const { list, loading, pageSize, current, total } = storeToRefs(stockStore);

const stocksColumns = ref([
    {
        title: "股票代码",
        dataIndex: "code",
        fixed: "left",
        width: 100
    },
    {
        title: "名称",
        dataIndex: "name",
    },
    {
        title: "每手数量",
        dataIndex: "lotSize",
        width: 100
    },
    {
        title: "上市日期",
        dataIndex: "listingDate"
    },
    {
        title: "是否退市",
        dataIndex: "delisting",
        width: 100
    },
    {
        title: "行情市场",
        dataIndex: "market",
        width: 100
    },
    {
        title: "所属交易所",
        dataIndex: "exchangeType",
        width: 120
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
    queryStocks({
        ...queryForm,
        stockType: 3,
        size: pageSize,
        current: current
    })
}

function parseDate(date: Array<Number>) {
    return dayjs(date).format("DD/MM/YYYY")
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
    }
});

function onFinish(queryForm) {
    queryStocks({
        ...queryForm,
        stockType: 3,
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

const capitalForm = ref({
    periodType: 1,
    dateRange: []
})

const isRealTime = computed(() => capitalForm.value.periodType === 1)

function onSyncCapitalFlow(row) {
    let { market, code } = row;
    let periodType = capitalForm.value.periodType;
    syncCapitalFlow({
        periodType: periodType,
        market: market,
        code: code,
        beginDate: capitalForm.value.dateRange[0],
        endDate: capitalForm.value.dateRange[1]
    }).then(res => {
        message.success(res.data)
    }).catch(err => {
        message.error(err.response.data)
    })

}

function onSyncCapitalDtb(row) {
    let { market, code } = row;
    syncCapitalDistribution({
        market: market,
        code: code
    }).then(res => {
        message.success(res.data)
    }).catch(err => {
        message.error(err.response.data)
    })
}

function onSyncRehabs(row) {
    let { market, code } = row
    syncRehabs({
        market: market,
        code: code
    }).then(res => {
        message.success(res.data)
    }).catch(err => {
        message.error(err.response.data)
    })
}

const historyKForm = ref({
    klType: 0,
    dateRange: []
})

const kTypes = computed(() => {
    let arr = [];
    Object.keys(FT_KL_TYPE)
        .filter(key => {
            return parseInt(key) !== 0
        }).forEach(key => {
            arr.push({
                value: key,
                label: FT_KL_TYPE[key]
            })
        })
    return arr;
})

function onSyncHistoryK(row) {
    let { market, code } = row
    syncHistoryKL({
        market: market,
        code: code,
        klType: historyKForm.value.klType,
        beginDate: historyKForm.value.dateRange[0],
        endDate: historyKForm.value.dateRange[1]
    }).then(res => {
        message.error(res.data)
    }).catch(err => {
        message.error(err.response.data)
    })
}

watch(() => selectedSubType, (val) => {
    indeterminate.value = !!val.value.length && val.value.length < subTypes.value.length;
    checkAll.value = val.value.length === subTypes.value.length;
}, { deep: true })
</script>
<template>
    <div class="stock-list-container">
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
                        <a-dropdown :trigger="['click']">
                            <a @click.prevent>
                                查询资金流向
                                <DownOutlined />
                            </a>
                            <template #overlay>
                                <a-menu style="padding: 10px 10px;">
                                    <a-form layout="horizontal" :model="capitalForm">
                                        <a-form-item label="周期类型">
                                            <a-radio-group v-model:value="capitalForm.periodType" name="periodTypeName">
                                                <a-radio :value="1">实时</a-radio>
                                                <a-radio :value="2">日</a-radio>
                                                <a-radio :value="3">周</a-radio>
                                                <a-radio :value="4">月</a-radio>
                                            </a-radio-group>
                                        </a-form-item>
                                        <a-form-item label="时间范围">
                                            <a-range-picker v-model:value="capitalForm.dateRange" value-format="YYYY-MM-DD"
                                                :disabled="isRealTime" />
                                        </a-form-item>
                                    </a-form>
                                    <a-button type="primary" size="small" @click="onSyncCapitalFlow(record)">确定</a-button>
                                </a-menu>
                            </template>
                        </a-dropdown>
                        <a-divider type="vertical" />
                        <a @click="onSyncCapitalDtb(record)">查询资金分布</a>
                        <a-divider type="vertical" />
                        <a @click="onSyncRehabs(record)">查询复权因子</a>
                        <a-divider type="vertical" />
                        <a-dropdown :trigger="['click']">
                            <a @click.prevent>
                                查询历史K线
                                <DownOutlined />
                            </a>
                            <template #overlay>
                                <a-menu style="padding: 10px 10px;">
                                    <a-form layout="horizontal" :model="historyKForm">
                                        <a-form-item label="K线类型">
                                            <a-radio-group v-model:value="historyKForm.klType" :options="kTypes" />
                                        </a-form-item>
                                        <a-form-item label="时间范围">
                                            <a-range-picker v-model:value="historyKForm.dateRange"
                                                value-format="YYYY-MM-DD" />
                                        </a-form-item>
                                    </a-form>
                                    <a-button type="primary" size="small" @click="onSyncHistoryK(record)">确定</a-button>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </span>
                </template>
            </template>
        </AdvancedTable>
    </div>
</template>
<style lang="less" scoped></style>
