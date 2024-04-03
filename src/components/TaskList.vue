<template>
  <div class="py-4">
    <v-text-field
      v-model="todo"
      placeholder="请输入待办事项"
      label="待办事项"
      outlined
      single-line
      persistent-placeholder
      dense
      clearable
      @keydown.enter="addTodo"
    >
    </v-text-field>
    <div v-if="todo&&todo.length">
      <div class="mb-2">待办设置</div>
      <div>
        <!-- 分类设置 -->
        <menu-button
          icon="mdi-menu"
          v-model="category"
          :options="sortOptions"
          tips="分类设置"
          v-if="active_key&&[1,2].includes(active_key.id)"
        />
        <!-- 截止日期设置 -->
        <menu-button
          v-model="deadline"
          :options="deadline_options"
          tips="截止日期"
          item_icon="mdi-calendar-month"
          icon="mdi-calendar-month"
          append="删除截止日期"
        />
        <!-- 提醒日期 -->
        <menu-button
          v-model="remind_time"
          :options="deadline_options"
          tips="提醒日期"
          item_icon="mdi-calendar-month"
          icon="mdi-clock-alert"
          append="删除提醒日期"
        />
        <!--  -->
        <menu-button
          v-model="repeat_type"
          :options="repeat_options"
          tips="重复"
          item_icon="mdi-calendar-month"
          icon="mdi-calendar-refresh"
          append="从不重复"
        />
      </div>
    </div>
    <!-- 任务列表 -->
    <v-list dense>
      <div
        v-for="
          list
          in
          lists(active_key)"
        :key="list.name"
      >
        <template v-if="list.data.length">
          <v-subheader class="text-h6 mb-2">{{list.name}}<v-chip
              small
              class="ml-2"
            >{{list.data.length}}</v-chip></v-subheader>
          <v-list-item
            v-for="(item, i) in list.data"
            :key="i"
            class="task-item mb-4"
            :class="{complete:item.complete}"
            @contextmenu.prevent="(event)=>{onContextmenu(event,item)}"
            @click="selectItem(item)"
          >
            <v-list-item-avatar>
              <v-checkbox
                v-model="item.complete"
                @change="forceUpdate"
                v-if="refresh"
              />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="text-subtitle-1">{{item.title}}</v-list-item-title>
              <v-list-item-subtitle>{{menusMap[item.category]||'任务'}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon
                v-if="!item.complete"
                @click="deleteItem(item.id)"
              >mdi-close</v-icon>
            </v-list-item-action>
          </v-list-item>
        </template>
      </div>
    </v-list>
    <!-- 编辑抽屉 -->
    <side-bar
      v-model="edit_drawer"
      :right="true"
      width="350px"
    >
      <div class="d-flex justify-space-between mt-md-10 mt-sm-4 pl-4">
        <span class="text-h6">事项编辑</span>
        <v-btn
          text
          @click="edit_drawer=false"
        > <v-icon>mdi-close</v-icon></v-btn>
      </div>
      <v-form
        v-if="form"
        class="px-6"
      >
        <div class="d-flex align-center mb-4">
          <v-checkbox v-model="form.complete" />
          <v-text-field
            v-model="form.title"
            dense
            hide-details
            outlined
            label="待办事项"
            @focus="getCacheName"
            @blur="checkName"
          />
        </div>
        <v-select
          v-model="form.category"
          :items="sortOptions"
          item-text="label"
          item-value="value"
          dense
          label="分类设置"
          outlined
          persistent-placeholder
        />
        <v-select
          v-model="form.deadline"
          :items="deadline_options"
          clearable
          dense
          label="截止日期"
          outlined
          persistent-placeholder
        />
        <v-select
          v-model="form.remind_time"
          :items="deadline_options"
          clearable
          dense
          label="提醒日期"
          persistent-placeholder
          outlined
        />
        <v-select
          v-model="form.repeat_type"
          :items="repeat_options"
          clearable
          dense
          label="重复"
          persistent-placeholder
          outlined
        />
        <v-textarea
          v-model="form.remark"
          label="备注"
          clearable
          persistent-placeholder
          outlined
          dense
          no-resize
        />
      </v-form>
    </side-bar>
  </div>
</template>

<script>
import { uuid } from "vue-uuid";
import mixin from "@/mixins/store";
import moment from "moment";
import MenuButton from "./MenuButton.vue";
import SideBar from "./SideBar.vue";
export default {
  components: { MenuButton, SideBar },
  mixins: [mixin],
  data() {
    return {
      // 待办事项输入值
      todo: "",
      // 这里处理渲染的时候v-checkbox值变动样式不刷新的问题
      refresh: true,
      // 追加功能
      defaultCategory: { label: "任务", value: -1, icon: "mdi-content-paste" },
      // 分类
      category: null,
      // 截止日期
      deadline: "无",
      // 提醒时间
      remind_time: "无",
      // 重复类型
      repeat_type: "无",
      // 菜单选项
      deadline_options: ["今天", "明天", "下周"],
      repeat_options: ["每天", "工作日", "每周", "每月", "每年"],
      //编辑表单
      form: null,
      // 防止清空item的名称
      cache_name: "",
    };
  },
  computed: {
    // 可选菜单列表
    sortOptions() {
      let options = [this.defaultCategory].concat(
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
  mounted() {
    this.category = this.defaultCategory;
  },
  methods: {
    // 新增todolist
    addTodo() {
      if (!this.todo) return;
      let category = this.category.value;
      if (![1, 2].includes(this.active_key.id)) {
        category = this.active_key.id;
      }
      this.current_list.push({
        // 增加id是因为使用了computed 它的index是不准的
        id: uuid.v4(),
        title: this.todo,
        complete: false,
        create_time: moment(new Date()).format("yyyy-MM-DD HH:mm:ss"),
        category,
        deadline: "",
        remind_time: "",
        repeat_type: "",
        remark: "",
      });
      this.todo = "";
      this.category = this.defaultCategory;
      // TODO 处理接收的所有参数
    },
    // 强制刷新
    forceUpdate() {
      this.refresh = false;
      this.$nextTick(() => {
        this.refresh = true;
      });
    },
    // 删除事项
    deleteItem(id) {
      this.current_list.splice(
        this.current_list.findIndex((item) => item.id == id),
        1
      );
    },
    // 右键菜单
    onContextmenu(event, item) {
      if (item.affix) return;
      let items = [
        {
          label: !item.complete ? "标记为完成" : "标记为未完成",
          icon: `v-icon notranslate mdi ${
            item.complete ? "mdi-circle-outline" : "mdi-check"
          }`,
          onClick: () => {
            item.complete = !item.complete;
          },
        },
        {
          label: "删除",
          icon: "v-icon notranslate mdi mdi-close",
          onClick: () => {
            this.deleteItem(item.id);
          },
        },
      ];
      if (this.sortOptions.length > 1) {
        items.splice(1, 0, {
          label: "移动",
          icon: `v-icon notranslate mdi mdi-apps`,
          children: this.sortOptions
            .filter((sort) => sort.value != item.category)
            .map((sort) => {
              return {
                label: sort.label,
                icon: `v-icon notranslate mdi ${sort.icon}`,
                onClick: () => {
                  item.category = sort.value;
                },
              };
            }),
        });
      }
      this.$contextmenu({
        items,
        event, // 鼠标事件信息
        customClass: "custom-class", // 自定义菜单 class
        zIndex: 999, // 菜单样式 z-index
        minWidth: 230, // 主菜单最小宽度
      });
      return false;
    },
    // 选择要编辑的todo
    selectItem(item) {
      // 深拷贝对象
      this.form = item;
      this.edit_drawer = true;
    },
    // 缓存名称
    getCacheName(event) {
      this.cache_name = event.target.value;
    },
    // 检查名称是否被清空
    checkName() {
      if (!this.form.title) {
        this.form.title = this.cache_name;
        this.cache_name = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.task-item {
  background-color: #eee;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    background-color: #ccc;
  }
}
.task-item.complete {
  .v-list-item__title,
  .v-list-item__subtitle {
    text-decoration: line-through;
    color: #ccc;
  }
}
</style>