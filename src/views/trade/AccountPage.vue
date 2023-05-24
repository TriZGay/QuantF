<script setup lang="ts">
import { FT_ACC_TYPE, FT_FIRM, FT_SIM_ACC_TYPE, FT_TRADE_ENV, FT_TRADE_MARKET_AUTH } from '@/api/code';
import { ref } from 'vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { useAccountStore } from '@/stores/account';
import { storeToRefs } from 'pinia';

const accountStore = useAccountStore();
const { list, loading } = storeToRefs(accountStore)
const stocksColumns = ref([
    {
        title: "ACC_ID",
        dataIndex: "accId",
        fixed: "left"
    },
    {
        title: "交易市场权限",
        dataIndex: "tradeMarketAuthList"
    },
    {
        title: "交易环境",
        dataIndex: "tradeEnv"
    },
    {
        title: "账户类型",
        dataIndex: "accType"
    },
    {
        title: "卡号",
        dataIndex: "cardNum"
    },
    {
        title: "所属券商",
        dataIndex: "firm"
    },
    {
        title: "模拟交易账户类型",
        dataIndex: "simAccType"
    },
    {
        title: "操作",
        fixed: "right"
    }
])

function parseTradeEnv(tradeEnv: Number) {
    return FT_TRADE_ENV[tradeEnv];
}
function parseFirm(firm: Number) {
    return FT_FIRM[firm];
}
function parseAccType(accType: Number) {
    return FT_ACC_TYPE[accType];
}
function parseSimAccType(simAccType: Number) {
    return FT_SIM_ACC_TYPE[simAccType];
}
function parseMarketAuth(marketAuth: Number) {
    return FT_TRADE_MARKET_AUTH[marketAuth];
}
</script>
<template>
    <div class="account-list-container">
        <a-table class="searchResult" :columns="stocksColumns" :data-source="list" :loading="loading"
            :row-key="(record) => record.id" :pagination="false">
            <template #headerCell="{ column }">
                <template v-if="column.dataIndex === 'tradeMarketAuthList'">
                    <span>
                        {{ column.title }}
                        <a-tooltip placement="topLeft" title="业务账户支持的交易市场权限，即此账户能交易那些市场, 可拥有多个交易市场权限，目前仅单个">
                            <question-circle-outlined />
                        </a-tooltip>
                    </span>
                </template>
                <template v-if="column.dataIndex === 'simAccType'">
                    <span>
                        {{ column.title }}
                        <a-tooltip placement="topLeft">
                            <template #title>
                                <span style="font-weight: bolder;">股票模拟账户</span>:仅用于交易证券类产品，不支持交易期权<br />
                                <span style="font-weight: bolder;">期权模拟账户</span>:仅用于交易期权，不支持交易股票证券类产品
                            </template>
                            <question-circle-outlined />
                        </a-tooltip>
                    </span>
                </template>
            </template>
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'tradeEnv'">
                    {{ parseTradeEnv(record.tradeEnv) }}
                </template>
                <template v-if="column.dataIndex === 'tradeMarketAuthList'">
                    {{ parseMarketAuth(record.tradeMarketAuthList) }}
                </template>
                <template v-if="column.dataIndex === 'firm'">
                    {{ parseFirm(record.firm) }}
                </template>
                <template v-if="column.dataIndex === 'accType'">
                    {{ parseAccType(record.accType) }}
                </template>
                <template v-if="column.dataIndex === 'simAccType'">
                    {{ parseSimAccType(record.simAccType) }}
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