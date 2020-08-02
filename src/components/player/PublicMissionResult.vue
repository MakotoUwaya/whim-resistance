<template>
  <v-row class="justify-center">
    <v-img
      v-if="isPublicResult && isCardUser"
      :src="missionResultImage"
      :max-width="200"
    />
    <v-img
      v-else-if="isPublicResult"
      src="../../assets/mark_question.png"
      :max-width="200"
    />
    <v-btn
      v-else-if="canPublic && !isMe"
      class="ma-2"
      fab
      x-large
      dark
      color="primary"
      @click="publicResult"
    >
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class PublicMissionResult extends Vue {
  isCardUser = false;

  @Prop({ type: Boolean, default: false }) isMissionPlayerSuccess!: boolean;
  @Prop({ type: Boolean, default: false }) canPublic!: boolean;
  @Prop({ type: Boolean, default: false }) isPublicResult!: boolean;
  @Prop({ type: Boolean, default: false }) isMe!: boolean;

  get missionResultImage() {
    return require(`../../assets/mark_${
      this.isMissionPlayerSuccess ? "maru" : "batsu"
    }.png`);
  }

  publicResult() {
    this.isCardUser = true;
    this.$emit("public-result");
  }
}
</script>

<style lang="scss" scoped></style>
