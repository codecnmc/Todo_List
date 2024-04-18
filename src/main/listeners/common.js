/*
 * @Author: 羊驼
 * @Date: 2023-11-01 11:07:28
 * @LastEditors: 羊驼
 * @LastEditTime: 2024-04-18 14:37:14
 * @Description: file content
 */

const { BaseListener } = require("../listener");

class commonListener extends BaseListener {
  listener = {};

  handler = {
    exit: () => {
      this.app.quit();
    },
    minimize: () => {
      this.window.minimize();
    },
    fullscreen: () => {
      this.window.setFullScreen(!this.window.isFullScreen());
    },
  };
}

module.exports = commonListener;
