<template>
  <div class="text-center">
    <template v-if="isEarlyLeader">
      <v-row class="justify-center">
        <v-img :src="approveResultImage" :max-width="200" />
      </v-row>
    </template>
    <template v-else-if="isPlayerVoted">
      <span class="subtitle">投票済み</span>
      <v-progress-linear :height="7" color="primary" rounded value="100" />
    </template>
    <template v-else>
      <span class="subtitle">投票中...</span>
      <v-progress-linear :height="7" color="accent" rounded indeterminate />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class VotingStatus extends Vue {
  @Prop({ type: Boolean, required: true }) isEarlyLeader!: boolean;
  @Prop({ type: Boolean }) isApprove?: boolean;
  @Prop({ type: Boolean, required: true }) isPlayerVoted!: boolean;

  get approveResultImage() {
    if (this.isApprove === undefined) {
      return require("../../assets/mark_question.png");
    }
    return require(`../../assets/mark_${
      this.isApprove ? "maru" : "batsu"
    }.png`);
  }
}
</script>

<style lang="scss" scoped></style>
