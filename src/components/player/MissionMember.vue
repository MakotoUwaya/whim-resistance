<template>
  <div v-if="isUserAdded" class="member-mark">
    <v-btn class="ma-2" fab x-large dark color="success">
      <v-icon>mdi-bullseye-arrow</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User } from "@/types/User";
import { GameState } from "@/utils/GameState";

@Component
export default class MissionMember extends Vue {
  @Prop({ type: Object, required: true }) gameState!: GameState;
  @Prop({ type: Object, required: true }) displayUser!: User;

  get isUserAdded() {
    return this.gameState.isCurrentMissionPlayerAdded(this.displayUser.id);
  }
}
</script>

<style lang="scss" scoped>
.member-mark {
  margin: auto;
  position: absolute;
  justify-content: center;
  bottom: 50px;
  text-align: center;
}
</style>
