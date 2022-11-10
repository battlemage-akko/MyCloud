<script setup>
import { reactive, watch, ref, onMounted } from "vue";
import {
  Search,
  FolderAdd,
  Download,
  Picture,
  VideoPlay,
  Folder,
  Back,
  QuestionFilled,
  Upload,
} from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import electron from "electron";
import { useStore } from "vuex";
import { bytesToSize } from "@/utils";
const remote = require("@electron/remote");
const { Menu, MenuItem, clipboard, nativeImage } = remote;
const store = useStore();
const route = useRoute();
const emit = defineEmits();
const props = defineProps({
  //子组件接收父组件传递过来的值
  fileTree: Array,
  loading: Boolean,
  createDirVisible: Boolean,
  fileInfo: String,
});
// console.log(props.fileTree)
const chosenFiles = reactive([]);
const filteredFiles = reactive([]);
const chooseAll = ref(false);
const keyword = ref(null);
const icon = {
  picture: "Picture",
  dir: "Folder",
  video: "VideoPlay",
  back: "Back",
  doc: "Document",
  other: "QuestionFilled",
};
onMounted(() => {});
const rightClick = (item) => {
  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: "删除",
      click: function () {
        deleteObj(item.url);
      },
    })
  );
  if (item.type !== "dir") {
    menu.append(
      new MenuItem({
        label: "复制CDN链接",
        click: function () {
          electron.clipboard.writeText(store.state.cloud.cdn + item.url);
        },
      })
    );
  }
  menu.popup(remote.getCurrentWindow());
};
const chooseThis = (event, itemName) => {
  event.cancelBubble = true;
  chosenFiles.length = 0;
  changeAllChosen(false);
  chosenFiles.push(store.state.cloud.url + itemName);
};
const changeAllChosen = (choice) => {
  for (const name in props.fileTree) {
    props.fileTree[name].chosen = choice;
  }
  if (choice) {
    chosenFiles.length = 0;
    for (const name in props.fileTree) {
      chosenFiles.push(name);
    }
  } else {
    chosenFiles.length = 0;
    chooseAll.value = false;
  }
};
const createDirHandler = (state, hasReturn) => {
  emit("createDirHandler", [state, hasReturn]);
};
const deleteObj = (url) => {
  emit("deleteObj", url);
};
const getFileInfo = (info) => {
  emit("getFileInfo", info);
};
const uploadCalling = () => {
  electron.ipcRenderer.send(
    "uploadOrDownload",
    JSON.stringify({
      path: store.state.cloud.url,
      behavior: "upload",
      mainWindowId: store.state.windows.id,
    })
  );
};
const dblclickHandle = (item) => {
  if (item.type == "dir") {
    emit("enterDir", item.url);
    filteredFiles.length = 0;
    keyword.value = null;
  } else if (item.type == "other") {
    return;
  } else if (item.type == "back") {
    emit("backDir");
  }
  if (item.type === "picture") {
    electron.ipcRenderer.send(
      "preview",
      JSON.stringify({
        path: store.state.cloud.url + item.name,
        type: "picture",
      })
    );
  }
};
const dragHandler = (event, item) => {
  event.preventDefault();
  electron.ipcRenderer.send("ondragstart", store.state.cloud.cdn + item.url);
};
watch(keyword, (newValue, oldValue) => {
  filteredFiles.length = 0;
  if (!newValue) {
    filteredFiles.length = 0;
  } else {
    Object.keys(props.fileTree).forEach((key) => {
      if (props.fileTree[key].name.includes(newValue)) {
        filteredFiles.push(props.fileTree[key]);
      }
    });
  }
  console.log(filteredFiles);
});
watch(chosenFiles, (newValue, oldValue) => {
  if (newValue) {
    if (newValue.length > 1) {
      getFileInfo("已选中 " + newValue.length + " 项目");
    } else if (newValue.length === 1) {
      if (props.fileTree[newValue[0]]?.type === "dir") {
        // console.log(props.fileTree[newValue[0]])
      } else {
        getFileInfo(
          "文件大小：" +
            bytesToSize(parseInt(props.fileTree[newValue[0]]?.Size))
        );
      }
    } else {
      getFileInfo("");
    }
  } else {
    getFileInfo("");
  }
  for (const item of newValue) {
    if (props.fileTree[item]) {
      props.fileTree[item].chosen = true;
    }
  }
});
// watch(props.fileTree, (newValue, oldValue) => {
// });
watch(chooseAll, (newValue, oldValue) => {
  if (newValue === true) {
    changeAllChosen(true);
  } else if (newValue === false) {
    changeAllChosen(false);
  }
});
</script>

