<script setup lang="ts">
//@ts-nocheck
import { useSubStores } from '@/stores/sub';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { parseFTsubType, parseSecurityType } from '@/api/code'
const subStores = useSubStores();
const refreshSubscribeInfo = subStores.syncSub;
const fetchSubscribeInfo = subStores.querySubscribeInfo;
const {
    syncLoading,
    queryLoading,
    subscribeInfoList,
    queryPageSize,
    queryCurrent,
    queryTotal
} = storeToRefs(subStores);

const subscribeInfoColumns = ref([
    {
        title: "代码",
        dataIndex: "securityCode",
        fixed: "left"
    },
    {
        title: "名称",
        dataIndex: "securityName",
    },
    {
        title: "标的物类型",
        dataIndex: "securityType"
    },
    {
        title: "订阅类型",
        dataIndex: "subType"
    },
    {
        title: "操作",
        key: "action"
    }
])
function onChangeTable(pagination, filters, sorter, { currentDataSource }) {
    // let queryForm = handleSearchFormState();
    fetchSubscribeInfo({
        // ...queryForm,
        size: pagination.pageSize,
        current: pagination.current
    })
}

const pagination = computed<Object>(() => {
    return {
        total: queryTotal.value,
        current: queryCurrent.value,
        pageSize: queryPageSize.value,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
    }
})
function handleSearchFormState() {
    let queryForm: Object = {};
    Object.keys(formState).forEach(formStateKey => {
        queryForm[formStateKey] = formState[formStateKey].bindValue
    })
    return queryForm;
}

fetchSubscribeInfo({
    size: 10,
    current: 1
})

</script>
<template>
    <div class="subscribe-info-container">
        <a-button @click="refreshSubscribeInfo()" :loading="syncLoading">
            刷新
            <template #icon>
                <reload-outlined />
            </template>
        </a-button>
        <a-table class="searchResult" :columns="subscribeInfoColumns" :data-source="subscribeInfoList"
            :loading="queryLoading" :row-key="(record) => record.id" :pagination="pagination" @change="onChangeTable">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'securityType'">
                    {{ parseSecurityType(record.securityType) }}
                </template>
                <template v-if="column.dataIndex === 'subType'">
                    {{ parseFTsubType(record.subType) }}
                </template>
                <template v-if="column.key === 'action'">
                    <span>
                        <a>订阅</a>
                        <a-divider type="vertical" />
                    </span>
                </template>
            </template>
        </a-table>
    </div>
</template>
<style lang="less" scoped>
.subscribe-info-container {}

.searchResult {
    margin-top: 16px;
    border: 1px dashed #e9e9e9;
    border-radius: 2px;
}
</style>