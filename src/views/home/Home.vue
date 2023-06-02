<script setup lang="ts">
import { UseNow } from '@vueuse/components'
import { computed } from 'vue';
import { useGlobalFTState } from '@/stores/global';
import { storeToRefs } from 'pinia';
import { useMarketState } from '@/stores/market';

const global = useGlobalFTState();
const { notify } = storeToRefs(global);

const marketState = useMarketState();
const refreshMartketState = marketState.run;
const { data, loading } = storeToRefs(marketState)

const globalMarketState = computed(() => {
  let content = {
    time: "",
    marketHK: "",
    marketHKFuture: "",
    marketSH: "",
    marketSZ: "",
    marketUS: "",
    marketUSFuture: "",
    marketSGFuture: "",
    marketJPFuture: ""
  }
  try {
    console.log(notify.value.content)
    let marketState = JSON.parse(notify.value.conent)
    console.log(marketState)
    Object.assign(content,marketState)
  } catch (error) {
    console.log(error)
  }
  return content;
})

</script>
<template>
  <div>
    <UseNow v-slot="{ now, pause, resume }">
      Now:{{ now }}
    </UseNow>

    市场状态
    <a-button size="small" @click="refreshMartketState">
      刷新
      <template #icon>
        <reload-outlined />
      </template>
    </a-button>
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
  </div>
</template>
<style scoped></style>
