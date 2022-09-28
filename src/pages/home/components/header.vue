<script setup>
import { ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useStore } from "vuex";
import electron from "electron";
const store = useStore();
const dialogVisible = ref(false);
const isMaximized = ref(false);
electron.ipcRenderer.on("winIsMaximized", (event, arg) => {
  isMaximized.value = arg;
});
const handleCloseWindows = () => {
  electron.ipcRenderer.send("window-close");
};
const handleMin = () => {
  electron.ipcRenderer.send("window-min");
};
const handleMax = () => {
  electron.ipcRenderer.send("window-max");
  checkMaximized();
};
const checkMaximized = () => {
  isMaximized.value = electron.ipcRenderer.sendSync("isMaximized");
};
const version = JSON.parse(
  electron.ipcRenderer.sendSync(
    "electron",
    JSON.stringify({
      command: "version",
    })
  )
);
watch(isMaximized, (newVal, oldVal) => {
  store.commit("minimizeOrMaximize",newVal)
});
</script>

<template>

  <div class="title">
    <div>
      <img src="@/assets/flower_white.png" alt="" class="logo" />
    </div>
    <el-menu
      class="headerMenus"
      mode="horizontal"
      :ellipsis="false"
    >
      <el-sub-menu index="0">
        <template #title>帮助</template>
        <el-menu-item @click="dialogVisible = true">关于</el-menu-item>
        <el-menu-item index="0-2">更新</el-menu-item>
        <!-- <el-menu-item index="2-2">item two</el-menu-item>
        <el-menu-item index="2-3">item three</el-menu-item> -->
        <!-- <el-sub-menu index="2-4">
          <template #title>item four</template>
          <el-menu-item index="2-4-1">item one</el-menu-item>
          <el-menu-item index="2-4-2">item two</el-menu-item>
          <el-menu-item index="2-4-3">item three</el-menu-item>
        </el-sub-menu> -->
      </el-sub-menu>
    </el-menu>
    <div class="dragArea" @click="checkMaximized"></div>
    <ul class="btns">
      <li @click="handleMin">
        <el-icon><Minus /></el-icon>
      </li>
      <li @click="handleMax">
        <el-icon v-if="isMaximized">
          <CopyDocument />
        </el-icon>
        <el-icon v-if="!isMaximized">
          <Crop />
        </el-icon>
      </li>
      <li @click="handleCloseWindows">
        <el-icon>
          <Close />
        </el-icon>
      </li>
    </ul>
    <el-dialog
      v-model="dialogVisible"
      width="30%"
      :show-close="false"
    >
      <span v-loading="loading">
        <img
          src="https://cdn.lili-secretbase.com/pic/logo.png"
          alt=""
          class="secLogo"
        />
      </span>
      <span style="margin: 20px 0px">
        <div v-for="(value, key) in version" :key="key" class="versionInfo">
          <span>{{ key }}版本: </span>
          <span>{{ value }}</span>
        </div>
      </span>
      <span style="font-size: 15px; font-weight: 500; margin-top: 10px">
        联系方式：421609385@qq.com
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="dialogVisible = false"
            class="closeBtn"
            >关闭</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.title {
  user-select:none;
  .versionInfo {
    font-size: 12px;
    height: 20px;
  }
  .dragArea {
    flex: 1;
    -webkit-app-region: drag;
    min-width: 200px;
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
      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    }
    li:last-child {
      &:hover {
        background-color: rgba(255, 0, 0, 0.7);
      }
    }
  }
}
</style>