<script setup lang="ts">
//@ts-nocheck
import { usePositionStore } from '@/stores/position';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { parseTradeEnv, parseTradeMarketAuth, parsePositionSide } from '@/api/code'

const positionStore = usePositionStore();
const {
    loading,
    pageSize,
    current,
    total,
    positions } = storeToRefs(positionStore);
const positionColumns = ref([
    {
        title: "代码",
        dataIndex: "code",
        fixed: "left"
    },
    {
        title: "名称",
        dataIndex: "name"
    },
    {
        title: "ACC_ID",
        dataIndex: "accId"
    },
    {
        title: "交易环境",
        dataIndex: "tradeEnv"
    },
    {
        title: "交易市场",
        dataIndex: "accTradeMarket"
    },
    {
        title: "持仓方向",
        dataIndex: "positionSide"
    },
    {
        title: "盈亏百分比",
        dataIndex: "plRatio"
    },
    {
        title: "盈亏金额",
        dataIndex: "plVal"
    },
    {
        title: "持有数量",
        dataIndex: "qty"
    },
    {
        title: "可用数量",
        dataIndex: "canSellQty"
    },
    {
        title: "摊薄成本价",
        dataIndex: "costPrice"
    },
    {
        title: "市价",
        dataIndex: "price"
    },
    {
        title: "市值",
        dataIndex: "val"
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
function onChangeTable(pagination, filters, sorter, { currentDataSource }) {
    // let queryForm = handleSearchFormState();
    positionStore.queryPositionList({
        // ...queryForm,
        // stockType: 10,
        size: pagination.pageSize,
        current: pagination.current
    })
}
</script>
<template>
    <div class="position-list-container">
        <a-button type="primary" @click="positionStore.refreshPos()">
            <template #icon>
                <ReloadOutlined />
            </template>
            刷新持仓数据
        </a-button>
        <a-table class="searchResult" :columns="positionColumns" :loading="loading" :data-source="positions"
            :row-key="(record) => record.id" :scroll="{ x: 1600 }" :pagination="pagination" @change="onChangeTable">
            <template #headerCell="{ column }">
                <template v-if="column.dataIndex === 'qty'">
                    <span>
                        {{ column.title }}
                        <a-tooltip placement="topLeft" title="持有数量,2位精度,期权单位是'张'">
                            <question-circle-outlined />
                        </a-tooltip>
                    </span>
                </template>
                <template v-if="column.dataIndex === 'canSellQty'">
                    <span>
                        {{ column.title }}
                        <a-tooltip placement="topLeft" title="可用数量，是指持有的可平仓的数量。可用数量=持有数量-冻结数量。期权和期货的单位是'张'">
                            <question-circle-outlined />
                        </a-tooltip>
                    </span>
                </template>
                <template v-if="column.dataIndex === 'costPrice'">
                    <span>
                        {{ column.title }}
                        <a-tooltip placement="topLeft" title="摊薄成本价(证券账户),平均开仓价(期货账户)。证券无精度限制,期货为2位精度">
                            <question-circle-outlined />
                        </a-tooltip>
                    </span>
                </template>
                <template v-if="column.dataIndex === 'price'">
                    <span>
                        {{ column.title }}
                        <a-tooltip placement="topLeft" title="市价,3位精度,期货为2位精度">
                            <question-circle-outlined />
                        </a-tooltip>
                    </span>
                </template>
                <template v-if="column.dataIndex === 'val'">
                    <span>
                        {{ column.title }}
                        <a-tooltip placement="topLeft" title="市值,3位精度, 期货此字段值为0">
                            <question-circle-outlined />
                        </a-tooltip>
                    </span>
                </template>
                <template v-if="column.dataIndex === 'plVal'">
                    <span>
                        {{ column.title }}
                        <a-tooltip placement="topLeft" title="盈亏金额,3位精度,期货为2位精度">
                            <question-circle-outlined />
                        </a-tooltip>
                    </span></template>
                <template v-if="column.dataIndex === 'plRatio'">
                    <span>
                        {{ column.title }}
                        <a-tooltip placement="topLeft" title="盈亏百分比(如 plRatio 等于0.088代表涨8.8%)，无精度限制">
                            <question-circle-outlined />
                        </a-tooltip>
                    </span></template>
            </template>
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'tradeEnv'">
                    {{ parseTradeEnv(record.tradeEnv) }}
                </template>
                <template v-if="column.dataIndex === 'accTradeMarket'">
                    {{ parseTradeMarketAuth(record.accTradeMarket) }}
                </template>
                <template v-if="column.dataIndex === 'positionSide'">
                    {{ parsePositionSide(record.positionSide) }}
                </template>
            </template>
        </a-table>
    </div>
</template>
<style lang="less" scoped>
.searchResult {
    margin-top: 16px;
    border: 1px dashed #e9e9e9;
    border-radius: 2px;
}
</style>