/*
 * @Author: 羊驼
 * @Date: 2024-03-28 16:06:38
 * @LastEditors: 羊驼
 * @LastEditTime: 2024-04-18 11:27:44
 * @Description: file content
 */
import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import vuetify from "@/plugins/vuetify"; // path to vuetify export
Vue.config.productionTip = false;
import Contextmenu from "vue-contextmenujs";
Vue.use(Contextmenu)
new Vue({
  store,
  render: (h) => h(App),
  vuetify,
}).$mount("#app");
