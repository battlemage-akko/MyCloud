<script setup>
import { computed, watch } from "vue";
import { useStore } from "vuex";
const store = useStore();
const emit = defineEmits();
const backHome = () => {
  emit("enterDir", "");
};
const refresh = () => {
  emit("refresh");
};
const enterDir = (path) => {
  if (path === store.state.cloud.url) {
    return
  }
  emit("enterDir",path)
}
const props = defineProps({
  //子组件接收父组件传递过来的值
  router: Object,
});
</script>

<template>
  <div id="bread">
    <ul class="btns">
      <li @click="refresh()">
        <el-icon><RefreshRight /></el-icon>
      </li>
      <li @click="backHome" v-if="store.state.cloud.url.length > 0">
        <el-icon><HomeFilled /></el-icon>
      </li>
    </ul>
    <div class="route">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          @click="enterDir('')"
          >Home</el-breadcrumb-item
        >
        <el-breadcrumb-item
          v-for="item in store.state.cloud.urlSplit"
          :key="item.completeUrl"
          @click="enterDir(item.completeUrl)"
          >{{ item.name }}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <div>
      <ul class="btns show">
        <li>
          <el-icon><Menu /></el-icon>
        </li>
        <li>
          <el-icon><Expand /></el-icon>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang='less' scoped>
#bread {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  .btns {
    padding: 0px;
    margin: 0px;
    display: flex;
    width: 100px;
    li {
      color: @Header;
      width: 50px;
      height: 50px;
      list-style: none;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: all ease 0.5s;
      &:hover {
        color: fade(@Header, 30%);
      }
    }
  }
  .show {
    width: 70px;

    li:first-child {
      border-right: 1px solid rgba(0, 0, 0, 0.5);
    }
    li {
      height: 25px;
      font-size: 16px;
    }
  }
  .route {
    user-select: none;
    cursor: pointer;
  }
}
</style>