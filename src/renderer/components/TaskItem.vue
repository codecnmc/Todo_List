<template>
  <v-list-item
    class="task-item mb-4"
    :class="{complete:item.complete}"
    @contextmenu.prevent="(event)=>{onContextmenu(event,item)}"
    @click="selectItem(item)"
  >
    <v-list-item-avatar>
      <v-checkbox
        v-model="item.complete"
        :dark="dark"
      />
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="text-subtitle-1">{{item.title}}</v-list-item-title>
      <v-list-item-subtitle>{{menusMap[item.category]||'任务'}}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <template v-if="mode=='delete'">
        <v-icon
          v-if="!item.complete"
          @click="deleteItem(item.id)"
        >mdi-close</v-icon>
      </template>
      <template v-else-if="mode=='add'">
        <v-icon
          v-if="!item.complete"
          @click="restoreItem(item)"
        >mdi-plus</v-icon>
      </template>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import mixin from "@/mixins/store";
import moment from "moment";
export default {
  mixins: [mixin],
  props: {
    value: {
      type: Object,
    },
    mode: {
      type: String,
      default: "delete",
    },
  },
  model: {
    event: "input",
    prop: "value",
  },
  computed: {
    item: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  methods: {
    // 删除事项
    deleteItem(id) {
      this.current_list.splice(
        this.current_list.findIndex((item) => item.id == id),
        1
      );
      if (this.form.id == id) {
        this.edit_drawer = false;
      }
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
    // 修改创建时间为今天
    restoreItem(item) {
      item.create_time = moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
    },
  },
};
</script>