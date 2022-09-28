<script setup>
import { Edit, Share, Delete } from "@element-plus/icons-vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { pathFunc, checkType } from "@/utils";
import electron from "electron";
import { reactive, ref } from "vue";
import suffix from "@/utils/dictionary.json";
const { Menu } = require("electron");
const router = useRouter();
const store = useStore();
const props = defineProps({
  cdn: String,
  path: String,
  cos: Object,
});
const pics = reactive([]);
const fs = require("fs");
const init = ref(true);
const parent = pathFunc(props.path);
const index = ref(0);
props.cos.getBucket(
  {
    Bucket: store.state.cloud.Bucket,
    Region: store.state.cloud.Region,
    Delimiter: "/",
    Prefix: parent,
  },
  function (err, data) {
    if (data.Contents.length > 1) {
      data.Contents.shift();
    }
    data.Contents.forEach((item) => {
      if (checkType(item.Key) === "picture") {
        pics.push(item.Key);
      }
    });
    index.value = pics.indexOf(props.path);
    init.value = false;
  }
);

console.log("picture:path-", props.path);
const changeQuery = (path) => {
  router.replace({
    query: {
      path: path,
    },
  });
};
const next = () => {
  if (index.value + 1 >= pics.length) {
    index.value = 0;
  } else {
    index.value += 1;
    changeQuery(pics[index.value]);
  }
};
const pre = () => {
  if (index.value - 1 < 0) {
    index.value = pics.length - 1;
  } else {
    index.value -= 1;
    changeQuery(pics[index.value]);
  }
};
const rightClick = (path) => {
  const remote = require("@electron/remote");
  const { Menu, MenuItem, clipboard, nativeImage } = remote;

  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: "复制CDN地址",
      click: function () {
        electron.clipboard.writeText(props.cdn + path);
      },
    })
  );
  menu.append(
    new MenuItem({
      label: "复制图片",
      click: function () {
        const image = nativeImage.createFromPath(props.cdn + path);
        clipboard.writeImage(image);
      },
    })
  );
  menu.popup(remote.getCurrentWindow());
};
</script>

<template>
  <div
    class="previewContent"
    v-loading="init"
    element-loading-background="transparent"
  >
    <div class="pre" v-show="!init" @click="pre">
      <el-icon><ArrowLeft /></el-icon>
    </div>
    <div class="main" v-show="!init">
      <el-container class="pictureContainer">
        <el-main class="pictureMain">
          <el-image
            :src="pics[index] ? cdn + pics[index] : ''"
            alt=""
            class="picture"
            :fit="'contain'"
            @contextmenu="rightClick(pics[index])"
          >
            <template #placeholder>
              <div class="image-slot">
                <span></span><span></span><span></span><span></span
                ><span></span>
              </div>
            </template>
          </el-image>
        </el-main>
        <el-footer>
          <div class="pictureBtns">
            <el-button-group class="ml-4 pictureBtnGroup">
              <el-button type="primary" :icon="Edit" class="btn" />
              <el-button type="primary" :icon="Share" class="btn" />
              <el-button type="primary" :icon="Delete" class="btn" />
            </el-button-group>
          </div>
        </el-footer>
      </el-container>
    </div>
    <div class="next" v-show="!init" @click="next">
      <el-icon><ArrowRight /></el-icon>
    </div>
  </div>
</template>

<style lang='less'>
@nextAndPre: 40px;
.previewContent {
  width: 100%;
  height: 100%;
  background-color: @text-color;
  display: flex;
  .pre {
    width: @nextAndPre;
    @format();
    cursor: pointer;
  }
  .next {
    width: @nextAndPre;
    @format();
    cursor: pointer;
  }
  .main {
    width: calc(100% - @nextAndPre * 2);
    height: 100%;
    overflow: auto;
    position: relative;
    .pictureContainer {
      height: 100%;
      width: 100%;
      position: relative;
      .pictureMain {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px 0px;
        .picture {
          height: 100%;
          width: 100%;
          user-select: none;
          display: flex;
          justify-content: center;
          align-items: center;
          .image-slot {
            position: relative;
            span {
              display: block;
              bottom: 0px;
              width: 9px;
              height: 5px;
              background: #9b59b6;
              position: absolute;
              animation: loading 1.5s infinite ease-in-out;
            }
            span:nth-child(2) {
              left: 11px;
              animation-delay: 0.2s;
            }
            span:nth-child(3) {
              left: 22px;
              animation-delay: 0.4s;
            }
            span:nth-child(4) {
              left: 33px;
              animation-delay: 0.6s;
            }
            span:nth-child(5) {
              left: 44px;
              animation-delay: 0.8s;
            }
            @keyframes loading {
              0% {
                height: 5px;
                transform: translateY(0px);
                background: #9b59b6;
              }
              25% {
                height: 30px;
                transform: translateY(15px);
                background: #3498db;
              }
              50% {
                height: 5px;
                transform: translateY(0px);
                background: #9b59b6;
              }
              100% {
                height: 5px;
                transform: translateY(0px);
                background: #9b59b6;
              }
            }
          }
        }
      }
      .pictureBtns {
        flex: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;

        .pictureBtnGroup {
          .btn {
            padding: 15px 25px;
            background: fade(gray, 20%);
            border: none;
            transition: all 0.5s ease;
            &:hover {
              background: fade(gray, 50%);
            }
          }
        }
      }
    }
  }
}
</style>