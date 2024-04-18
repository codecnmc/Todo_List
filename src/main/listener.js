/*
 * @Author: 羊驼
 * @Date: 2022-01-25 11:30:52
 * @LastEditors: 羊驼
 * @LastEditTime: 2024-04-18 14:40:31
 * @Description: electron 监听定义类
 */

const process = require("process");
const { ipcMain } = require("electron");
class BaseListener {
  // 是否开启监听
  enable = true;
  // electron 存储的数据
  window = null;
  app = null;

  mounted = false;
  listener = {};
  handler = {};
  constructor(app, window, eventCollect, handlerCollect) {
    this.window = window;
    this.app = app;

    setTimeout(() => {
      try {
        if (this.enable) {
          let listener = this.listener;
          let handler = this.handler;
          for (let kv in listener) {
            eventCollect.push(kv);
            ipcMain.on(kv, listener[kv]);
          }
          for (let kv in handler) {
            handlerCollect.push(kv);
            ipcMain.handle(kv, handler[kv]);
          }
          this.mounted = true;
        }
      } catch (e) {
        console.log(`脚本初始化出现问题 原因:${e}`);
        // process.exit(1);
      }
    }, 100);
  }
}

class ListenerManager {
  listenerMap = new Map();
  listenerCollect = [];
  handlerCollect = [];
  constructor(app, window) {
    const fs = require("fs");
    let scripts = fs.readdirSync(__dirname + "\\listeners");
    scripts.forEach((item) => {
      item = item.replace(".js", "");
      let listener = require(`./listeners/${item}`);
      this.listenerMap.set(item, listener);
      try {
        let event = new listener(app, window, this.listenerCollect, this.handlerCollect);
        this.listenerMap.set(item, event);
      } catch (e) {
        console.log(`该文件夹下不存在继承BaseListener的脚本 ${e}`);
        process.exit(1);
      }
    });
    this.checkRepeatListener();
  }

  checkRepeatListener() {
    for (let value of this.listenerMap.values()) {
      if (!value.mounted) {
        setTimeout(() => {
          this.checkRepeatListener();
        }, 100);
        return;
      }
    }
    let set = new Set();
    this.listenerCollect.forEach((item) => {
      if (set.has(item)) {
        console.log(`存在同名监听:${item}`);
        // process.exit(1);
      }
      set.add(item);
    });
    set = new Set();
    this.handlerCollect.forEach((item) => {
      if (set.has(item)) {
        console.log(`存在同名handle:${item}`);
        // process.exit(1);
      }
      set.add(item);
    });
  }
}

module.exports = {
  ListenerManager,
  BaseListener,
};
