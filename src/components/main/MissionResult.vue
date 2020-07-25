<template>
  <v-container>
    <v-col cols="12">
      <span class="subtitle">
        {{ isMissionSuccess ? "ミッション成功" : "ミッション失敗" }}<br />
        成功： {{ missionSuccessCount }} vs 失敗： {{ missionFailCount }}
      </span>
    </v-col>
    <v-btn
      v-if="isAccessUserLeader"
      color="secondary"
      class="my-4"
      @click="nextPhase"
      >次のミッションへ</v-btn
    >
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class MissionResult extends Vue {
  @Prop({ type: Boolean, default: false }) isMissionSuccess!: boolean;
  @Prop({ type: Number, default: 0 }) missionSuccessCount!: number;
  @Prop({ type: Number, default: 0 }) missionFailCount!: number;
  @Prop({ type: Boolean, default: false }) isAccessUserLeader!: boolean;

  nextPhase() {
    this.$emit("next-phase");
  }
}
</script>

<style lang="scss" scoped></style>
