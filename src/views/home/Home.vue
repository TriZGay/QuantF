<script setup lang="ts">
//@ts-nocheck
// import { UseNow } from '@vueuse/components'
// import { ref, watch, onMounted } from 'vue';
// import { storeToRefs } from 'pinia';
// import { useMarketState } from '@/stores/market';
// import * as dayjs from 'dayjs';
// import { parseMarket } from '@/api/code'
//
// const marketState = useMarketState();
// const refreshMartketState = marketState.run;
// const refreshHistoryKDetail = marketState.requestHistoryKDetail;
// const { loading, rtMarketState, nowHistoryKDetail } = storeToRefs(marketState)
//
// const globalMarketState = ref({
//   time: "",
//   marketHK: "",
//   marketHKFuture: "",
//   marketSH: "",
//   marketSZ: "",
//   marketUS: "",
//   marketUSFuture: "",
//   marketSGFuture: "",
//   marketJPFuture: ""
// })
//
// const historyKDetailRef = ref({
//   usedQuota: 0,
//   remainQuota: 0,
//   itemList: []
// })
//
// watch(() => nowHistoryKDetail, (message) => {
//   historyKDetailRef.value = message.value
// }, { deep: true })
//
// watch(() => rtMarketState, (message) => {
//   globalMarketState.value = message.value
// }, { deep: true })
//
// onMounted(() => {
//   refreshMartketState();
//   refreshHistoryKDetail();
// })
//
// function refreshInfo() {
//   refreshMartketState();
//   refreshHistoryKDetail();
// }
//
// function parseNow(now: Object) {
//   return dayjs(now).format("DD-MM-YYYY HH:mm:ss")
// }
//
// const showHistoryKDetail = ref<boolean>(false)
//
// function showHistoryKDetailDrawer() {
//   showHistoryKDetail.value = true
// }
</script>
<template>
  <!--  <div>-->
  <!--    <a-button size="small" @click="refreshInfo" style="margin-bottom: 8px;">-->
  <!--      刷新-->
  <!--      <template #icon>-->
  <!--        <reload-outlined />-->
  <!--      </template>-->
  <!--    </a-button>-->
  <!--    <a-button size="small" @click="showHistoryKDetailDrawer" style="margin-bottom: 8px">-->
  <!--      历史K线额度明细-->
  <!--    </a-button>-->
  <!--    <a-drawer v-model:visible="showHistoryKDetail" title="历史K线额度明细">-->
  <!--      <a-row>-->
  <!--        <a-col :span="12">-->
  <!--          <a-statistic title="已用额度" :value="historyKDetailRef.usedQuota" />-->
  <!--        </a-col>-->
  <!--        <a-col :span="12">-->
  <!--          <a-statistic title="剩余额度" :value="historyKDetailRef.remainQuota" />-->
  <!--        </a-col>-->
  <!--      </a-row>-->
  <!--      <a-list item-layout="horizontal" :data-source="historyKDetailRef.itemList">-->
  <!--        <template #renderItem="{ item }">-->
  <!--          <a-list-item>-->
  <!--            <a-list-item-meta :description="'代码:' + item.code + '市场:' + parseMarket(item.market)">-->
  <!--              <template #title>-->
  <!--                {{ item.name }}-->
  <!--              </template>-->
  <!--            </a-list-item-meta>-->
  <!--            <a-list-item>-->
  <!--              {{ item.requestTime }}-->
  <!--            </a-list-item>-->
  <!--          </a-list-item>-->
  <!--        </template>-->
  <!--      </a-list>-->
  <!--    </a-drawer>-->
  <!--    <a-row style="margin-bottom: 8px;">-->
  <!--      <a-col :span="24">-->
  <!--        <a-card title="时间" size="small" :loading="loading">-->
  <!--          <UseNow v-slot="{ now, pause, resume }">-->
  <!--            本机客户端时间:<span style="font-weight: bolder;">{{ parseNow(now) }}</span>-->
  <!--          </UseNow>-->
  <!--          <div>-->
  <!--            服务器时间:<span style="font-weight: bolder;">{{ globalMarketState.time }}</span>-->
  <!--          </div>-->
  <!--        </a-card>-->
  <!--      </a-col>-->
  <!--    </a-row>-->
  <!--    <a-row :gutter="8">-->
  <!--      <a-col :span="6">-->
  <!--        <a-card title="香港市场" size="small" :loading="loading">-->
  <!--          <div>-->
  <!--            香港股市:<span style="font-weight: bolder;">{{ globalMarketState.marketHK }}</span>-->
  <!--          </div>-->
  <!--          <div>-->
  <!--            香港期货:<span style="font-weight: bolder;">{{ globalMarketState.marketHKFuture }}</span>-->
  <!--          </div>-->
  <!--        </a-card>-->
  <!--      </a-col>-->
  <!--      <a-col :span="6">-->
  <!--        <a-card title="大A" size="small" :loading="loading">-->
  <!--          <div>-->
  <!--            上海:<span style="font-weight: bolder;">{{ globalMarketState.marketSH }}</span>-->
  <!--          </div>-->
  <!--          <div>-->
  <!--            深圳:<span style="font-weight: bolder;">{{ globalMarketState.marketSZ }}</span>-->
  <!--          </div>-->
  <!--        </a-card>-->
  <!--      </a-col>-->
  <!--      <a-col :span="6">-->
  <!--        <a-card title="美国市场" size="small" :loading="loading">-->
  <!--          <div>-->
  <!--            美国股市:<span style="font-weight: bolder;">{{ globalMarketState.marketUS }}</span>-->
  <!--          </div>-->
  <!--          <div>-->
  <!--            美国期货:<span style="font-weight: bolder;">{{ globalMarketState.marketUSFuture }}</span>-->
  <!--          </div>-->
  <!--        </a-card>-->
  <!--      </a-col>-->
  <!--      <a-col :span="6">-->
  <!--        <a-card title="其他" size="small" :loading="loading">-->
  <!--          <div>-->
  <!--            新加坡期货:<span style="font-weight: bolder;">{{ globalMarketState.marketSGFuture }}</span>-->
  <!--          </div>-->
  <!--          <div>-->
  <!--            日本期货: <span style="font-weight: bolder;">{{ globalMarketState.marketJPFuture }}</span>-->
  <!--          </div>-->
  <!--        </a-card>-->
  <!--      </a-col>-->
  <!--    </a-row>-->
  <!--  </div>-->
</template>
<style scoped></style>
