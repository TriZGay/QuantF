<script setup lang="ts">
import { useEventSource } from "@vueuse/core";

const emitterEvent = "kl-test-event";

const { status, data, error, close } = useEventSource(
  "http://localhost:8888/ana/test/data-emitter/code/00700/rehab_type/1/granularity/1/date/2025-08-15",
  [emitterEvent]
);
console.log(error);
</script>
<template>
  <div>首页
    {{ data }}
    {{ status }}
    {{ close }}
    <a @click="close()">close</a>
  </div>
</template>
<style scoped>
</style>
