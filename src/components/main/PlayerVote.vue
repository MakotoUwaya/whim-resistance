<template>
  <v-container>
    <span class="subtitle">投票してください</span>
    <v-col cols="12">
      <v-btn class="ma-4" fab dark large color="primary" @click="select('○')">
        <span class="text-h4">○</span>
      </v-btn>
      <v-btn class="ma-4" fab dark large color="primary" @click="select('×')">
        <span class="text-h4">×</span>
      </v-btn>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { GameState } from "@/utils/GameState";

@Component
export default class PlayerVote extends Vue {
  select(approve: "○" | "×") {
    const gameState = new GameState(this.$whim.state);
    const player = gameState.getPlayer(this.$whim.accessUser.id);
    if (!player) {
      throw new Error("プレイヤー情報が取得できません");
    }
    gameState.currentMissionVote(player, approve === "○");
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
