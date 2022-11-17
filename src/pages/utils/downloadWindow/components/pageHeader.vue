<script setup>
import { ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useStore } from "vuex";
import electron from "electron";
import { useRouter, useRoute } from "vue-router";
import { getCurrentWebContents } from "@electron/remote";

const webContent = getCurrentWebContents();
const route = useRoute();
const store = useStore();
const dialogVisible = ref(false);
const isMaximized = ref(false);
const props = defineProps({
  filePath: String,
  previewEventHandle: Function,
});

const previewEventHandle = (type) => {
  props.previewEventHandle(type)
};

</script>

<template>
  <div class="title">
    <div style="width: 150px;color: white;font-size:14px;display: flex;align-items: center;font-weight:400">
      <img src="@/assets/flower_white.png" alt="" class="logo" /><span>上传</span>
    </div>
    <div class="dragArea"></div>
    <ul class="btns">
      <li @click="previewEventHandle(1)">
        <el-icon><Minus /></el-icon>
      </li>
      <li @click="previewEventHandle(0)">
        <el-icon>
          <Close />
        </el-icon>
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
.title {
  user-select: none;
  .versionInfo {
    font-size: 12px;
    height: 20px;
  }
  .dragArea {
    flex: 1;
    -webkit-app-region: drag;
    min-width: 200px;
    color: @text-color;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  :deep(.el-dialog) {
    border-radius: 10px;
    width: 100%;
    min-width: 400px;
    max-width: 500px;
    .el-dialog__body {
      padding: 20px 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .secLogo {
        width: 100%;
        max-width: 300px;
      }
    }
    .el-dialog__footer {
      .closeBtn {
        @primary-btn-style();
      }
    }
  }
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: space-between;
  .headerMenus {
    background: transparent;
    border-bottom: none;
    .el-sub-menu {
      user-select: none;
      &.is-opened {
        :deep(.el-sub-menu__title) {
          background-color: @text-color;
          color: @Header;
        }
      }
      :deep(.el-sub-menu__title) {
        font-weight: 400;
        padding: 0px 10px;
        border-bottom: none;
        color: @text-color;
        line-height: 30px;
        &:hover {
          background-color: @text-color;
          color: @Header;
        }
        .el-sub-menu__icon-arrow {
          display: none !important;
        }
      }
    }
  }
  .logo {
    height: 100%;
    box-sizing: border-box;
    padding: 6px 10px;
  }
  .btns {
    @format();
    margin: 0;
    padding: 0;
    height: 100%;
    li {
      width: 50px;
      @format();
      height: 100%;
      font-size: 15px;
      list-style: none;
      color: @text-color;
      transition: all 0.3s ease;
    }
  }
}
</style>