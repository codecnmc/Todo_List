import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import vuetify from "@/plugins/vuetify"; // path to vuetify export
import Contextmenu from "vue-contextmenujs";
Vue.config.productionTip = false;
Vue.use(Contextmenu);
new Vue({
  store,
  render: (h) => h(App),
  vuetify,
}).$mount("#app");
