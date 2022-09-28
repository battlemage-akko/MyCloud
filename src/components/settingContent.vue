<script setup>
import { createApp, h, ref, watch, onMounted, reactive } from "vue";
import appSetting from "@/components/settingDetail/app.vue";
import Profile from "@/components/settingDetail/profile.vue";
const Option = ref("profile");
const settingComponents = reactive({
  profile: Profile,
  app: appSetting,
});
const switchOption = (myChoice) => {
  Option.value = myChoice;
};
const switchDetail = (myChoice) => {
  const rootDom = document.querySelector(".settingDetail");
  const app = createApp(h(settingComponents[myChoice]));
  app.mount(rootDom);
};
watch(Option, (newValue, oldValue) => {
  switchDetail(newValue);
});

onMounted(() => {
  switchDetail("profile");
});
</script>


<template>
  <el-container id="settingApp">
    <el-aside width="151px">
      <el-menu default-active="1" class="settingMenus">
        <el-menu-item index="1" @click="switchOption('profile')">
          <el-icon><UserFilled /></el-icon>
          <span>个人信息</span>
        </el-menu-item>
        <el-menu-item index="2" @click="switchOption('app')">
          <el-icon><document /></el-icon>
          <span>APP设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main class="settingDetail" :ref="detailDom"> </el-main>
  </el-container>
</template>

<style lang="less" scoped>
#settingApp {
  .settingMenus {
    user-select: none;
    width: 151px;
    height: 50vh;
    overflow: auto;
    .el-menu-item {
      width: 130px;
      padding: 0px 10px;
      position: relative;
      margin: 10px;
      border-radius: 5px;
      height: 40px;
      &.is-active {
        color: @text-color;
        background-color: @Header;
      }
      span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
        height: 100%;
      }
    }
  }
  .settingDetail {
    padding: 10px;
  }
}
</style>