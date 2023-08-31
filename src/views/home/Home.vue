<script setup lang="ts">
//@ts-nocheck
import { UseNow } from '@vueuse/components'
import { ref, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useMarketState } from '@/stores/market';
import * as dayjs from 'dayjs';

const marketState = useMarketState();
const refreshMartketState = marketState.run;
const { loading, rtMarketState } = storeToRefs(marketState)

const globalMarketState = ref({
  time: "",
  marketHK: "",
  marketHKFuture: "",
  marketSH: "",
  marketSZ: "",
  marketUS: "",
  marketUSFuture: "",
  marketSGFuture: "",
  marketJPFuture: ""
})

watch(() => rtMarketState, (message) => {
  globalMarketState.value = message.value
}, { deep: true })

onMounted(() => {
  refreshMartketState()
})

function parseNow(now: Object) {
  return dayjs(now).format("DD-MM-YYYY HH:mm:ss")
}
</script>
<template>
  <div>
    <a-button size="small" @click="refreshMartketState" style="margin-bottom: 8px;">
      刷新
      <template #icon>
        <reload-outlined />
      </template>
    </a-button>
    <a-row style="margin-bottom: 8px;">
      <a-col :span="24">
        <a-card title="时间" size="small" :loading="loading">
          <UseNow v-slot="{ now, pause, resume }">
            本机客户端时间:<span style="font-weight: bolder;">{{ parseNow(now) }}</span>
          </UseNow>
          <div>
            服务器时间:<span style="font-weight: bolder;">{{ globalMarketState.time }}</span>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :span="6">
        <a-card title="香港市场" size="small" :loading="loading">
          <div>
            香港股市:<span style="font-weight: bolder;">{{ globalMarketState.marketHK }}</span>
          </div>
          <div>
            香港期货:<span style="font-weight: bolder;">{{ globalMarketState.marketHKFuture }}</span>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card title="大A" size="small" :loading="loading">
          <div>
            上海:<span style="font-weight: bolder;">{{ globalMarketState.marketSH }}</span>
          </div>
          <div>
            深圳:<span style="font-weight: bolder;">{{ globalMarketState.marketSZ }}</span>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card title="美国市场" size="small" :loading="loading">
          <div>
            美国股市:<span style="font-weight: bolder;">{{ globalMarketState.marketUS }}</span>
          </div>
          <div>
            美国期货:<span style="font-weight: bolder;">{{ globalMarketState.marketUSFuture }}</span>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card title="其他" size="small" :loading="loading">
          <div>
            新加坡期货:<span style="font-weight: bolder;">{{ globalMarketState.marketSGFuture }}</span>
          </div>
          <div>
            日本期货: <span style="font-weight: bolder;">{{ globalMarketState.marketJPFuture }}</span>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<style scoped></style>
