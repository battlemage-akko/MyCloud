<script setup>
import Menu from "./components/asideMenu.vue";
import Title from "./components/header.vue";
import { test } from "@/service/api";
import Setting from "@/components/setting.vue";
import { ref } from "vue";
import isElectron from 'is-electron';
import { useStore } from "vuex";
const store = useStore();
const COS = require("cos-nodejs-sdk-v5");
const cos = new COS({
  SecretId: store.state.cloud.SecretId,
  SecretKey: store.state.cloud.SecretKey,
});
console.log(isElectron());
const isCollapse = ref(false);
const settingVisible = ref(false);
const handleSettingClose = () => {
  settingVisible.value = false
}
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
        <router-view :cos=cos />
      </el-container>
    </el-container>
    <el-container class="settingContainer">
      123
    </el-container>
    
      <Setting :settingVisible="settingVisible" @handleSettingClose="handleSettingClose"/>
    
  </div>
</template>

<style lang='less' scoped>

@title-height: 30px;
.PrimaryContainer {
  height: 100%;
  width: 100%;
  .settingContainer{
    width: 100%;
    height: calc(~"100% - @{title-height}");
    top: 30px;
    position: fixed;
    background: @Header;
    display:none;
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