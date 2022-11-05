<script setup>
import { ref, watch } from "vue";
import { useStore } from "vuex";
import Progress from './components/progress.vue'

const activeIndex = ref("1");
const store = useStore();
const props = defineProps({
  cos: Object,
  _queue: Array,
});
const test = () => {
  console.log(store.state.cloud._Queue)
}
watch(store.state.cloud._Queue, (oldValue, newValue) => {
  console.log(store.state.cloud._Queue);
});
</script>

<template>
  <el-container class="container">
    <el-aside class="aside">
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        class="menu"
        :ellipsis="false"
        active-text-color="#484258"
      >
        <el-menu-item index="1" class="menu-item">已完成</el-menu-item>
        <el-menu-item index="2" class="menu-item">失败</el-menu-item>
      </el-menu>
    </el-aside>
    <el-main class="main">
      <Progress :_queue=props._queue />
    </el-main>
  </el-container>
</template>

<style lang='less' scoped>
.container {
  padding: 20px;
  .aside {
    width: 250px;
    background-color: white;
    border-right: 1px solid fade(@color2, 25%);
    max-width: 250px;
    .menu {
      width: 100%;
      position: relative;
      .menu-item {
        width: 50%;
        height: 45px;
        &:focus {
          background-color: transparent !important;
        }
        &:hover {
          color: #b8abdb;
          background-color: transparent !important;
        }
      }
    }
  }
  .main {
    width: 75%;
    background-color: white;
    padding: 0px;
  }
}
</style>