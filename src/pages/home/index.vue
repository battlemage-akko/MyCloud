<script setup>
import Menu from "./components/asideMenu.vue";
import Title from "./components/header.vue";
import { ElNotification } from "element-plus";
import { test } from "@/service/api";
import Setting from "@/components/setting.vue";
import { ref, reactive, watch } from "vue";
import isElectron from "is-electron";
import { useStore } from "vuex";
import electron from "electron";
import { getCurrentWebContents } from "@electron/remote";
const webContent = getCurrentWebContents();
const store = useStore();
const _queue = reactive([]);
const fs = require("fs");
const COS = require("cos-nodejs-sdk-v5");
const cos = new COS({
  SecretId: store.state.cloud.SecretId,
  SecretKey: store.state.cloud.SecretKey,
});

const globalTips = (message, type) => {
  ElNotification({
    customClass: "tips",
    message: message,
    position: "bottom-right",
  });
};
const DUHandle = (fileList) => {};
// 200 添加下载文件成功
// 300 文件列表为空
electron.ipcRenderer.on("upload", (event, arg) => {
  const tmp = JSON.parse(arg);
  if (tmp.length === 0) {
    electron.ipcRenderer.sendTo(event.senderId, "uploadResponse", 300);
  } else {
    tmp.map((file) => {
      file.uploadSpeed = 0
      file.start = function (file) {
        file.status = "start";
        cos.uploadFile(
          {
            Bucket: store.state.cloud.Bucket,
            Region: store.state.cloud.Region,
            Key: file.uploadPath + file.fileName,
            StorageClass: "STANDARD",
            FilePath: file.filePath, // 上传文件对象
            ContentLength: file.fileSize,
            // SliceSize: 1024 * 1024 * 10,
            onProgress: function (progressData) {
              file.progress = JSON.stringify(progressData);
              file.uploadPercent = progressData.percent
              file.uploadSpeed = progressData.speed
              if (progressData.speed > progressData.total-progressData.loaded) {
                // console.log('progressData.speed > progressData.total-progressData.loaded',store.state.cloud.uploadTotal,store.state.cloud.uploadLoaded,progressData)
                store.commit('addUploadLoaded',progressData.total-progressData.loaded)
              }
              else {
                store.commit('addUploadLoaded',progressData.speed)
              }
              console.log(JSON.stringify(progressData));
            },
            onTaskReady: function (taskId) {
              (file.taskId = taskId) /* 非必须 */, console.log(taskId);
            },
          },
          function (err, data) {
            console.log(err || data);
            if(data.statusCode === 200){
              file.status = 'done'
              store.commit('pushDoneList',{
                fileName: file.fileName,
                filePath: file.filePath,
                fileSize: file.fileSize,
                fileType: file.fileType,
                taskType: file.taskType
              })
              _queue.splice(_queue.indexOf(file),1)
            }
          }
        );
      };
      file.pause = function (file) {
        cos.pauseTask(file.taskId);
        file.status = "pause";
      };
      file.restart = function (file) {
        cos.restartTask(file.taskId);
        file.status = "start";
      };
      file.status = "ready";
      _queue.push(file);
    });
    electron.ipcRenderer.sendTo(event.senderId, "uploadResponse", 200);
    globalTips("添加 " + tmp.length + " 个下载任务", 1);
  }
});

store.commit("setMainWindowId", webContent.id);

const isCollapse = ref(false);
const settingVisible = ref(false);
const handleSettingClose = () => {
  settingVisible.value = false;
};
const handleSettingOpen = () => {
  settingVisible.value = true;
};
const handleOpen = () => {
  isCollapse.value = !isCollapse.value;
};
const noticeHandle = () => {
  test().then((res) => {
    console.log(res);
  });
};

watch(
  () => _queue,
  (newValue, oldValue) => {
    console.log(oldValue, newValue);
  },
  { deep: true }
);
</script>

<template>
  <div class="PrimaryContainer">
    <el-header class="Header" v-if="isElectron()"><Title /></el-header>
    <el-container class="SecondaryContainer">
      <el-aside :class="isCollapse ? 'Aside' : 'Aside active'">
        <Menu :isCollapse="isCollapse" />
        <div>
          <div class="hide" @click="noticeHandle">
            <el-icon><BellFilled /></el-icon>
          </div>
          <div class="hide" @click="handleSettingOpen">
            <el-icon><Tools /></el-icon>
          </div>
          <div class="hide" @click="handleOpen">
            <el-icon><Fold /></el-icon>
          </div>
        </div>
      </el-aside>
      <el-container class="Container">
        <router-view :cos="cos" :store="store" :_queue="_queue" />
      </el-container>
    </el-container>
    <el-container class="settingContainer"> 123 </el-container>

    <Setting
      :settingVisible="settingVisible"
      @handleSettingClose="handleSettingClose"
    />
  </div>
</template>

<style lang='less' scoped>
@title-height: 30px;
.PrimaryContainer {
  height: 100%;
  width: 100%;
  .settingContainer {
    width: 100%;
    height: calc(~"100% - @{title-height}");
    top: 30px;
    position: fixed;
    background: @Header;
    display: none;
  }
  .SecondaryContainer {
    height: calc(~"100% - @{title-height}");
    width: 100%;
    .Container {
      background-color: #e9e7f0;
    }
  }
}
.Aside {
  display: flex;
  color: @text-color;
  flex-direction: column;
  justify-content: space-between;
  background: @AsideMenu;
  height: 100%;
  transition: all 0.5s ease;
  width: 250px;
  overflow-x: hidden;
  &.active {
    width: 64px;
  }
  .hide {
    height: 60px;
    cursor: pointer;
    width: 100%;
    @format();
    transition: all 0.2s ease;
    &:hover {
      background: @AsideMenu-button-hover;
    }
  }
}
.Header {
  @format();
  height: @title-height;
  background: @Header;
  padding: 0px;
}
</style>