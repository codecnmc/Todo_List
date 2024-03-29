<template>
  <div
    id="app"
    class="v-application"
  >

    <v-card
      width="100%"
      flat
    >
      <v-system-bar
        color="#303F9F"
        dark
      >
        <v-spacer></v-spacer>

        <v-icon>mdi-window-minimize</v-icon>

        <v-icon>mdi-window-maximize</v-icon>

        <v-icon>mdi-close</v-icon>
      </v-system-bar>

      <v-toolbar
        color="#3F51B5"
        dark
      >
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-toolbar-title>我的一天</v-toolbar-title>

        <v-spacer></v-spacer>

      </v-toolbar>

      <v-container>
        <task-list />
      </v-container>
    </v-card>
  </div>
</template>

<script>
import TaskList from "./components/TaskList.vue";
export default {
  name: "App",
  components: {
    TaskList,
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
</style>
