<template>
  <a-layout-header class="header">
    <div class="logo"/>
    <a-menu

        mode="horizontal"
        theme="dark"
        :style="{lineHeight:'64px'}">
      <a-menu-item key="1">nav 1</a-menu-item>
      <a-menu-item key="2">nav 2</a-menu-item>
      <a-menu-item key="3">nav 3</a-menu-item>
    </a-menu>
  </a-layout-header>
</template>

<script lang="ts">
export default {
  name: "LayoutHeader",
  setup() {

  }
}
</script>

<style scoped>

</style>
