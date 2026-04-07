<script setup lang="ts">
import HkIpoCard from "@/views/home/HkIpoCard.vue";
import CnIpoCard from "@/views/home/CNIpoCard.vue";
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
  </div>
</template>
<style scoped></style>
