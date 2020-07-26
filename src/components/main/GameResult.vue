<template>
  <v-container>
    <v-row class="justify-center">
      <v-img :src="resultImage" :max-width="400" v-bind="attrs" v-on="on" />
    </v-row>
    <v-row class="justify-center">
      <span class="subtitle">
        {{ isResistanceWin ? "レジスタンスの勝ち！" : "スパイの勝ち！" }}<br />
        {{ successMissionCount }} vs {{ failMissionCount }}
      </span>
    </v-row>
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

  get resultImage() {
    return require(`../../assets/${
      this.isResistanceWin ? "success" : "fail"
    }.png`);
  }

  restartGame() {
    this.$emit("restart-game");
  }
}
</script>

<style lang="scss" scoped></style>
