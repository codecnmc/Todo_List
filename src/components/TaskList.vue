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
        v-for="list in lists(active_key)"
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
import mixin from "@/mixins/store";
import moment from "moment";
export default {
  mixins: [mixin],
  data() {
    return {
      // 待办事项输入值
      todo: "",
      // 这里处理渲染的时候v-checkbox值变动样式不刷新的问题
      refresh: true,
    };
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
        create_time: moment(new Date()).format("yyyy-MM-DD HH:mm:ss"),
        category: "",
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