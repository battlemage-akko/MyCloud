<script setup>
import { CaretRight } from "@element-plus/icons-vue";
import suffix from "@/utils/dictionary.json";
import {
  Search,
  FolderAdd,
  Download,
  Picture,
  VideoPlay,
  Folder,
  Back,
  QuestionFilled,
  Upload,
  FolderOpened,
  Close,
  VideoPause,
} from "@element-plus/icons-vue";
import iconDict from "@/utils/icon.json";
import { bytesToSize } from "@/utils";
import store from "../../../store";
const props = defineProps({
  _queue: Array,
});
const getIcon = (path) => {
  const index = path.lastIndexOf(".");
  const suffixName = path.substring(index);
  for (const key of Object.keys(suffix)) {
    if (suffix[key].indexOf(suffixName) != -1) {
      return key;
    }
  }
  return "other";
};
const uploadHandle = (item) => {
  switch (item.status) {
    case "ready":
      store.commit("addUploadTotal", item.fileSize);
      item.start(item);
      break;
    case "start":
      item.pause();
      break;
    default:
      break;
  }
};
</script>

<template>
  <el-container class="progressContainer">
    <el-header class="header">
      <el-progress
        :percentage="
          (store.state.cloud.uploadTotal / store.state.cloud.uploadLoaded) * 100
        "
        color="#352f44"
        :show-text="false"
        style="width: 100%"
      >
      </el-progress>
      <el-button type="primary" color="#352f44" style="margin-left: 20px"
        >开始</el-button
      >
      <el-button>暂停</el-button>
    </el-header>
    <el-main class="main">
      <div
        v-for="(item, index) in props._queue"
        :key="index"
        class="downloadingItem"
      >
        <div class="itemContainer">
          <div class="content">
            <span class="taskType">{{ item.taskType }}</span>
            <component
              :is="iconDict[getIcon(item.filePath)]"
              height="20"
              width="20"
            />
            <span class="name">
              {{ item.fileName }}
            </span>
          </div>
          <div style="margin-right: 15px; white-space: nowrap">
            <span
              style="font-size: 12px; margin-right: 20px"
              v-if="item.status === 'start'"
            >
              {{ bytesToSize(item.uploadSpeed) }} /s
            </span>
            <span style="font-size: 12px; margin-right: 20px">
              {{ bytesToSize(item.fileSize) }}
            </span>
            <el-button
              link
              :icon="item.status === 'start' ? VideoPause : CaretRight"
              @click="uploadHandle(item)"
              style="font-size: 18px"
            ></el-button>
            <el-button
              link
              :icon="FolderOpened"
              style="font-size: 18px"
            ></el-button>
            <el-button link :icon="Close" style="font-size: 18px"></el-button>
          </div>
        </div>
        <el-progress
          :percentage="item.uploadPercent*100"
          color="#352f44"
          :show-text="false"
          style="width: 100%"
          stroke-linecap="butt"
        >
        </el-progress>
      </div>
    </el-main>
  </el-container>
</template>

<style lang='less' scoped>
.progressContainer {
  height: 100%;
  width: 100%;
  .header {
    padding: 5px 10px 5px 20px;
    height: 46px;
    display: inline-flex;
    align-items: center;
    border-bottom: 1px solid fade(@color2, 10%);
  }
  .main {
    height: 100%;
    width: 100%;
    overflow: auto;
    padding: 0px;
    position: relative;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      background: #535353;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      border-radius: 10px;
      background: #ededed;
    }
    .downloadingItem {
      height: 60px;
      width: 100%;
      position: relative;
      border-bottom: 1px solid fade(@color2, 20%);
      display: flex;
      flex-direction: column;
      .itemContainer {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .content {
          display: flex;
          align-items: center;
          margin-left: 15px;
          .taskType {
            user-select: none;
            font-weight: 520;
            background: @Header;
            color: white;
            border-radius: 60px;
            padding: 0px 15px;
            margin-right: 15px;
          }
          .name {
            margin: 0px 5px;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 300px;
          }
        }
      }
      :deep(.el-progress) {
        .el-progress-bar {
          .el-progress-bar__outer {
            height: 2px !important;
          }
        }
      }
    }
  }
}
</style>