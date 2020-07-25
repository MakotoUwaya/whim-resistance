<template>
  <v-container>
    <span class="subtitle">投票してください</span>
    <v-col cols="12">
      <v-btn class="ma-4" fab dark large color="primary" @click="voting('○')">
        <span class="text-h4">○</span>
      </v-btn>
      <v-btn class="ma-4" fab dark large color="primary" @click="voting('×')">
        <span class="text-h4">×</span>
      </v-btn>
    </v-col>
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
