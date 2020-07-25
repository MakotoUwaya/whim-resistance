<template>
  <v-container>
    <span class="subtitle">準備ができたら<br />ボタンを押してください</span>
    <v-col cols="12">
      <v-btn
        class="ma-4"
        x-large
        dark
        rounded
        color="primary"
        @click="startGame"
      >
        <span class="text-h5">ゲーム開始</span>
      </v-btn>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { GameState } from "@/utils/GameState";

@Component
export default class PlayerRobby extends Vue {
  @Prop({ type: Object, required: true }) gameState!: GameState;

  startGame() {
    this.gameState.setCanStartedPlayer(this.$whim.accessUser.id);
    this.gameState.startGame();
    this.$whim.assignState(this.gameState.state);
  }
}
</script>

<style lang="scss" scoped></style>
