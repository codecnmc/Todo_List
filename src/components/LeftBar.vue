<template>
  <side-bar v-model="drawer">
    <v-list
      class="pt-md-6"
      v-if="active_key"
    >
      <v-list-item
        class="list-item text-h6"
        v-for="(item,index) in menus"
        :key="index"
        :class="{'active':item.id==active_key.id}"
        @click="changeKey(item)"
        @contextmenu.prevent="(event)=>{onContextmenu(event,item)}"
      >
        <v-list-item-icon>
          <v-icon>{{item.icon}}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <span
            v-if="!item.edit"
            @dblclick="rename(item)"
          > {{item.name}}</span>
          <v-text-field
            v-if="item.edit"
            v-model="item.name"
            dense
            autofocus
            @blur="checkInput(item)"
          />
        </v-list-item-content>
        <v-list-item-action>
          <v-chip
            class="ml-4"
            v-if="lists(item)[0].data.length"
          >{{lists(item)[0].data.length}}</v-chip>
        </v-list-item-action>
      </v-list-item>
      <v-divider></v-divider>
    </v-list>
    <v-btn
      block
      text
      @click="pushMenu"
    >
      <v-icon left>
        mdi-plus
      </v-icon>
      新建列表</v-btn>
  </side-bar>
</template>

<script>
import SideBar from "./SideBar.vue";
import mixin from "@/mixins/store";
import { uuid } from "vue-uuid";
export default {
  mixins: [mixin],
  components: { SideBar },
  computed: {
    // 目录列表
    menus() {
      return this.fixed_menu.concat(this.sort_menu);
    },
  },
  mounted() {
    if (!this.active_key) {
      this.active_key = this.fixed_menu[0];
    }
  },
  methods: {
    // 切换侧边栏选中项 如果小于960 代表是在移动端的情况下 要把侧边栏收起来
    changeKey(key) {
      this.active_key = key;
      if (this.width < 960) {
        this.drawer = false;
      }
    },
    // 增加分类
    pushMenu() {
      this.sort_menu.push({
        id: uuid.v4(),
        name: "未命名列表",
        affix: false,
        edit: true,
        icon: "mdi-menu",
      });
    },
    // 检查输出结果
    checkInput(item) {
      let name_set = new Set();
      let needRename = this.sort_menu.some((list_item) => {
        name_set.add(list_item.name);
        return item != list_item && list_item.name == item.name;
      });
      if (needRename) {
        let [exist, name, i] = [true, item.name, 1];
        while (exist) {
          name = `${item.name}(${i})`;
          exist = name_set.has(name);
        }
        item.name = name;
      }
      item.edit = false;
      this.$forceUpdate();
    },
    // 重命名
    rename(item) {
      if (item.affix) return;
      item.edit = true;
      this.$forceUpdate();
    },
    // 右键菜单
    onContextmenu(event, item) {
      if (item.affix) return;
      this.$contextmenu({
        items: [
          {
            label: "重命名",
            icon: "v-icon notranslate mdi mdi-pencil",
            onClick: () => {
              this.rename(item);
            },
          },
          {
            label: "删除",
            icon: "v-icon notranslate mdi mdi-close",
            onClick: () => {
              this.deleteMenu(item);
            },
          },
        ],
        event, // 鼠标事件信息
        customClass: "custom-class", // 自定义菜单 class
        zIndex: 999, // 菜单样式 z-index
        minWidth: 230, // 主菜单最小宽度
      });
      return false;
    },
    // 删除菜单
    deleteMenu(item) {
      // 清除存在分类中的事项
      this.current_list.forEach((list_item) => {
        if (list_item.category == item.id) {
          list_item.category = "";
        }
      });
      let index = this.sort_menu.findIndex((x) => x.id == item.id);
      index != -1 && this.sort_menu.splice(index, 1);
      // 切换选中的栏目
      if (this.active_key.id == item.id) {
        this.active_key = this.fixed_menu[0];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.list-item {
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
  &.active {
    background: #eee;
  }
}
</style>