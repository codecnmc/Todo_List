<template>
  <v-navigation-drawer
    v-model="drawer"
    :absolute="isAbsolute"
    :temporary="isAbsolute"
    app
    :class="{top:isAbsolute}"
    disable-resize-watcher
    mobile-breakpoint="0"
  >
    <v-toolbar
      color="#fff"
      flat
      v-if="isAbsolute"
    >
      <v-app-bar-nav-icon @click="drawer=!drawer"></v-app-bar-nav-icon>
    </v-toolbar>
    <v-list class="pt-md-6">
      <v-list-item
        class="list-item text-h6"
        v-for="item in menus"
        :key="item"
        :class="{'active':item==active_key}"
        @click="changeKey(item)"
      >
        <v-list-item-content>
          {{item}}
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
  </v-navigation-drawer>
</template>

<script>
import mixin from "@/mixins/store";
export default {
  mixins: [mixin],
  computed: {
    // 侧边栏是否是绝对布局
    isAbsolute() {
      return this.width <= 960;
    },
    // 目录列表
    menus() {
      return this.fixed_menu.concat(this.sort_menu);
    },
  },
  data() {
    return {
      width: "",
    };
  },
  mounted() {
    // 初始化drawer是否显示 并且监听窗口宽度变化情况
    this.responseWidth();
    window.addEventListener("resize", this.responseWidth);
  },
  methods: {
    // 监听窗口宽度变化
    responseWidth(event) {
      let width = window.innerWidth;
      if (this.width != width && width > 960) {
        this.drawer = true;
      }
      this.width = width;
    },
    // 切换侧边栏选中项 如果小于960 代表是在移动端的情况下 要把侧边栏收起来
    changeKey(key) {
      this.active_key = key;
      if (this.width < 960) {
        this.drawer = false;
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.responseWidth);
  },
};
</script>

<style lang="scss" scoped>
.top {
  z-index: 100;
}
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