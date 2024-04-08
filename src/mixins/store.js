import moment from "moment";
export default {
  data() {
    return {
      // 菜单选项
      deadline_options: ["今天", "明天", "下周"],
      repeat_options: ["每天", "工作日", "每周", "每月", "每年"],
    };
  },
  computed: {
    // 操作侧边栏的打开
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(value) {
        this.$store.commit("setDrawer", value);
      },
    },
    // 当前侧边栏选了什么
    active_key: {
      get() {
        return this.$store.state.active_key;
      },
      set(value) {
        this.$store.commit("setActiveKey", value);
      },
    },
    // 侧边栏固定的项目
    fixed_menu() {
      return this.$store.state.fixed_menu;
    },
    // 分类项目
    sort_menu: {
      get() {
        return this.$store.state.sort_menu;
      },
      set(value) {
        this.$store.commit("setSortMenu", value);
      },
    },
    // 当前列表
    current_list: {
      get() {
        return this.$store.state.current_list;
      },
      set(value) {
        this.$store.commit("setList", value);
      },
    },
    // 为了能用v-for 渲染写的列表目录 根据不同的key去获取它的待办列表和已完成列表
    lists() {
      return (item) => {
        if (!item) return [];
        switch (item.name) {
          case "我的一天":
            let current_date = moment(new Date()).format("yyyy-MM-DD");
            return [
              {
                name: "待办列表",
                data: this.current_list.filter(
                  (list_item) => !list_item.complete && moment(list_item.create_time).format("yyyy-MM-DD") == current_date
                ),
              },
              {
                name: "已完成",
                data: this.current_list.filter(
                  (list_item) => list_item.complete && moment(list_item.create_time).format("yyyy-MM-DD") == current_date
                ),
              },
            ];
          case "我的任务":
            return [
              {
                name: "待办列表",
                data: this.current_list.filter((list_item) => !list_item.complete),
              },
              {
                name: "已完成",
                data: this.current_list.filter((list_item) => list_item.complete),
              },
            ];
          default:
            return [
              {
                name: "待办列表",
                data: this.current_list.filter((list_item) => !list_item.complete && list_item.category == item.id),
              },
              {
                name: "已完成",
                data: this.current_list.filter((list_item) => list_item.complete && list_item.category == item.id),
              },
            ];
        }
      };
    },
    // 操作侧边栏的打开
    edit_drawer: {
      get() {
        return this.$store.state.edit_drawer;
      },
      set(value) {
        this.$store.commit("setEditDrawer", value);
      },
    },
    // 建议的侧边栏
    suggest_drawer: {
      get() {
        return this.$store.state.suggest_drawer;
      },
      set(value) {
        this.$store.commit("setSuggestDrawer", value);
      },
    },
    // 编辑表单
    form: {
      get() {
        return this.$store.state.form;
      },
      set(value) {
        this.$store.commit("setForm", value);
      },
    },
    dark: {
      get() {
        return this.$store.state.dark;
      },
      set(value) {
        this.$store.commit("setDark", value);
      },
    },
    // 可选菜单列表
    sortOptions() {
      let options = [{ label: "任务", value: -1, icon: "mdi-content-paste" }].concat(
        this.sort_menu.map((item) => {
          return {
            label: item.name,
            value: item.id,
            icon: item.icon,
          };
        })
      );
      return options;
    },
    // 显示subtitle 所属分类用的字典 因为绑定的是id
    menusMap() {
      let map = {};
      this.sortOptions.forEach((item) => {
        map[item.value] = item.label;
      });
      return map;
    },
  },
};
