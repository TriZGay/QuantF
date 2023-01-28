<script setup lang="ts">
import { isExternal } from '@/utils/validate';
import { computed } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

const props = defineProps<{
    to: string
}>()

const $_isExternal = computed<boolean>(() => isExternal(props.to))

const type = computed<string>(() => {
    if ($_isExternal) {
        return 'a'
    }
    return 'router-link'
})

function linkProps(to: RouteLocationRaw) {
    if ($_isExternal) {
        return {
            href: to,
            target: '_blank',
            rel: 'noopener'
        }
    }
    return {
        to: to
    }
}

</script>
<template>
    <component :is="type" v-bind="linkProps(to)">
        <slot />
    </component>
</template>
<style lang="less" scoped>

</style>