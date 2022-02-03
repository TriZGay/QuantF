<template>
  <el-config-provider :locale="locale">
    <RouterView/>
  </el-config-provider>
</template>

<script lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

export default {
  setup() {
    return {
      locale: zhCn
    }
  }
}
</script>
<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
</style>
