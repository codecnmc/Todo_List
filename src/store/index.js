import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 侧边栏点击的是否显示
    drawer: false,
    // 当前侧边栏选择的项
    active_key: "我的一天",
    // 侧边栏固定的目录
    fixed_menu: ["我的一天", "我的任务"],
    // 侧边栏可添加的目录
    sort_menu: [],
    // 当前完整列表
    current_list: [
      {
        id: "1",
        title: "测试数据1",
        complete: false,
        create_time: "2024-03-28 16:43:00",
        category: "",
      },
      {
        id: "1",
        title: "测试数据1",
        complete: true,
        create_time: "2024-03-28 16:43:00",
        category: "",
      },
    ],
  },
  mutations: {
    // 设置侧边栏显示
    setDrawer(state, show) {
      state.drawer = show;
    },
    // 设置当前选中的侧边栏值
    setActiveKey(state, key) {
      state.active_key = key;
    },
    // 设置当前的分类目录
    setSortMenu(state, data) {
      state.sort_menu = data;
    },
    // 设置列表
    setList(state, list) {
      state.current_list = list;
    },
  },
  actions: {},
  modules: {},
});
