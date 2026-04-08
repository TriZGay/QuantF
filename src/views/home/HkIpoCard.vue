<script setup lang="ts">
import { useFutuStomp } from "@/stores/futu-stomp";
import { storeToRefs } from "pinia";
import type { GetIpoListCommand } from "@/types/message";
import { useTimeoutFn } from "@vueuse/core";
import { onMounted } from "vue";

const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();
const { futuGetIpoList } = storeToRefs(useFutuStomp());
const { start: requestHomeContent } = useTimeoutFn(() => {
  //请求港股
  const message: GetIpoListCommand = {
    type: "IPO",
    market: 1,
  };
  sendFtCommandOnNotifyEndPoint(message);
}, 1000);
onMounted(() => {
  requestHomeContent();
});

const hkSubscribeStatus = (status: boolean) => {
  return status ? "认购中" : "待上市";
};
</script>

<template>
  <a-card title="港股">
    <a-carousel v-show="futuGetIpoList.hk?.ipoList?.length !== 0" arrows>
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
      <div v-for="ipo in futuGetIpoList.hk?.ipoList" class="ipoItem">
        <div>
          <span>代码:</span>
          <span> {{ ipo.basic.security.code }}</span>
        </div>
        <div>
          <span>名称:</span>
          <span> {{ ipo.basic.name }}</span>
        </div>
        <div>
          <span>最低发售价:</span>
          <span> {{ ipo.hkExData?.ipoPriceMin }}</span>
        </div>
        <div>
          <span>最高发售价:</span>
          <span> {{ ipo.hkExData?.ipoPriceMax }}</span>
        </div>
        <div>
          <span>上市价:</span>
          <span> {{ ipo.hkExData?.listPrice }}</span>
        </div>
        <div>
          <span>每手股数:</span>
          <span> {{ ipo.hkExData?.lotSize }}</span>
        </div>
        <div>
          <span>入场费:</span>
          <span> {{ ipo.hkExData?.entrancePrice }}</span>
        </div>
        <div>
          <span>是否为认购状态:</span>
          <span> {{ hkSubscribeStatus(ipo.hkExData?.subscribeStatus) }}</span>
        </div>
        <div>
          <span>截止认购日期:</span>
          <span> {{ ipo.hkExData?.applyEndTime }}</span>
        </div>
      </div>
    </a-carousel>
    <a-empty v-show="futuGetIpoList.hk?.ipoList?.length === 0" />
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
  height: 160px;
  background: #364d79;
  overflow: hidden;
  @apply p-4;
}
.ipoItem {
  color: #ffffff;
  display: grid !important;
  @apply grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-1 text-left;
}
</style>
