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
      id: null,
    },
    cloud: {
      cdn: 'https://cdn.lili-secretbase.com/',
      SecretId: "AKIDBBvObXCbkdFaeSzFFyRdXBYeT0IK6csr",
      SecretKey: "jCPL0TfbGeka9RSDhuqVu3vWrvhCRQ6V",
      Bucket: "kuv-1301167097",
      Region: "ap-nanjing",
      url: '',
      urlSplit: [],
      doneList: [],
      failList: [],
      uploadTotal: 0,
      uploadLoaded: 0,
      downloadTotal: 0,
    },

  },
  getters: {},
  mutations: {
    setMainWindowId(state, id) {
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
    },
    addUploadTotal(state,size){
      state.cloud.uploadTotal += size
    },
    reduceUploadTotal(state,size){
      state.cloud.uploadTotal -= size
    },
    addUploadLoaded (state,size){
      state.cloud.uploadLoaded += size
    },
    pushDoneList(state,item){
      state.cloud.doneList.push(item)
    }
  },
  actions: {},
  modules: {}
})
export default store