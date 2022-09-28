import {
  defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
// import requireTransform from 'vite-plugin-require-transform';

import electron from 'vite-plugin-electron'
import electronRender from 'vite-plugin-electron-renderer'

// import commonjsExternals from 'vite-plugin-commonjs-externals';
// import path from "path-browserify"
// import optimizer from "vite-plugin-optimizer";
let getReplacer = () => {
  let externalModels = ["electron", "os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"];
  let result = {};
  for (let item of externalModels) {
    result[item] = () => ({
      find: new RegExp(`^${item}$`),
      // import ${item} from '${item}';export { ${item} as default }
      // code: `const ${item} = require(['${item}'],function (${item}) {
      //   //foo is now loaded.
      // });export { ${item} as default }`,
      code: `const ${item} = require('${item}');export { ${item} as default }`,
      // replacement: `node_modules/.vite-plugin-optimizer/${item}.js`,
    });
  }
  return result;
};
export default defineConfig({
  plugins: [
    vue(),
    electron({
      main: {
        entry: "electron/electron.cjs"
      }
    }),electronRender()
    // requireTransform({
    //   fileRegex: /.js$|.vue$/
    // }),
    // optimizer(getReplacer()),
  ],
  build:{
    emptyOutDir: false,
  },
  base: process.env.ELECTRON == "true" ? './' : "",
  optimizeDeps: {
    include: ['axios'],
  },
  define: {
    'process.env': {
      'IS_DEV ': true
    }
  },
  resolve: {
    alias: {
      //别名配置
      "@": path.resolve(__dirname, "src"), //配置src的别名
    },
  },

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "${path.resolve(__dirname, 'src/style/global.less')}";`
      },
    },
  },

  server: {
    port: 3000,
    proxy: {
      '/api': { //此处/apis并不需要保持一致.
        // 测试环境
        target: 'http://localhost:8000', // 接口域名
        changeOrigin: true, //是否跨域
      }
    },
  },
})