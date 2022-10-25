<script setup>
import { watch, ref } from "vue";
const props = defineProps({
  value: String,
  keyword: String,
});
const title = ref(props.value);
</script>

<template>
  <div
    class="fileTitle"
    v-html="props.keyword?
      title.replace(
        new RegExp(props.keyword),
        `<span style='margin:0px 1px;border:1px solid #635666;padding:2px;border-radius:3px;background:rgba(53, 47, 68, .2)'>`+props.keyword+`</span>`
      ):`<span>`+title+`</span>`
    "
  ></div>
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
  .markWord {
    background-color: red;
  }
}
</style>