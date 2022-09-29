<script setup>
import { watch } from "vue";
const props = defineProps({
  value: String,
  keyword: String,
});
watch(props.keyword, (newValue, oldValue) => {
  console.log(newValue);
});
</script>

<template>
  <div class="fileTitle">
    {{ props.value }}
  </div>
</template>

<style lang="less" scoped>
.fileTitle {
  user-select: none;
  text-align: center;
  width: 100%;
  height: 100%;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>