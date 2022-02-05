<template>
  <AConfigprovider :locale="locale">
    <RouterView/>
  </AConfigprovider>
</template>

<script lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

export default {
  setup() {
    return {
      locale: zhCN
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
