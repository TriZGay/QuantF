<script setup lang="ts">
import { useSnapshot } from "@/components/SnapshotButton/snapshot";

const { requestSnapshot } = useSnapshot();

const props = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  market: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div>
    <a-popconfirm
      title="确定?"
      :disabled="props.disabled"
      @confirm="requestSnapshot(props.market, props.code)"
    >
      <a-button type="link" size="small" :disabled="props.disabled"
        >快照数据</a-button
      >
    </a-popconfirm>
  </div>
</template>

<style scoped lang="less"></style>
