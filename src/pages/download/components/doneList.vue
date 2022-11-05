<script setup>
import { useStore } from "vuex";
import suffix from "@/utils/dictionary.json";
import { bytesToSize } from "@/utils";
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
const store = useStore();
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
</script>

<template>
  <div class="listContainer">
    <div
      v-for="(item, index) in store.state.cloud.doneList"
      :key="index"
      class="listItem"
    >
      <div class="iconContainer">
        <component
          :is="iconDict[getIcon(item.fileName)]"
          height="20"
          width="20"
        />
      </div>
      <div class="itemName">
        <span style="width: 180px; text-overflow: ellipsis; overflow: hidden">{{
          item.fileName
        }}</span>
        <div style="display:flex;justify-content:space-between;width: 100%">
            <span>
                任务类型: {{ item.taskType }}
            </span>
            <span>
                {{ bytesToSize(item.fileSize) }}
            </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='less' scoped>
.listContainer {
  width: 100%;
  height: calc(100% - 46px);
  overflow: auto;
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
  .iconContainer {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .listItem {
    transition: all 0.5s ease;
    display: flex;
    flex-wrap: nowrap;
    padding: 5px 0px;
    border-bottom: 1px solid fade(@color2, 25%);
    user-select: none;
    cursor: pointer;
    .itemName {
      height: 50px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      span {
        height: 25px;
      }
    }
    &:hover {
        background:fade(@Header, 15%) ;
    }
  }
}
</style>