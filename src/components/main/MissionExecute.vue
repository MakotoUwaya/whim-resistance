<template>
  <v-container>
    <span class="subtitle">ミッションを遂行してください</span>
    <v-col cols="12">
      <v-btn
        class="ma-4"
        x-large
        dark
        large
        color="success"
        @click="execute('成功')"
      >
        <span class="text-h3">○</span>
      </v-btn>
      <v-btn
        class="ma-4"
        x-large
        dark
        large
        color="error"
        @click="execute('失敗')"
      >
        <span class="text-h3">×</span>
      </v-btn>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { GameState } from "@/utils/GameState";

@Component
export default class MissionExecute extends Vue {
  execute(result: "成功" | "失敗") {
    const gameState = new GameState(this.$whim.state);
    const player = gameState.getPlayer(this.$whim.accessUser.id);
    if (!player) {
      throw new Error("プレイヤー情報が取得できません");
    }
    gameState.currentMissionExecute(player, result === "成功");
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
