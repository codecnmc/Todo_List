/*
 * @Author: 羊驼
 * @Date: 2024-01-02 11:46:26
 * @LastEditors: 羊驼
 * @LastEditTime: 2024-04-18 14:53:16
 * @Description: file content
 */

if (process.env.NODE_ENV !== "development") {
  global.__static = require("path").join(__dirname, "/static").replace(/\\/g, "\\\\");
}

const { app, BrowserWindow, Menu } = require("electron");
const { ListenerManager } = require("./listener");

const path = require("path");
const createWindow = () => {
  Menu.setApplicationMenu(null); // null值取消顶部菜单栏
  const win = new BrowserWindow({
    transparent: false,
    // resizable: false,
    width: 400,
    height: 700,
    minHeight: 700,
    minWidth: 400,
    // resizable: false,
    title: "Todo List",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    frame: false, // 去掉顶部操作栏
  });
  const winURL = process.env.NODE_ENV === "development" ? `http://localhost:9080` : `file://${__dirname}/index.html`;

  // 后续可打包放在本地也可以 使用在线的地址
  win.loadURL(winURL);
  // win.loadURL('http://microfluidics.szpxwd.cn/')

  return win;
};

app.on("ready", () => {
  const window = createWindow();
  new ListenerManager(app, window);
  if (!app.isPackaged) {
    // 如果不打包，默认开启开发模式，开发者模式控制台
    window.webContents.openDevTools({ mode: "detach" });
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