<template>
  <div id="container">
    <div class="btns">
      <div style="display: flex; align-items: center; height: 50px">
        <el-input
          v-model="keyword"
          placeholder="Please input"
          :suffix-icon="Search"
          style="margin: 10px"
        />
        <el-checkbox v-model="chooseAll" label="全选" size="large" />
      </div>
      <div
        style="display: flex; flex-wrap: nowrap; overflow: hidden; height: 50px"
      >
        <el-button
          color="#352F44"
          style="margin: 10px 5px"
          :icon="Download"
          :disabled="chosenFiles.length <= 0"
          >下载</el-button
        >
        <el-button
          color="#352F44"
          style="margin: 10px 5px"
          :icon="Upload"
          :disabled="loading"
          @click="uploadCalling()"
          >上传</el-button
        >
        <el-button
          color="#352F44"
          style="margin: 10px 5px"
          :icon="FolderAdd"
          @click="createDirHandler(true, false)"
          :disabled="loading"
          >新建文件夹</el-button
        >
      </div>
    </div>
    <el-row
      :gutter="0"
      class="fileHolder"
      @click="changeAllChosen(false)"
      v-loading="props.loading"
    >
      <el-col
        :span="2"
        v-for="(item, index) in filteredFiles.length === 0
          ? props.fileTree
          : filteredFiles"
        :key="index"
        :xs="8"
        :sm="6"
        :md="4"
        :lg="3"
        :xl="2"
        style="{height: 160px;}"
        align="center"
        @contextmenu="rightClick(item)"
      >
        <el-card
          :body-style="{ padding: '0px' }"
          draggable="true"
          class="fileCard"
          @click="chooseThis($event, item.name)"
          @dblclick="dblclickHandle(item)"
          @dragstart="dragHandler($event, item)"
          :style="item.chosen ? 'background:rgba(53, 47, 68, .15)' : ''"
          :title="item.name"
        >
          <div
            class="image"
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              color: @Header;
            "
          >
            <component :is="icon[item.type]" height="70" width="70" />
          </div>
          <!-- <el-image
          v-if="item.type == 'picture'"
          :src="
            'https://kuv-1301167097.cos.ap-nanjing.myqcloud.com/' + item.name
          "
          class="image"
        /> -->
          <div class="fileTitleHolder">
            <!-- <fileTitle :value="item.name" :keyword="keyword" /> -->
            <div
              class="fileTitle"
              v-html="
                keyword
                  ? item.name.replace(
                      new RegExp(keyword),
                      `<span style='margin:0px 1px;border:1px solid #635666;padding:2px;border-radius:3px;background:rgba(53, 47, 68, .2)'>` +
                        keyword +
                        `</span>`
                    )
                  : `<span>` + item.name + `</span>`
              "
            ></div>
          </div> </el-card
      ></el-col>
    </el-row>
  </div>
</template>

<style lang='less' scoped>
#container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .btns {
    // min-height: 50px;
    // max-height: 100px;
    width: 100%;
    display: flex;
    background: white;
    border-bottom: 1px solid fade(@color2, 25%);
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  .fileHolder {
    width: 100%;
    height: 100%;
    padding: 15px 5px;
    overflow: auto;
    background: white;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      background: #535353;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      border-radius: 10px;
      background: #ededed;
    }
    .el-col {
      max-height: 170px;
      .fileCard {
        cursor: pointer;
        flex: 1;
        box-shadow: none;
        border: none;
        padding: 10px;
        margin-bottom: 20px;
        width: 100px;
        height: 130px;
        background: transparent;
        &:hover {
          background: fade(@color2, 10%);
        }
        .image {
          width: 100px;
          height: 100px;
        }
        .fileTitleHolder {
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
        }
      }
    }
  }
}
</style>