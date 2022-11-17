<script setup>
import { ref, watch, reactive, toRaw } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import electron from "electron";
import Header from "./components/pageHeader.vue";
const remote = require("@electron/remote");
const store = useStore();
const route = useRoute();
const filePath = "download_" + route.query.path;
const previewEventHandle = (type) => {
  electron.ipcRenderer.send(
    "assistantWindowEvent",
    JSON.stringify({
      id: filePath,
      type: type,
    })
  );
};
</script>

<template>
  <div class="PrimaryContainer">
    <el-header class="Header">
      <Header :filePath="filePath" :previewEventHandle="previewEventHandle" />
    </el-header>
    <el-container class="SecondaryContainer">
      
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
    background-color: @Header;
    display: flex;
    flex-direction: column;
    padding: 20px;
    .upload-area {
      width: 100%;
      height: 100%;
      position: relative;
      :deep(.el-upload-list) {
        position: absolute;
        top: 0px;
        overflow: auto;
        width: 100%;
        max-height: 100%;
        margin: 0px;
        .el-upload-list__item {
          margin: 0px;
          padding: 5px 0px;
        }
        &::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background: #535353;
        }
        &::-webkit-scrollbar-track {
          border-radius: 10px;
          background: #ededed;
        }
      }
      :deep(.el-upload) {
        height: 100%;
        .el-upload-dragger {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          &:hover {
          }
        }
      }
    }
  }
}
</style>