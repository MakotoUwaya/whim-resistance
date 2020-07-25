<template>
  <v-container>
    <v-col cols="12">
      <span class="subtitle">
        {{ isResistanceWin ? "レジスタンスの勝ち！" : "スパイの勝ち！" }}<br />
        {{ successMissionCount }} vs {{ failMissionCount }}
      </span>
    </v-col>
    <v-btn color="secondary" class="my-4" @click="restartGame"
      >もう一度！</v-btn
    >
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class GameResult extends Vue {
  @Prop({ type: Boolean, default: false }) isResistanceWin!: boolean;
  @Prop({ type: Number, default: 0 }) successMissionCount!: number;
  @Prop({ type: Number, default: 0 }) failMissionCount!: number;

  restartGame() {
    this.$emit("restart-game");
  }
}
</script>

<style lang="scss" scoped></style>
