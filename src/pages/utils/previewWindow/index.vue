<script setup>
import Header from "./components/pageHeader.vue";
import { useRouter, useRoute } from "vue-router";
import picturePreview from "./components/picturePreview.vue";
import { useStore } from "vuex";
const store = useStore()
const route = useRoute();
const filePath = route.query.path
const componentsDic = {
  picture: picturePreview,
};
const cdn = 'https://cdn.lili-secretbase.com/'
const COS = require("cos-nodejs-sdk-v5");
const cos = new COS({
  SecretId: store.state.cloud.SecretId,
  SecretKey: store.state.cloud.SecretKey,
});
console.log(route.params.type);
</script>

<template>
  <div class="PrimaryContainer">
    <el-header class="Header">
      <Header :filePath=filePath />
    </el-header>
    <el-container class="SecondaryContainer">
      <component :is="componentsDic[route.params.type]" :path="route.query.path" :cdn="cdn" :cos="cos"></component>
    </el-container>
  </div>
</template>

<style lang='less' scoped>
@title-height: 30px;
.PrimaryContainer {
  height: 100%;
  width: 100%;
  .Header {
    @format();
    height: @title-height;
    background: @Header;
    padding: 0px;
  }
  .SecondaryContainer {
    height: calc(~"100% - @{title-height}");
    width: 100%;
    .Container {
      background-color: #e9e7f0;
    }
  }
}
</style>