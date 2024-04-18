<template>
  <v-navigation-drawer
    v-model="drawer"
    v-resize="responseWidth"
    :temporary="isAbsolute"
    absolute
    :app="app"
    :class="{top:isAbsolute}"
    disable-resize-watcher
    mobile-breakpoint="0"
    v-bind="$attrs"
    :right="right"
    clipped
    :fixed="isAbsolute"
    color="#FAFAFA"
  >
    <slot :isAbsolute="isAbsolute"></slot>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: ["right", "value", "app"],
  model: {
    prop: "value",
    event: "change",
  },
  computed: {
    // 侧边栏是否是绝对布局
    isAbsolute() {
      return this.width <= 960;
    },
    // 封装的v-model
    drawer: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("change", value);
      },
    },
    // 是否是黑暗模式
    dark() {
      return this.$store.state.dark;
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
  },
  methods: {
    // 监听窗口宽度变化
    responseWidth(event) {
      let width = window.innerWidth;
      // 右侧的小于960的时候要隐藏
      if (this.width != width && width < 960 && this.right) {
        this.drawer = false;
      }
      // 左侧的大于960要显示出来
      if (this.width != width && width > 960 && !this.right) {
        this.drawer = true;
      }
      this.width = width;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>