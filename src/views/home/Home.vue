<script setup lang="ts">
import { UseNow } from '@vueuse/components'

</script>
<template>
  <div>
    <UseNow v-slot="{ now, pause, resume }">
      Now:{{ now }}
    </UseNow>
  </div>
</template>
<style scoped></style>
