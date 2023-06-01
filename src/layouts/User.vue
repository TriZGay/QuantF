<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import { useGlobalFTState } from '@/stores/global';
import { storeToRefs } from 'pinia';
import { fetchGlobalMartketState } from '@/api/global';
import { message } from 'ant-design-vue';
import { computed } from 'vue';

const global = useGlobalFTState();
const { status, notify } = storeToRefs(global);

const globalMarketState = computed(() => {
    return JSON.parse(notify.value.content)
})

function refreshMartketState() {
    fetchGlobalMartketState().then(res => {
        message.success(res.data)
    })
}

</script>
<template>
    <a-dropdown>
        <a-avatar>
            <template #icon>
                <UserOutlined />
            </template>
        </a-avatar>
        <template #overlay>
            <a-menu>
                <a-menu-item>
                    WS实时状态:{{ status }}
                </a-menu-item>
                <a-menu-item>
                    <a-popover placement="leftTop" :overlayStyle="{width:'500px'}" >
                        <caret-left-outlined /> 市场状态
                        <template #title>
                            <a-button size="small" @click="refreshMartketState">
                                刷新
                                <template #icon>
                                    <reload-outlined />
                                </template>
                            </a-button>
                        </template>
                        <template #content>
                            <a-row>
                                <a-col :span="24">服务器时间: <span style="font-weight: bolder;">{{ globalMarketState.time
                                }}</span></a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="4">香港股市:</a-col>
                                <a-col :span="8"><span style="font-weight: bolder;">{{
                                    globalMarketState.marketHK }}</span></a-col>
                                <a-col :span="4">香港期货:</a-col>
                                <a-col :span="8"><span style="font-weight: bolder;">{{
                                    globalMarketState.marketHKFuture }}</span></a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="4">大A上海:</a-col>
                                <a-col :span="8"><span style="font-weight: bolder;">{{ globalMarketState.marketSH
                                }}</span></a-col>
                                <a-col :span="4">大A深圳:</a-col>
                                <a-col :span="8">
                                    <span style="font-weight: bolder;">{{ globalMarketState.marketSZ }}</span>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="4">美国股市:</a-col>
                                <a-col :span="8">
                                    <span style="font-weight: bolder;">{{ globalMarketState.marketUS }}</span>
                                </a-col>
                                <a-col :span="4">美国期货:</a-col>
                                <a-col :span="8">
                                    <span style="font-weight: bolder;">{{ globalMarketState.marketUSFuture }}</span>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="4">新加坡期货:</a-col>
                                <a-col :span="8">
                                    <span style="font-weight: bolder;">{{ globalMarketState.marketSGFuture }}</span>
                                </a-col>
                                <a-col :span="4">日本期货:</a-col>
                                <a-col :span="8">
                                    <span style="font-weight: bolder;">{{ globalMarketState.marketJPFuture }}</span>
                                </a-col>
                            </a-row>
                        </template>
                    </a-popover>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>
<style lang="less" scoped></style>