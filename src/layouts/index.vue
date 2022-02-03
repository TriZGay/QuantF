<template>
  <el-container>
    <LayoutHeader/>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
import LayoutHeader from '../layouts/header/index.vue'

export default {
  name: "DefaultLayout",
  components: {
    LayoutHeader
  }
}
</script>

<style scoped>

</style>
