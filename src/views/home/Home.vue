<script setup lang="ts">
import HkIpoCard from "@/views/home/HkIpoCard.vue";
import CnIpoCard from "@/views/home/CNIpoCard.vue";
import HeatmapByPlates from "@/views/home/HeatmapByPlates.vue";
</script>
<template>
  <div>
    <a-typography>
      <a-typography-title :level="5">IPO</a-typography-title>
      <a-typography-paragraph>
        <a-row :gutter="32">
          <a-col :span="12">
            <HkIpoCard />
          </a-col>
          <a-col :span="12">
            <CnIpoCard />
          </a-col>
        </a-row>
      </a-typography-paragraph>
    </a-typography>
    <a-typography-title :level="5">热力图</a-typography-title>
    <a-typography-paragraph>
      <HeatmapByPlates :market="1" />
    </a-typography-paragraph>
  </div>
</template>
<style scoped></style>
