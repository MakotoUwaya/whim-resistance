<template>
  <v-container>
    <v-row class="justify-center">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-img :src="resultImage" :max-width="300" v-bind="attrs" v-on="on" />
        </template>
        <div class="text-center">
          <span>
            {{ isMissionApprove ? "承認" : "否認" }}<br />
            {{ missionApprovedCount }} vs {{ missionDisapprovedCount }}
          </span>
        </div>
      </v-tooltip>
    </v-row>
    <v-col cols="12">
      <span v-if="missionCountExceeded" class="subtitle"
        >5連続否認で<br />ミッション失敗...！</span
      >
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

  get resultImage() {
    return require(`../../assets/${
      this.isMissionApprove ? "approved" : "disapproved"
    }.png`);
  }

  checkVote() {
    this.$emit("check-vote");
  }
  nextMission() {
    this.$emit("next-mission");
  }
}
</script>

<style lang="scss" scoped></style>
