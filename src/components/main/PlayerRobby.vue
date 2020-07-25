<template>
  <v-container>
    <template v-if="!isPlayerReady">
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
    </template>
    <template v-else>
      <span class="subtitle"
        >他のプレイヤーが<br />準備ができるまで<br />お待ちください...</span
      >
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class PlayerRobby extends Vue {
  @Prop({ type: Boolean, default: false }) isPlayerReady!: boolean;

  startGame() {
    this.$emit("start-game");
  }
}
</script>

<style lang="scss" scoped></style>
