import {
  createStore
} from 'vuex'
import {
  ElMessage
} from 'element-plus'
import {
  h
} from 'vue'

const store = createStore({
  state: {
    windows: {
      maximize: false,
      id:null,
    },
    cloud: {
      cdn: 'https://cdn.lili-secretbase.com/',
      SecretId: "AKIDBBvObXCbkdFaeSzFFyRdXBYeT0IK6csr",
      SecretKey: "jCPL0TfbGeka9RSDhuqVu3vWrvhCRQ6V",
      Bucket: "kuv-1301167097",
      Region: "ap-nanjing",
      url: '',
      urlSplit: [],
      doneList:[],
      failList:[],
      _Queue: [],
    },

  },
  getters: {},
  mutations: {
    addTask(state,item) {
      let list = [...state.cloud._Queue];
      list.push(item)
      state.cloud._Queue = list
    },
    setMainWindowId(state,id) {
      state.windows.id = id
    },
    minimizeOrMaximize(state, max) {
      state.windows.maximize = max
    },
    changeURL(state, url) {
      state.cloud.url = url
      let urlSplitArray = []
      let completeUrl = ''
      for (let item of url.split('/').slice(0, -1)) {
        completeUrl += item + '/'
        urlSplitArray.push({
          name: item,
          completeUrl: completeUrl
        })
      }
      store.state.cloud.urlSplit = urlSplitArray
    }
  },
  actions: {},
  modules: {}
})
export default store