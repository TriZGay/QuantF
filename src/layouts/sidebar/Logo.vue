<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
const title = ref<string>("Quantf")
const logo = ref<string>("")

defineProps<{
    collapse: boolean
}>()

</script>

<template>
    <div class="sidebar-logo-container" :class="{ 'collapse': collapse }">
        <Transition name="sidebarLogoFade">
            <RouterLink v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
                <img v-if="logo" :src="logo" class="sidebar-logo">
                <h1 v-else class="sidebar-title">
                    {{ title }}
                </h1>
            </RouterLink>
            <RouterLink v-else key="expand" class="sidebar-logo-link" to="/">
                <img v-if="logo" :src="logo" class="sidebar-logo">
                <h1 class="sidebar-title">
                    {{ title }}
                </h1>
            </RouterLink>
        </Transition>
    </div>
</template>

<style lang="less" scoped>
.sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
    opacity: 0;
}

.sidebar-logo-container {
    position: relative;
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
    line-height: 32px;
    text-align: center;
    overflow: hidden;

    & .sidebar-logo-link {
        height: 100%;
        width: 100%;

        & .sidebar-logo {
            width: 32px;
            height: 32px;
            vertical-align: middle;
            margin-right: 12px;
        }

        & .sidebar-title {
            display: inline-block;
            margin: 0;
            color: #fff;
            font-weight: 600;
            line-height: 32px;
            font-size: 14px;
            font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
            vertical-align: middle;
        }
    }

    &.collapse {
        .sidebar-logo {
            margin-right: 0px;
        }
    }
}
</style>