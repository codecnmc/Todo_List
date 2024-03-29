<template>
  <div id="app">
    <v-app>
      <v-system-bar
        color="#303F9F"
        dark
      >
        <v-spacer></v-spacer>
        <v-icon>mdi-window-minimize</v-icon>
        <v-icon>mdi-window-maximize</v-icon>
        <v-icon>mdi-close</v-icon>
      </v-system-bar>
      <!-- 这里使用我们自己封装的drawer 要根据页面宽度去解决侧边栏常驻 -->
      <side-bar />
      <v-main>
        <v-toolbar
          color="#3F51B5"
          dark
        >
          <v-app-bar-nav-icon
            @click="drawer=!drawer"
            class="d-sm-flex d-md-none"
          ></v-app-bar-nav-icon>
          <v-toolbar-title>{{active_key}}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-container>
          <task-list />
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import SideBar from "./components/SideBar.vue";
import TaskList from "./components/TaskList.vue";
import mixin from "@/mixins/store";
export default {
  mixins: [mixin],
  name: "App",
  components: {
    TaskList,
    SideBar,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  overflow: auto;
}
.v-system-bar {
  z-index: 99;
}
</style>
