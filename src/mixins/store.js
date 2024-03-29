import moment from "moment";
export default {
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
      return (key) => {
        switch (key) {
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
            break;
        }
      };
    },
  },
};
