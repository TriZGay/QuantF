<script setup lang="ts">
import path from 'path-browserify'
import { isExternal } from '@/utils/validate';
import MenuItem from './MenuItem.vue';
import Link from './Link.vue';
import type { RouteRecordRaw } from 'vue-router';

const props = defineProps<{
    item: RouteRecordRaw,
    isNest: boolean,
    basePath: string
}>()
const onlyOneChild = null



</script>
<template>

</template>