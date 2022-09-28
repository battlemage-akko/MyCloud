<script lang="ts" setup>
import { defineExpose, ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  Cloudy,
} from "@element-plus/icons-vue";
import { indexOf } from "lodash";
const router = useRouter();
const defaultAcitve = ref("default")
let navs = [
  { path: "/home/default", text: "default", icon: "Menu", active: false },
  { path: "/home/cloud/repo", text: "cdn", icon: "Cloudy", active: false },
  { path: "/home/download", text: "download", icon: "Download", active: false }
];
watch(
  () => router.currentRoute.value.path,
  (toPath) => {
    for (let index of navs) {
      if (toPath.match(new RegExp(`^${index.path}.*$`))) {
        defaultAcitve.value = index.path
      }
    }
  },
  { immediate: true, deep: true }
);
const props = defineProps<{
  isCollapse: boolean;
}>();
</script>


<template>
  <el-menu
    :default-active="defaultAcitve"
    class="menu"
    :collapse="!props.isCollapse"
    :collapse-transition="true"
    router
  >
    <el-menu-item
      v-for="item in navs"
      :index="item.path"
      :key="item.path"
      :class="item.active ? 'is-active' : ''"
    >
      <el-icon>
        <component :is="item.icon" height="25" width="25" />
      </el-icon>
      <span>{{ item.text }}</span>
    </el-menu-item>
  </el-menu>
</template>

<style lang="less" scoped>
.menu {
  background-color: transparent;
  border-right: 0;
  user-select: none;
  .el-menu-item {
    color: @text-color;
    justify-content: left;
    transition: all 0.2s ease;
    padding: 0px !important;
    height: 60px;
    font-weight: 550;
    font-size: 16px;
    position: relative;
    &:hover {
      background-color: @AsideMenu-button-hover;
      color: white;
    }
    &.is-active {
      &::after {
        content: "";
        width: 4px;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: @text-color;
      }
    }
    .el-icon {
      width: 64px;
      margin: 0px;
    }
  }
}
</style>