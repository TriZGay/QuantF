<script  setup lang="ts">
//@ts-nocheck
import { ref } from 'vue';
const props = defineProps({
    marketAndCodes: Array
})
const activeKey = ref("")

</script>
<template>
    <a-tabs v-model:activeKey="activeKey" type="editable-card">
        <a-tab-pane v-for="pane in props.marketAndCodes" :key="pane.key" :tab="pane.title">
            <v-chart v-for="option in pane.rehabTypesWithOptions" style="height: 400px;" :autoresize="true"
                :option="option.options"></v-chart>
        </a-tab-pane>
    </a-tabs>
</template>
<style lang="less" scoped></style>