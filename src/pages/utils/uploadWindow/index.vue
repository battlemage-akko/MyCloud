<script setup>
import Header from "./components/pageHeader.vue";
import { ref, watch, reactive, toRaw } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import electron from "electron";
const remote = require("@electron/remote");
const store = useStore();
const route = useRoute();
const filePath = "upload_" + route.query.path;
const cdn = "https://cdn.lili-secretbase.com/";
const COS = require("cos-nodejs-sdk-v5");
const upload = ref();
const headerRef = ref();
const fileList = ref([]);
const cos = new COS({
  SecretId: store.state.cloud.SecretId,
  SecretKey: store.state.cloud.SecretKey,
});
electron.ipcRenderer.on("uploadResponse",(event, arg) => {
  console.log(JSON.parse(arg))
  previewEventHandle(0)
});
const uploadHandle = () => {
  let list = []
  fileList._value.map((file)=>{
    list.push({
      filePath: file.raw.path,
      fileSize: file.raw.size,
    })
  })
  electron.ipcRenderer.sendTo(
    parseInt(route.query.mainWindowId),
    "upload",
    JSON.stringify(list)
  );
};
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
      <el-upload
        ref="upload"
        v-model:file-list="fileList"
        class="upload-area"
        :drag="true"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        multiple
        :auto-upload="false"
      >
        <div v-show="fileList.length == 0">
          <el-icon style="font-size: 50px; margin-bottom: 20px"
            ><DocumentAdd
          /></el-icon>
          <div class="el-upload__text">点击或者拖动进行上传</div>
        </div>
        <!-- <template #tip>
          <div class="el-upload__tip"> 
            jpg/png files with a size less than 500kb
          </div>
        </template> -->
      </el-upload>
      <el-button plain style="margin-top: 10px" @click="uploadHandle()"
        >上传</el-button
      >
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