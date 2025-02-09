<script setup lang="ts">
//@ts-nocheck
import { FT_ACC_TYPE, FT_FIRM, FT_SIM_ACC_TYPE, FT_TRADE_ENV, FT_TRADE_MARKET_AUTH } from '@/api/code';
import { reactive, ref } from 'vue';
import { useAccountStore } from '@/stores/account';
import { storeToRefs } from 'pinia';
import { fetchAccInfoByAccId, refreshAcc, refreshFunds } from '@/api/account';
import { message } from 'ant-design-vue';

const accountStore = useAccountStore();
const queryAccounts = accountStore.run;
const { list, loading } = storeToRefs(accountStore)
const accountColumns = ref([
    {
        title: "ACC_ID",
        dataIndex: "accId",
        fixed: "left",
        width: 180
    },
    {
        title: "交易市场权限",
        dataIndex: "tradeMarketAuthList"
    },
    {
        title: "交易环境",
        dataIndex: "tradeEnv",
        width: 100
    },
    {
        title: "账户类型",
        dataIndex: "accType",
        width: 120
    },
    {
        title: "卡号",
        dataIndex: "cardNum"
    },
    {
        title: "所属券商",
        dataIndex: "firm",
        width: 150
    },
    {
        title: "模拟交易账户类型",
        dataIndex: "simAccType",
        width: 200
    },
    {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 100
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
function refreshAccList() {
    refreshAcc().then(res => {
        message.success(res.data)
    }).catch(err => {
        message.error(err)
    })
}
function refreshAccFunds() {
    refreshFunds().then(res => {
        message.success(res.data)
    }).catch(err => {
        message.error(err)
    })
}
const accInfoColumns = ref([
    {
        title: "ACC_ID",
        dataIndex: "accId"
    },
    {
        title: "最大购买力",
        dataIndex: "power"
    },
    {
        title: "资产净值",
        dataIndex: "totalAssets"
    },
    {
        title: "现金",
        dataIndex: "cash"
    },
    {
        title: "证券市值",
        dataIndex: "marketVal"
    },
    {
        title: "冻结资金",
        dataIndex: "frozenCash"
    },
    {
        title: "计息金额",
        dataIndex: "debtCash"
    },
    {
        title: "现金可提",
        dataIndex: "avlWithdrawalCash"
    }
]);
const accInfoLoading = ref<boolean>(false);

function queryAccInfoByAccId(expanded, record) {
    if (expanded) {
        accInfoLoading.value = true;
        fetchAccInfoByAccId(record.accId)
            .then(res => {
                record.accInfos = res.data
            })
            .catch(err => {
                message.error(err)
            })
            .finally(() => {
                accInfoLoading.value = false
            })
    } else {

    }
}

const openTradeModal = ref<boolean>(false);

const tradeForm = reactive<Object>({
    
})

function order() {
    console.log('下单')
    openTradeModal.value = false
}
</script>
<template>
    <div class="account-list-container">
        <a-modal v-model:visible="openTradeModal" title="交易" @ok="order">
            <p>ddd</p>
        </a-modal>
        <a-button type="primary" @click="refreshAccList" style="margin-right: 8px;">
            <template #icon>
                <reload-outlined />
            </template>
            刷新账号信息
        </a-button>
        <a-button type="primary" @click="refreshAccFunds" style="margin-right:8px">
            <template #icon>
                <reload-outlined />
            </template>
            刷新账号资金信息
        </a-button>
        <a-button @click="queryAccounts()">
            <template #icon>
                <reload-outlined />
            </template>
        </a-button>
        <a-table class="searchResult" :columns="accountColumns" :data-source="list" :loading="loading"
            :row-key="(record) => record.id" :pagination="false" :scroll="{ x: 1500 }" @expand="queryAccInfoByAccId">
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
                <template v-if="column.key === 'action'">
                    <span>
                        <a @click="openTradeModal = true">交易</a>
                        <a-divider type="vertical" />
                    </span>
                </template>
            </template>
            <template #expandedRowRender="{ record }">
                <a-table size="small" :columns="accInfoColumns" :data-source="record.accInfos" :pagination="false"
                    :loading="accInfoLoading"></a-table>
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