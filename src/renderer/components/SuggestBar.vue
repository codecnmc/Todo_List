<template>
  <side-bar
    :right="true"
    v-model="suggest_drawer"
    width="350px"
    :app="true"
  >
    <div class="d-flex justify-space-between  mt-12 mt-md-4  px-4 pr-2">
      <span class="text-h6">建议</span>
      <v-btn
        text
        fab
        x-small
        @click="suggest_drawer=false"
      > <v-icon>mdi-close</v-icon></v-btn>
    </div>
    <v-list>
      <div
        v-for="(value,key) in unComplete"
        :key="key"
      >
        <v-subheader>{{key}}</v-subheader>
        <task-item
          v-for="(item,index) in value"
          :key="item.id"
          mode="add"
          v-model="value[index]"
        />
      </div>
    </v-list>
  </side-bar>
</template>

<script>
import SideBar from "./SideBar.vue";
import mixin from "@/mixins/store";
import moment from "moment";
import TaskItem from "./TaskItem.vue";
export default {
  mixins: [mixin],
  components: { SideBar, TaskItem },
  computed: {
    unComplete() {
      let today = moment().format("yyyy-MM-DD");
      let unCompelete = this.current_list.filter((item) => {
        return (
          !item.complete &&
          moment(item.create_time).format("yyyy-MM-DD") != today
        );
      });
      let dates = {};
      unCompelete = unCompelete.sort((a, b) =>
        moment(a.create_time).isBefore(b.create_time) ? 1 : -1
      );
      unCompelete.forEach((item) => {
        let date = moment(item.create_time).format("yyyy-MM-DD dddd");
        if (!dates[date]) {
          dates[date] = [];
        }
        dates[date].push(item);
      });
      return dates;
    },
  },
  watch: {
    suggest_drawer(value) {
      if (value) {
        this.edit_drawer = false;
      }
    },
  },
};
</script>

<style lang="scss">
</style>