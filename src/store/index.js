/*
 * @Author: 羊驼
 * @Date: 2024-03-28 16:06:38
 * @LastEditors: 羊驼
 * @LastEditTime: 2024-04-03 16:53:08
 * @Description: file content
 */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 侧边栏点击的是否显示
    drawer: false,
    // 当前侧边栏选择的项
    active_key: null,
    // 侧边栏固定的目录
    fixed_menu: [
      { id: 1, name: "我的一天", affix: true, icon: "mdi-home" },
      { id: 2, name: "我的任务", affix: true, icon: "mdi-content-paste" },
    ],
    // 侧边栏可添加的目录
    sort_menu: [{ id: 3, name: "未命名列表", affix: false, icon: "mdi-menu" }],
    // 当前完整列表
    current_list: [
      {
        id: "1",
        title: "测试数据1",
        complete: false,
        create_time: "2024-03-28 16:43:00",
        category: -1,
      },
      {
        id: "2",
        title: "测试数据1",
        complete: true,
        create_time: "2024-03-28 16:43:00",
        category: -1,
      },
    ],
    // 编辑框的显示
    edit_drawer: false,
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
    // 设置编辑栏显示
    setEditDrawer(state, show) {
      state.edit_drawer = show;
    },
  },
  actions: {},
  modules: {},
});
