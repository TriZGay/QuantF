<template>
  <a-layout-sider width="200">
    <a-menu
        mode="inline"
        :style="{height:'100%',borderRight:0}">
      <a-sub-menu key="sub1">
        <template #title>
              <span>
                <user-outlined/>
                subnav 1
              </span>
        </template>
        <a-menu-item key="1">option1</a-menu-item>
        <a-menu-item key="2">option2</a-menu-item>
        <a-menu-item key="3">option3</a-menu-item>
        <a-menu-item key="4">option4</a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>

<script lang="ts">
import {UserOutlined} from '@ant-design/icons-vue'

export default {
  name: "LayoutSider",
  components: {
    UserOutlined
  }
}
</script>

<style scoped>

</style>
