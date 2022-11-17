import {
  createRouter,
  createWebHistory,
  createWebHashHistory
} from 'vue-router'
import Home from '@/pages/home/index.vue'
import Default from '@/pages/default/index.vue'
import Cloud from '@/pages/cloud/index.vue'
import Preview from '@/pages/utils/previewWindow/index.vue'
import Download from '@/pages/download/index.vue'
import Spider from '@/pages/spider/index.vue'
import UploadWindow from '@/pages/utils/uploadWindow/index.vue'
import DownloadWindow from '@/pages/utils/downloadWindow/index.vue'
const routes = [
  {
    path:'/',
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: Home,
        redirect: '/home/default',
        children: [{
            path: 'default',
            name: 'default',
            component: Default,
          },
          {
            path: 'cloud/:url',
            name: 'Cloud ',
            component: Cloud,
          },
          {
            path: 'download',
            name: 'download',
            component: Download,
          },
          {
            path: 'spider',
            name: 'spider',
            component: Spider,
          },
        ]
      },
    ]
  },
  {
    path: '/preview',
    name: 'preview',
    redirect: 'previewFile',
    children: [{
      path: 'file/:type',
      name: 'previewFile',
      component: Preview,
    }]
  },
  {
    path: '/upload',
    name: 'upload',
    component: UploadWindow,
  },
  {
    path: '/download',
    name: 'downloadWindow',
    component: DownloadWindow,
  },
]

export default createRouter({
  history: createWebHistory(),
  mode:'history',
  routes
})