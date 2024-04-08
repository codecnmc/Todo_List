<template>
  <v-menu
    offset-y
    :dark="dark"
  >
    <template v-slot:activator="{attrs:toolAttr,on:toolOn}">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="{...toolAttr,...attrs}"
            v-on="{...on,...toolOn}"
            text
            dark
          >
            <v-icon left>
              {{icon}}
            </v-icon>
            {{model&&model.label||model}}
          </v-btn>
        </template>
        <span>{{tips}}</span>
      </v-tooltip>
    </template>
    <v-list
      dense
      :dark="dark"
    >
      <v-list-item
        class="pr-10"
        v-for="(item, index) in options"
        :key="index"
        @click="model=item"
      >
        <v-list-item-icon v-if="item.icon||item_icon">
          <v-icon>{{item.icon||item_icon}}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ item&&item.label||item }}</v-list-item-title>
      </v-list-item>
      <v-list-item
        @click="model='无'"
        v-if="model!='无'&&append"
      >
        <v-list-item-title class="red--text">{{append}}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

</template>

<script>
export default {
  props: ["options", "icon", "tips", "value", "item_icon", "append", "dark"],
  model: {
    prop: "value",
    event: "input",
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>

<style>
</style>