<script setup>

</script>

<template>
     <el-container class="container">
      <el-aside class="aside">Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
</template>

<style lang='less'>
.container {
  padding: 20px;
  .aside {
    width: 25%;
    background-color:white;
    border-right: 1px solid fade(@color2, 25%);
    max-width:300px;
  }
  .main {
    width: 75%;
    background-color:white;
  }
}
</style>