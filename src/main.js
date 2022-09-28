import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus';
import * as ElIconModules from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
const app = createApp(App)

for(let iconName in ElIconModules){
    app.component(iconName,ElIconModules[iconName])
}

app.use(store).use(router).use(ElementPlus, { locale: zhCn }).mount('#app')