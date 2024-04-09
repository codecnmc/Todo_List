<template>
  <!-- 编辑抽屉 -->
  <side-bar
    v-model="edit_drawer"
    :right="true"
    width="350px"
    class="edit-drawer"
    :app="suggest_drawer?false:true"
  >
    <div class="d-flex justify-space-between mt-12 mt-md-4 px-4 pr-2">
      <span class="text-h6">事项编辑</span>
      <v-btn
        text
        fab
        x-small
        @click="edit_drawer=false"
      > <v-icon>mdi-close</v-icon></v-btn>
    </div>
    <v-form
      v-if="form"
      class="px-6"
    >
      <div class="d-flex align-center mb-4">
        <v-checkbox v-model="form.complete" />
        <v-text-field
          v-model="form.title"
          dense
          hide-details
          outlined
          label="待办事项"
          @focus="getCacheName"
          @blur="checkName"
        />
      </div>
      <v-select
        v-model="form.category"
        :items="sortOptions"
        item-text="label"
        item-value="value"
        dense
        label="分类设置"
        outlined
        persistent-placeholder
      />
      <v-select
        v-model="form.deadline"
        :items="deadline_options"
        clearable
        dense
        label="截止日期"
        outlined
        persistent-placeholder
      />
      <v-select
        v-model="form.remind_time"
        :items="deadline_options"
        clearable
        dense
        label="提醒日期"
        persistent-placeholder
        outlined
      />
      <v-select
        v-model="form.repeat_type"
        :items="repeat_options"
        clearable
        dense
        label="重复"
        persistent-placeholder
        outlined
      />
      <v-textarea
        v-model="form.remark"
        label="备注"
        clearable
        persistent-placeholder
        outlined
        dense
        no-resize
      />
    </v-form>
  </side-bar>
</template>

<script>
import SideBar from "./SideBar.vue";
import mixin from "@/mixins/store";
export default {
  mixins: [mixin],
  components: { SideBar },
  data() {
    return {
      // 防止清空item的名称
      cache_name: "",
    };
  },
  methods: {
    // 缓存名称
    getCacheName(event) {
      this.cache_name = event.target.value;
    },
    // 检查名称是否被清空
    checkName() {
      if (!this.form.title) {
        this.form.title = this.cache_name;
        this.cache_name = "";
      }
    },
  },
};
</script>