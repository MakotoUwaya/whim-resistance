<template>
  <v-container>
    <v-col cols="12">
      <span class="subtitle">
        {{ isMissionApprove ? "承認" : "否認" }}<br />
        ○： {{ missionApprovedCount }} vs ×： {{ missionDisapprovedCount }}
        <span v-if="missionCountExceeded"
          ><br /><br />連続否認で<br />ミッションが失敗しました</span
        >
      </span>
    </v-col>
    <template v-if="isAccessUserLeader">
      <v-btn
        v-if="isMissionApprove"
        color="secondary"
        class="my-4"
        @click="checkVote"
        >ミッション開始！</v-btn
      >
      <v-btn v-else color="secondary" class="my-4" @click="nextMission">{{
        missionCountExceeded ? "次のフェーズへ" : "リーダー交代！"
      }}</v-btn>
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class VoteResult extends Vue {
  @Prop({ type: Boolean, default: false }) isMissionApprove!: boolean;
  @Prop({ type: Number, default: 0 }) missionApprovedCount!: number;
  @Prop({ type: Number, default: 0 }) missionDisapprovedCount!: number;
  @Prop({ type: Boolean, default: false }) missionCountExceeded!: boolean;
  @Prop({ type: Boolean, default: false }) isAccessUserLeader!: boolean;

  checkVote() {
    this.$emit("check-vote");
  }
  nextMission() {
    this.$emit("next-mission");
  }
}
</script>

<style lang="scss" scoped></style>
