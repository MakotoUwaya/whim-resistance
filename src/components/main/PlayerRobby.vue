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
import { Component, Vue } from "vue-property-decorator";
import { GameState } from "@/utils/GameState";

@Component
export default class PlayerRobby extends Vue {
  startGame() {
    const gameState = new GameState(this.$whim.state);
    gameState.setCanStartedPlayer(this.$whim.accessUser.id);
    gameState.startGame();
    this.$whim.assignState(gameState.state);
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
