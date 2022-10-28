const path = require('path');
const fs = require('fs')
const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron');
const isDev = process.env.IS_DEV == 'true' ? true : false;
// const remote = require('electron');
const Remote = require("@electron/remote/main");
const { map } = require('lodash');
const { config } = require('process');
Remote.initialize();
const host = 'http://localhost:3000'

const BrowserWindowsMap = new Map()
let mainWindow
const iconName = path.join(__dirname, 'flower.png');

function openNewWindows(url,path_name,config) {
    if (BrowserWindowsMap.has(path_name)) {
      BrowserWindowsMap.get(path_name).focus() // 存在 则聚焦
      return
    }
    const newWin = new BrowserWindow(config)
    newWin.loadURL(url)
    Remote.enable(newWin.webContents);
 // 此处写 你要打开的路由地址
    newWin.once('ready-to-show', () => {
      newWin.show();
    })
    newWin.on('close', () => {
      BrowserWindowsMap?.delete(path_name)
    })
    BrowserWindowsMap.set(path_name, newWin)
    console.log(BrowserWindowsMap)
}
function createWindow() {
  const config = {
    width: 1100,
    height: 750,
    minWidth: 1000,
    minHeight: 750,
    frame: false,
    resizable: true,
    icon: iconName,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: true, // 是否集成 Nodejs
      contextIsolation: false,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      // 关闭同源策略 解决跨域
      webSecurity: true,
      webviewTag: true
    },
    show: false,
  }
  // Create the browser window.
  mainWindow = new BrowserWindow(config);
  Remote.enable(mainWindow.webContents);
  // require('@electron/remote/main').initialize()
  // require("@electron/remote/main").enable(mainWindow.webContents)
  // and load the index.html of the app.
  // win.loadFile("index.html");
  mainWindow.loadURL(
    isDev ?
    'http://localhost:3000':
    // `file://${path.join(__dirname, '../dist/index.html')}`
    'http://localhost:3000' 
  );
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  })
  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  ipcMain.on('window-close', function () {
    BrowserWindowsMap.forEach((val,key)=> {
      val.close();
    })
    mainWindow.close();
  })
  ipcMain.on('window-min', function () {
    mainWindow.minimize('');
  })
  ipcMain.on('isMaximized', function (event, data) {
    event.returnValue = mainWindow.isMaximized();
  })
  ipcMain.on('ondragstart', (event, filePath) => {
    console.log(filePath)
    event.sender.startDrag({
      file: path.join(__dirname, filePath),
      icon: iconName,
    })
  })
  ipcMain.on('window-max', function () {
    if (mainWindow.isMaximized()) { // 为true表示窗口已最大化
      mainWindow.restore(); // 将窗口恢复为之前的状态.
    } else {
      mainWindow.maximize();
    }
  })
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('winIsMaximized', true);
  })
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('winIsMaximized', false);
  })
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  ipcMain.on('preview', function (event, data) {
    const url = host + '/preview/file/'+ JSON.parse(data).type +'?path=' + JSON.parse(data).path
    const config = {
      maxHeight:1080,
      maxWidth:1920,
      minWidth: 800,
      minHeight: 600,
      frame: false, //是否显示边缘框
      fullscreen: false, //是否全屏显示
      autoHideMenuBar: true,
      webPreferences: {
        // preload: path.join(__dirname, 'preload.cjs'),
        nodeIntegration: true, // 是否集成 Nodejs
        contextIsolation: false,
        nodeIntegrationInWorker: true,
        enableRemoteModule: true,
        // 关闭同源策略 解决跨域
        webSecurity: true,
        webviewTag: true
      },
      show: false,
    }
    openNewWindows(url,JSON.parse(data).path,config)
  })
  ipcMain.on('assistantWindowEvent', function (event, data) {
    data = JSON.parse(data)
    console.log(data)
    switch (data.type) {
      case 0: //关闭窗口
        BrowserWindowsMap.get(data.id).close()
        break;
      case 1: //隐藏窗口
        BrowserWindowsMap.get(data.id).minimize('')
        break;
      case 2: //最大化最小化
        if (BrowserWindowsMap.get(data.id).isMaximized()) { 
          BrowserWindowsMap.get(data.id).restore(); 
        } else {
          BrowserWindowsMap.get(data.id).maximize();
        }
        break;
      default:
        break;
    }
  })
  ipcMain.on('uploadOrDownload',function (event,data) { 
    const path = '/' + JSON.parse(data).path 
    const mainWindowId = JSON.parse(data).mainWindowId
    const url = host + '/' + 'upload?path=' + path + '&mainWindowId=' + mainWindowId
    const config = {
      maxHeight:600,
      maxWidth:500,
      height:500,
      width:400,
      minWidth: 400,
      minHeight: 500,
      frame: false, //是否显示边缘框
      fullscreen: false, //是否全屏显示
      autoHideMenuBar: true,
      webPreferences: {
        // preload: path.join(__dirname, 'preload.cjs'),
        nodeIntegration: true, // 是否集成 Nodejs
        contextIsolation: false,
        nodeIntegrationInWorker: true,
        enableRemoteModule: true,
        // 关闭同源策略 解决跨域
        webSecurity: true,
        webviewTag: true
      },
      show: false,
    }
    openNewWindows(url, JSON.parse(data).behavior + '_' + path, config)
   })
  ipcMain.on('closeSubWindow',function (event, data) {
    console.log(data)
  })
  ipcMain.on("electron", function (event, data) {
    switch (JSON.parse(data).command) {
      case "isMaximized":
        event.returnValue = 'app.isMaximized()';
        break;
      case "version":
        event.returnValue = JSON.stringify({
          node: process.versions.node,
          chrome: process.versions.chrome,
          electron: process.versions.electron,
        })
        break;
    }
  })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});