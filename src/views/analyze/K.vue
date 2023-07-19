<script lang="ts" setup>
//@ts-nocheck
import DayK from './components/dayK.vue'
import min15K from './components/min15K.vue';
import min1K from './components/min1K.vue';
import min3K from './components/min3K.vue';
import min5K from './components/min5K.vue';
import min30K from './components/min30K.vue';
import min60K from './components/min60K.vue';
import weekK from './components/weekK.vue';
import monthK from './components/monthK.vue';
import quarterK from './components/quarterK.vue';
import yearK from './components/yearK.vue';
import { ref } from 'vue';
const activeTab = ref('1')

</script>
<template>
    <div class="k-line-container">
        <a-tabs v-model:activeKey="activeTab">
            <a-tab-pane key="1" tab="日K">
                <DayK />
            </a-tab-pane>
            <a-tab-pane key="2" tab="周K">
                <weekK />
            </a-tab-pane>
            <a-tab-pane key="3" tab="月K">
                <monthK />
            </a-tab-pane>
            <a-tab-pane key="4" tab="季K">
                <quarterK />
            </a-tab-pane>
            <a-tab-pane key="5" tab="年K">
                <yearK />
            </a-tab-pane>
            <a-tab-pane key="6" tab="1分K">
                <min1K />
            </a-tab-pane>
            <a-tab-pane key="7" tab="3分K">
                <min3K />
            </a-tab-pane>
            <a-tab-pane key="8" tab="5分K">
                <min5K />
            </a-tab-pane>
            <a-tab-pane key="9" tab="15分K">
                <min15K />
            </a-tab-pane>
            <a-tab-pane key="10" tab="30分K">
                <min30K />
            </a-tab-pane>
            <a-tab-pane key="11" tab="60分K">
                <min60K />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<style lang="less" scoped></style>