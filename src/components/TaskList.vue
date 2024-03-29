<template>
  <div class="py-4">
    <v-text-field
      v-model="todo"
      counter="25"
      placeholder="请输入待办事项"
      label="待办事项"
      outlined
      dense
      persistent-placeholder
      @keydown.enter="addTodo"
    ></v-text-field>

    <v-list dense>
      <div
        v-for="list in lists"
        :key="list.name"
      >
        <template v-if="list.data.length">
          <v-subheader>{{list.name}}</v-subheader>
          <v-list-item
            v-for="(item, i) in list.data"
            :key="i"
            class="task-item mb-4"
            :class="{complete:item.complete}"
          >
            <v-list-item-avatar>
              <v-checkbox
                v-model="item.complete"
                @change="forceUpdate"
                v-if="refresh"
              />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{item.title}}</v-list-item-title>
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
  </div>
</template>

<script>
import { uuid } from "vue-uuid";
export default {
  data() {
    return {
      // 当前完整列表
      current_list: [],
      // 待办事项输入值
      todo: "",
      // 这里处理渲染的时候v-checkbox值变动样式不刷新的问题
      refresh: true,
    };
  },
  computed: {
    // 为了能用v-for 渲染写的列表目录
    lists() {
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
    },
  },
  methods: {
    // 新增todolist
    addTodo() {
      if (!this.todo) return;
      this.current_list.push({
        // 增加id是因为使用了computed 它的index是不准的
        id: uuid.v4(),
        title: this.todo,
        complete: false,
        create_time: new Date(),
      });
      this.todo = "";
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
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-label {
  left: -13px !important;
}
.task-item {
  background-color: #eee;
  border-radius: 10px;
}
.task-item.complete {
  .v-list-item__title {
    text-decoration: line-through;
    color: #ccc;
  }
}
</style>