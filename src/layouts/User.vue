<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import { useGlobalFTState } from '@/stores/global';
import { storeToRefs } from 'pinia';

const global = useGlobalFTState();
const { status } = storeToRefs(global);

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
            </a-menu>
        </template>
    </a-dropdown>
</template>
<style lang="less" scoped></style>