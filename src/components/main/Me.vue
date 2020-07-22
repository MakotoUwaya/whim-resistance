<template>
  <v-container>
    <span class="subtitle"> ポイントを<br />選んでください </span>
    <v-row class="text-center">
      <v-btn
        v-for="item in items"
        :key="item"
        class="ma-2"
        fab
        dark
        large
        color="secondary"
        @click="select(item)"
      >
        <span class="text-h5">{{ item }}</span>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class MeView extends Vue {
  items = [0.5, 1, 2, 3, 4, 7, 8, 10];

  select(point: number) {
    this.$whim.assignState({ [this.$whim.accessUser.id]: point });
  }
}
</script>

<style lang="scss" scoped>
.subtitle {
  font-weight: 300;
  font-size: 30px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
</style>
