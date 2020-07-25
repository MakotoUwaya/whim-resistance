<template>
  <v-container>
    <v-row class="justify-center">
      <v-img src="../../assets/vote.png" :max-width="100" />
    </v-row>
    <v-row class="justify-center">
      <v-img
        class="image-button mr-8"
        src="../../assets/mark_maru.png"
        :max-width="150"
        @click="voting('○')"
      />
      <v-img
        class="image-button ml-8"
        src="../../assets/mark_batsu.png"
        :max-width="150"
        @click="voting('×')"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class PlayerVote extends Vue {
  voting(approve: "○" | "×") {
    this.$emit("voting", approve === "○");
  }
}
</script>

<style lang="scss" scoped></style>
