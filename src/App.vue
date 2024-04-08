<template>
  <v-app :class="{dark}">
    <v-system-bar
      color="#EFEFEF"
      height="36px"
      window
      app
    >
      <v-icon>mdi-infinity</v-icon>
      <div class="app-name">Yangtuo To Do</div>
      <v-spacer></v-spacer>
      <v-icon>mdi-window-minimize</v-icon>
      <v-icon>mdi-window-maximize</v-icon>
      <v-icon>mdi-close</v-icon>
    </v-system-bar>
    <!-- 这里使用我们自己封装的drawer 要根据页面宽度去解决侧边栏常驻 -->
    <left-bar />
    <!-- 编辑栏 -->
    <edit-bar />
    <!-- 建议栏 -->
    <suggest-bar />
    <v-main v-if="active_key">
      <v-toolbar
        :dark="dark"
        color="transparent"
        flat
        :height="active_key.id==1?'120px':'84px'"
        class="pt-2 pr-4"
      >
        <v-toolbar-title>
          <v-app-bar-nav-icon
            @click="drawer=!drawer"
            class="d-sm-flex d-md-none"
          ></v-app-bar-nav-icon>
          <div class="pl-3 text-h5">{{active_key&&active_key.name}}</div>
          <div
            class="pl-3 mt-2 date"
            v-if="active_key.id==1"
          >{{today}}</div>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          text
          fab
          small
          v-if="active_key&&active_key.id==1"
          @click="suggest_drawer=!suggest_drawer"
        >
          <v-icon>mdi-lightbulb-outline</v-icon>
        </v-btn>

      </v-toolbar>

      <task-list />

    </v-main>
  </v-app>
</template>

<script>
import TaskList from "./components/TaskList.vue";
import mixin from "@/mixins/store";
import LeftBar from "./components/LeftBar.vue";
import SuggestBar from "./components/SuggestBar.vue";
import EditBar from "./components/EditBar.vue";
import moment from "moment";
moment.locale("zh-cn");

export default {
  mixins: [mixin],
  name: "App",
  components: {
    TaskList,
    LeftBar,
    SuggestBar,
    EditBar,
  },
  computed: {
    today() {
      return moment().format("M月D日 dddd");
    },
  },
};
</script>,

<style lang="scss">
.task-item {
  background-color: #eee;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    background-color: #ccc;
  }
}
.task-item.complete {
  .v-list-item__title,
  .v-list-item__subtitle {
    text-decoration: line-through;
    color: #ccc;
  }
}
.menu_item_icon {
  margin-right: 20px !important;
}
.edit-drawer {
  z-index: 1001 !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #6478c7;
  .v-system-bar {
    z-index: 1002;
  }
  .menu_item_label {
    margin-left: 10px !important;
    font-size: 16px;
  }
  .app-name {
    font-size: 16px;
    user-select: none;
  }
  &.dark {
    .todo .v-input__slot {
      background-color: #fff !important;
      input {
        color: #000 !important;
        &::placeholder {
          color: #ccc !important;
        }
      }
      .v-icon,
      .white-text {
        color: #616161 !important;
      }
    }
    .title {
      color: #fff;
    }
    $subtitle: #616161;
    .task-item {
      background-color: #f6f6f6;
      color: #717171;
      .v-list-item__subtitle {
        color: $subtitle;
      }
      .v-input--selection-controls__input .v-icon {
        color: $subtitle !important;
      }
      .v-icon {
        color: $subtitle !important;
      }
    }
  }
}
</style>
