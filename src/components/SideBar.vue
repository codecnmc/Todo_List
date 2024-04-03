<template>
  <v-navigation-drawer
    v-model="drawer"
    :absolute="isAbsolute"
    :temporary="isAbsolute"
    app
    :class="{top:isAbsolute}"
    disable-resize-watcher
    mobile-breakpoint="0"
    v-bind="$attrs"
    :left="left"
    :right="right"
  >
    <v-toolbar
      color="#fff"
      flat
      v-if="isAbsolute&&!right"
    >
      <v-app-bar-nav-icon @click="drawer=!drawer"></v-app-bar-nav-icon>
    </v-toolbar>
    <slot></slot>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: ["left", "right", "value"],
  model: {
    prop: "value",
    event: "change",
  },
  computed: {
    // 侧边栏是否是绝对布局
    isAbsolute() {
      return this.width <= 960;
    },
    drawer: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("change", value);
      },
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
      if (this.width != width && width > 960 && !this.right) {
        this.drawer = true;
      }
      if (this.width != width && width < 960 && this.right) {
        this.drawer = false;
      }
      this.width = width;
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
</style>