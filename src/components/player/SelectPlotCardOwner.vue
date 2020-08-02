<template>
  <div>
    <v-btn
      class="ma-2"
      fab
      x-large
      dark
      color="primary"
      :disabled="isAssigined"
      @click="ownedCard"
    >
      <v-icon>mdi-card-plus</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Card, Player } from "@/types";
import { GameState } from "@/utils/GameState";

@Component
export default class SelectPlotCardOwner extends Vue {
  isAssigined = false;

  @Prop({ type: Object, required: true }) gameState!: GameState;
  @Prop({ type: Object, required: true }) displayPlayer!: Player;
  @Prop({ type: Boolean, default: false }) isAccessUserLeader!: boolean;

  ownedCard() {
    const card = this.gameState.currentPhasePlotCard;
    if (!card) return;
    this.gameState.ownedCard(this.displayPlayer.id, card);
    if (!card.oneTime || card.timing === "即時") {
      this.gameState.usingCard(card, this.displayPlayer);
    }
    this.$whim.assignState(this.gameState.state);

    // NOTE: リーダーの選択可能ボタンだけ非表示にできれば良いので、状態は共有していない
    this.isAssigined = true;
  }
}
</script>

<style lang="scss" scoped></style>
