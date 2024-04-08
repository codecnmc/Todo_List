<template>
  <div class="py-4 pr-8 px-6">
    <v-text-field
      v-model="todo"
      placeholder="请输入待办事项"
      label="待办事项"
      outlined
      single-line
      persistent-placeholder
      dense
      prepend-inner-icon="mdi-plus"
      :dark="dark"
      clearable
      class="todo"
      @keydown.enter="addTodo"
    >
    </v-text-field>
    <div v-if="todo&&todo.length">
      <div class="mb-2 title pl-2">待办设置</div>
      <div>
        <!-- 分类设置 -->
        <menu-button
          icon="mdi-menu"
          v-model="category"
          :options="sortOptions"
          tips="分类设置"
          v-if="active_key&&[1,2].includes(active_key.id)"
          :dark="dark"
        />
        <!-- 截止日期设置 -->
        <menu-button
          v-model="deadline"
          :options="deadline_options"
          tips="截止日期"
          item_icon="mdi-calendar-month"
          icon="mdi-calendar-month"
          append="删除截止日期"
          :dark="dark"
        />
        <!-- 提醒日期 -->
        <menu-button
          v-model="remind_time"
          :options="deadline_options"
          tips="提醒日期"
          item_icon="mdi-calendar-month"
          icon="mdi-clock-alert"
          append="删除提醒日期"
          :dark="dark"
        />
        <!--  -->
        <menu-button
          v-model="repeat_type"
          :options="repeat_options"
          tips="重复"
          item_icon="mdi-calendar-month"
          icon="mdi-calendar-refresh"
          append="从不重复"
          :dark="dark"
        />
      </div>
    </div>
    <!-- 任务列表 -->
    <v-list
      dense
      color="transparent"
      :dark="dark"
    >
      <div
        v-for="
          list
          in
          tasks"
        :key="list.name"
      >
        <template v-if="list.data.length">
          <v-subheader class="text-h6 mb-2 title">{{list.name}}<v-chip
              small
              class="ml-2"
            >{{list.data.length}}</v-chip></v-subheader>
          <task-item
            v-for="(item,index) in list.data"
            :key="item.id"
            v-model="list.data[index]"
          />
        </template>
      </div>
    </v-list>
    <div
      v-if="isEmpty"
      class="v-empty"
    >
      <v-card
        max-width="344"
        color="transparent"
        flat
      >
        <v-card-text>
          <v-img
            class="mx-auto"
            width="80"
            height="80"
            :src="require('@/assets/empty.png')"
          ></v-img>
          <div class="title mt-4">待办列表为空</div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { uuid } from "vue-uuid";
import mixin from "@/mixins/store";
import moment from "moment";
import MenuButton from "./MenuButton.vue";
import SideBar from "./SideBar.vue";
import TaskItem from "./TaskItem.vue";
export default {
  components: { MenuButton, SideBar, TaskItem },
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
    };
  },
  computed: {
    // 任务列表
    tasks() {
      return this.lists(this.active_key);
    },
    // 是否是空的
    isEmpty() {
      return this.tasks.every((x) => !x.data.length);
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
  },
};
</script>

<style lang="scss" scoped>
.v-empty {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>