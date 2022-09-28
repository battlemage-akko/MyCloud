<template>
  <div id="setting">
    <el-dialog
      v-model="settingVisible"
      width="30%"
      :before-close="handleClose"
      :show-close="false"
      custom-class="settingContainer"
      destroy-on-close
    >
      <template #header>
        <el-icon><Tools /></el-icon>
        <span style="margin-left: 5px">设置</span>
      </template>
      <span>
        <Content />
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleClose" class="saveBtn"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, toRefs } from "vue";
import { ElMessageBox } from "element-plus";
import Content from "@/components/settingContent.vue";
const emit = defineEmits(["handleSettingClose"]);
const props = defineProps({
  //子组件接收父组件传递过来的值
  settingVisible: Boolean,
});

const { settingVisible } = toRefs(props);

const handleClose = () => {
  emit("handleSettingClose");
};
</script>
<style scope lang="less">
#setting {
  .el-overlay {
    .settingContainer {
      @dialog();
      min-width: 500px;
      .el-dialog__header {
        padding: 15px;
        @format();
        justify-content: left;
        font-size: 18px;
        color: @Header;
      }
      .el-dialog__body {
        padding: 0;
        border: 1px solid #7f52835b;
        border-left: none;
        border-right: none;
      }
      .el-dialog__footer {
        padding: 15px;
        .saveBtn {
          @primary-btn-style();
        }
      }
    }
  }
}
</style>