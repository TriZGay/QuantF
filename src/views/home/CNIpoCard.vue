<script setup lang="ts">
import { useFutuStomp } from "@/stores/futu-stomp";
import { storeToRefs } from "pinia";
import type { GetIpoListCommand } from "@/types/message";
import { useTimeoutFn } from "@vueuse/core";
import { onMounted } from "vue";

const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();
const { futuGetIpoList } = storeToRefs(useFutuStomp());
const { start: requestHomeContent } = useTimeoutFn(() => {
  //请求沪深
  const message: GetIpoListCommand = {
    type: "IPO",
    market: 21,
  };
  sendFtCommandOnNotifyEndPoint(message);
}, 1500);
onMounted(() => {
  requestHomeContent();
});

const cnIsEstimateIpoPrice = (status: boolean) => {
  return status ? "是" : "否";
};
const cnIsEstimateWinningRatio = (status: boolean) => {
  return status ? "是" : "否";
};
const cnHasWon = (hasWon: boolean) => {
  return hasWon ? "是" : "否";
};
</script>

<template>
  <a-card title="沪深">
    <a-carousel v-show="futuGetIpoList.cn?.ipoList?.length !== 0" arrows>
      <template #prevArrow>
        <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
          <LeftCircleOutlined />
        </div>
      </template>
      <template #nextArrow>
        <div class="custom-slick-arrow" style="right: 10px">
          <RightCircleOutlined />
        </div>
      </template>
      <div v-for="ipo in futuGetIpoList.cn?.ipoList" class="ipoItem">
        <div>
          <span>代码:</span>
          <span> {{ ipo.basic.security.code }}</span>
        </div>
        <div>
          <span>名称:</span>
          <span> {{ ipo.basic.name }}</span>
        </div>
        <div>
          <span>申购代码:</span>
          <span> {{ ipo.cnExData?.applyCode }}</span>
        </div>
        <div>
          <span>发行总数:</span>
          <span> {{ ipo.cnExData?.issueSize }}</span>
        </div>
        <div>
          <span>网上发行量:</span>
          <span> {{ ipo.cnExData?.onlineIssueSize }}</span>
        </div>
        <div>
          <span>申购上限:</span>
          <span> {{ ipo.cnExData?.applyUpperLimit }}</span>
        </div>
        <div>
          <span>顶格申购需配市值:</span>
          <span> {{ ipo.cnExData?.applyLimitMarketValue }}</span>
        </div>
        <div>
          <span>是否预估发行价:</span>
          <span>{{
            cnIsEstimateIpoPrice(ipo.cnExData?.estimateIpoPrice)
          }}</span>
        </div>
        <div>
          <span>发行价:</span>
          <span> {{ ipo.cnExData?.ipoPrice }}</span>
        </div>
        <div>
          <span>行业市盈率(%):</span>
          <span> {{ ipo.cnExData?.industryPeRate }}</span>
        </div>
        <div>
          <span>是否预估中签率:</span>
          <span>
            {{
              cnIsEstimateWinningRatio(ipo.cnExData?.estimateWinningRatio)
            }}</span
          >
        </div>
        <div>
          <span>中签率(%):</span>
          <span> {{ ipo.cnExData?.winningRatio }}</span>
        </div>
        <div>
          <span>发行市盈率(%):</span>
          <span> {{ ipo.cnExData?.issuePeRate }}</span>
        </div>
        <div>
          <span>申购日期字符串:</span>
          <span> {{ ipo.cnExData?.applyTime }}</span>
        </div>
        <div>
          <span>公布中签日期字符串:</span>
          <span> {{ ipo.cnExData?.winningTime }}</span>
        </div>
        <div>
          <span>是否已经公布中签号:</span>
          <span> {{ cnHasWon(ipo.cnExData?.hasWon) }}</span>
        </div>
        <div v-for="winning in ipo.cnExData?.winningNumData">
          <span class="winningName">分组名:</span>
          <span>{{ winning.winningName }}</span>
          <span>中签号信息:</span>
          <span class="winningInfo">{{ winning.winningInfo }}</span>
        </div>
      </div>
    </a-carousel>
    <a-empty v-show="futuGetIpoList.cn?.ipoList?.length === 0" />
  </a-card>
</template>

<style scoped>
.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
  z-index: 1;
}
.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}
.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.5;
}
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 500px;
  background: #364d79;
  overflow: hidden;
  @apply p-4;
}
.ipoItem {
  color: #ffffff;
  display: grid !important;
  @apply grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-1 text-left;
}

.winningName {
  @apply italic;
}
.winningInfo {
  @apply underline;
}
</style>
