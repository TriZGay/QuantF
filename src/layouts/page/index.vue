<template>
  <RouterView>
    <template #default="{Component,route}">
      <transition>
        <keep-alive v-if="openCache" :include="getCaches">
          <component :is="Component" :key="route.fullPath"></component>
        </keep-alive>
        <component v-else :is="Component" :key="route.fullPath"></component>
      </transition>
    </template>
  </RouterView>
</template>

<script lang="ts">
import {computed, unref} from 'vue';
import {getTransitionName} from "./transition";
import {useMultipleTabsSetting} from "../../setting/useMultipleTabsSetting";
import {useTransitionSetting} from "../../setting/useTransitionSetting";
import {useRootSetting} from "../../setting/useRootSetting";
import {useMultipleTabStore} from "../../store/multipleTab";

export default {
  name: "PageLayout",
  components: {},
  setup() {
    const {getShowMultipleTab} = useMultipleTabsSetting();
    const tabStore = useMultipleTabStore();
    const {getOpenKeepAlive} = useRootSetting();

    const {getBasicTransition, getEnableTransition} = useTransitionSetting();
    const openCache = computed(() => unref(getOpenKeepAlive) && unref(getShowMultipleTab));

    const getCaches = computed((): string[] => {
      if (!unref(getOpenKeepAlive)) {
        return [];
      }
      return tabStore.getCachedTabList;
    })

    return {
      getTransitionName,
      openCache,
      getEnableTransition,
      getBasicTransition,
      getCaches,
    }
  }
}
</script>

<style scoped>

</style>
