<template>
  <div>
    <v-btn
      class="ma-2"
      fab
      x-large
      dark
      color="primary"
      :disabled="isUserAdded"
      @click="select"
    >
      <v-icon>mdi-account-plus</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User } from "@/types/User";
import { GameState } from "@/utils/GameState";

@Component
export default class SelectPlayer extends Vue {
  @Prop({ type: Object, required: true }) displayUser!: User;

  get isUserAdded() {
    const gameState = new GameState(this.$whim.state);
    return gameState.isCurrentMissionPlayerAdded(this.displayUser.id);
  }

  select() {
    const gameState = new GameState(this.$whim.state);
    const player = gameState.getPlayer(this.displayUser.id);
    if (!player) {
      throw new Error("プレイヤー情報が取得できません");
    }
    gameState.addCurrentMissionMember(player);
    this.$whim.assignState(gameState.state);
  }
}
</script>

<style lang="scss" scoped>
.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
</style>
