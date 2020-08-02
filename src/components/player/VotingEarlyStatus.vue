<template>
  <div class="text-center">
    <template v-if="isEarlyLeader">
      <v-row class="justify-center">
        <v-img :src="approveResultImage" :max-width="200" />
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class VotingEarlyStatus extends Vue {
  @Prop({ type: Boolean, required: true }) isEarlyLeader!: boolean;
  @Prop({ type: Boolean }) isApprove?: boolean;

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
