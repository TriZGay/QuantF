<script lang="ts" setup>
//@ts-nocheck
import { useAttrs, useSlots } from 'vue';
import SearchArea from '@/components/SearchArea/SearchArea.vue'

const attrs = useAttrs()
const slots = useSlots()

function handleSearchFormState(values: any) {
    let queryForm: Object = {};
    Object.keys(values).forEach(key => {
        queryForm[key] = values[key].bindValue
    })
    return queryForm;
}

const emit = defineEmits<{
    (e: 'onFinish', formValue: Object): void,
    (e: 'onChangeTable', tableProps: Object): void
}>()

function onEmitFinish(queryForm: Object) {
    emit('onFinish', queryForm)
}

function onEmitChangeTable(pagination, filters, sorter, { currentDataSource }) {
    let queryForm = handleSearchFormState(attrs.form);
    emit('onChangeTable', {
        pagination: pagination,
        form: queryForm,
        filters: filters,
        sorter: sorter,
        data: currentDataSource
    })
}

</script>
<template>
    <SearchArea v-bind="attrs" @on-finish="onEmitFinish" />
    <a-table class="searchResult" v-bind="attrs" @change="onEmitChangeTable">
        <template v-for="(_value, name) in slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData || {}"></slot>
        </template>
    </a-table>
</template>
<style lang="less" scoped>
.searchResult {
    margin-top: 16px;
    border: 1px dashed #e9e9e9;
    border-radius: 2px;
}
</style>