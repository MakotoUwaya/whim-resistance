<template>
  <div>
    <v-btn
      class="ma-2"
      fab
      x-large
      dark
      color="primary"
      :disabled="isMissionMember"
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
  @Prop({ type: Object, required: true }) gameState!: GameState;
  @Prop({ type: Object, required: true }) displayUser!: User;

  get isMissionMember() {
    return this.gameState.isCurrentMissionMember(this.displayUser.id);
  }

  select() {
    this.gameState.addCurrentMissionMember(this.displayUser.id);
    this.$whim.assignState(this.gameState.state);
  }
}
</script>

<style lang="scss" scoped></style>
