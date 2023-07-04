<script setup lang="ts">
//@ts-nocheck
import { useStockStore } from '@/stores/stock';
import { storeToRefs } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';
import * as dayjs from 'dayjs';
import * as arraySupport from 'dayjs/plugin/arraySupport';
dayjs.extend(arraySupport);
import { parseMarket, parseExchangeType, FT_MARKET, FT_EXCHANGE_TYPE, FT_SUB_TYPE } from '@/api/code'
import { message, type FormInstance } from 'ant-design-vue';
import { UpOutlined, DownOutlined } from '@ant-design/icons-vue'
import { subscribe } from '@/api/sub'

const stockStore = useStockStore()
const queryStocks = stockStore.run;
const { list, loading, pageSize, current, total } = storeToRefs(stockStore);

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
function onChangeTable(pagination, filters, sorter, { currentDataSource }) {
    let queryForm = handleSearchFormState();
    queryStocks({
        ...queryForm,
        stockType: 3,
        size: pagination.pageSize,
        current: pagination.current
    })
}
function parseDate(date: Array<Number>) {
    return dayjs(date).format("DD/MM/YYYY")
}

const expand = ref<boolean>(false);
const formRef = ref<FormInstance>();
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
function onFinish(values: any) {
    let queryForm = handleSearchFormState();
    queryStocks({
        ...queryForm,
        stockType: 3,
        size: 10,
        current: 1
    })
}
function handleSearchFormState() {
    let queryForm: Object = {};
    Object.keys(formState).forEach(formStateKey => {
        queryForm[formStateKey] = formState[formStateKey].bindValue
    })
    return queryForm;
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
    <div class="stock-list-container">
        <a-form ref="formRef" :model="formState" @finish="onFinish">
            <a-row :gutter="24">
                <template v-for="(value, key, index) in formState" :key="key">
                    <a-col v-show="expand || index <= 6" :span="8">
                        <a-form-item :name="key" :label="value.name">
                            <template v-if="value.type === 'select'">
                                <a-select v-model:value="value.bindValue">
                                    <a-select-option v-for="(option, index) in Object.keys(value.kv) " :value="option"
                                        :key="index">
                                        {{ value.kv[option] }}
                                    </a-select-option>
                                </a-select>
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
        <a-table class="searchResult" :columns="stocksColumns" :data-source="list" :loading="loading"
            :row-key="(record) => record.id" :pagination="pagination" @change="onChangeTable">
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
