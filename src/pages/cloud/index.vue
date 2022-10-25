<script setup>
import Bread from "@/pages/cloud/components/bread.vue";
import FileDirectory from "@/pages/cloud/components/fileDirectory.vue";
import { onMounted, watch, reactive, ref, nextTick } from "vue";
import { useStore } from "vuex";
import suffix from "@/utils/dictionary.json";
import { useRouter, useRoute } from "vue-router";
import { checkType } from "@/utils";
// import request from "request";
// import * as COS  from "cos-nodejs-sdk-v5"
const router = useRouter();
const route = useRoute();
const files = reactive({});
const fileInfo = ref('')
const loading = ref(true);
const createDirVisible = ref(false);
const store = useStore();
const props = defineProps({
  cos: Object,
});
const dirForm = reactive({
  name: "",
});
// console.log("router:", router.currentRoute.value);

props.cos.getService(function (err, data) {});
const formatUrl = (url, path) => {
  return replace(url.replace(path, ""));
};
onMounted(() => {
  if (route.query.hasOwnProperty("path")) {
    enterDir(route.query.path);
  } else {
    enterDir(store.state.cloud.url);
  }
});
const filesFormat = (datas, url) => {
  for (let item of datas) {
    if (item.hasOwnProperty("Key")) {
      files[item.Key] = item;
    } else if (item.hasOwnProperty("Prefix")) {
      item.children = [];
      files[item.Prefix] = item;
    }
    item.chosen = false;
  }
};
const getFilesByType = async (url) => {
  //获取所有文件，可传入排序方法
  props.cos.getBucket(
    {
      Bucket: store.state.cloud.Bucket,
      Region: store.state.cloud.Region,
      Delimiter: "/",
      Prefix: url,
    },
    await function (err, data) {}
  );
};
const getFiles = async (url) => {
  //获取所有文件与文件夹,按照默认排序
  Object.keys(files).map((key) => {
    delete files[key];
  });
  props.cos.getBucket(
    {
      Bucket: store.state.cloud.Bucket,
      Region: store.state.cloud.Region,
      Delimiter: "/",
      Prefix: store.state.cloud.url,
    },
    await function (err, data) {
      let back = false;
      let dirs = data?.CommonPrefixes;
      for (let item of dirs) {
        item.type = "dir";
        item.url = item.Prefix;
        item.name = item.Prefix.replace(url, "");
      }
      let allfiles = data.Contents;
      for (let item of allfiles) {
        if (item.Key == url) {
          item.type = "back";
          item.name = "back";
          back = true;
          continue;
        }
        // const index = item.Key.lastIndexOf(".");
        // const suffixName = item.Key.substr(index);
        item.url = item.Key;
        item.name = item.Key.replace(url, "");
        item.type = checkType(item.Key);
        // Object.keys(suffix).forEach((key) => {
        //   if(suffix[key].indexOf(suffixName) != -1){
        //     item.type = key;
        //   } // foo
        // })
      }
      if (back) {
        allfiles.shift();
      }
      filesFormat(dirs.concat(allfiles), url);
      loading.value = false;
    }
  );
};
const enterDir = (url) => {
  //进入任意目录
  loading.value = true;
  fileInfo.value = ''
  router.replace({
    query: {
      path: url,
    },
  });
  store.commit("changeURL", url);
  getFiles(url);
};
const createDir = () => {
  props.cos.putObject(
    {
      Bucket: store.state.cloud.Bucket,
      Region: store.state.cloud.Region,
      Key: store.state.cloud.url + dirForm.name + '/',
      Body: '',
    },
    function (err, data) {
      console.log(err || data);
      refresh()
    }
  );
  createDirHandler(false,true)
};
const deleteObj = (url) => {
  props.cos.deleteObject(
    {
      Bucket: store.state.cloud.Bucket,
      Region: store.state.cloud.Region,
      Key: url,
    },
    function (err, data) {
      console.log(err || data);
      refresh()
    }
  );
}
const getFileInfo = (info) => {
  fileInfo.value = info
}
const backDir = () => {
  //回到上层目录
  if (store.state.cloud.urlSplit.length > 1) {
    enterDir(
      store.state.cloud.urlSplit[store.state.cloud.urlSplit.length - 2]
        .completeUrl
    );
  } else {
    enterDir("");
  }
};
const refresh = () => {
  loading.value = true;
  getFiles(store.state.cloud.url);
  loading.value = false;
};
const createDirHandler = (state,hasReturn) => {
  createDirVisible.value = state
}
watch(router, (newValue, oldValue) => {
  if (router.query.hasOwnProperty("path")) {
    enterDir(router.query.path);
  }
});
</script>

<template>
  <el-container>
    <el-header class="SecondaryHeader">
      <div class="bread">
        <Bread @enterDir="enterDir" @refresh="refresh" :router="router" />
      </div>
    </el-header>
    <el-main class="Main">
      <FileDirectory
        :fileTree="files"
        :loading="loading"
        @getFileInfo="getFileInfo"
        @createDirHandler="createDirHandler"
        @backDir="backDir"
        @enterDir="enterDir"
        @deleteObj="deleteObj"
      />
    </el-main>
    <el-footer class="Footer">
      <div>
        共有
        <span v-show="!loading">{{ Object.keys(files).length }}</span>
        <span v-show="loading">..</span>
        项
      </div>
      <div>
        <span v-if="fileInfo">
          {{fileInfo}}
        </span>
      </div>
    </el-footer>
  </el-container>
  <el-dialog v-model="createDirVisible" title="新建文件夹" :show-close="false" :align-center="true" width="40%" style="max-width: 400px;">
    <el-form :model="dirForm">
      <el-form-item label="文件夹名称：" :label-width="formLabelWidth">
          <el-input v-model="dirForm.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="createDirBtns">
        <el-button @click="createDirHandler(false,false)">取消</el-button>
        <el-button type="primary" @click="createDir()" class="btns"
          >保存</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
.SecondaryHeader {
  display: flex;
  height: 70px;
  margin: 20px;
  margin-bottom: 0px;
  flex-direction: column;
  padding: 0px;
  .bread {
    height: 50px;
    width: 100%;
    border-bottom: 1px solid fade(@color2, 25%);
    @format();
    background: white;
  }
}
.Main {
  @format();
  padding: 0px 20px;
}
.Footer {
  @format();
  user-select: none;
  margin: 20px;
  margin-top: 0px;
  border-top: 1px solid fade(@color2, 25%);
  background-color: white;
  justify-content: space-between;
  font-size: 15px;
}
.createDirBtns{
  .btns {
    @primary-btn-style()
  }
}
</style>