<template>
  <a-layout>
    <LayoutHeader/>
  </a-layout>
  <a-layout>
    <LayoutSider/>
    <a-layout style="padding:0 24px 24px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>List</a-breadcrumb-item>
        <a-breadcrumb-item>App</a-breadcrumb-item>
      </a-breadcrumb>
      <a-layout-conent
          :style="{background: '#fff', padding: '24px', margin: 0, minHeight: '280px'}">

      </a-layout-conent>
    </a-layout>
  </a-layout>
</template>

<script>
import LayoutHeader from './header'
import LayoutSider from './sider'

export default {
  name: "DefaultLayout",
  components: {
    LayoutHeader,
    LayoutSider
  }
}
</script>

<style scoped>

</style>
