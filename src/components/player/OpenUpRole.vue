<template>
  <v-row class="justify-center">
    <v-tooltip v-if="isOpenUp && isOpenUpViewer && isOpenUpTarget" top>
      <template v-slot:activator="{ on, attrs }">
        <v-img
          class="image-button"
          :src="roleImage"
          :max-width="200"
          v-bind="attrs"
          @click="checkRole"
          v-on="on"
        />
      </template>
      <div class="text-center">
        {{ openUpTargetPlayer.role === "spy" ? "スパイ" : "レジスタンス" }}
      </div>
    </v-tooltip>
    <v-img
      v-else-if="isOpenUp && isOpenUpTarget"
      src="../../assets/mark_question.png"
      :max-width="200"
    />
    <v-btn
      v-else-if="!isOpenUp && isOpenUpSelector"
      class="ma-2"
      fab
      x-large
      dark
      color="primary"
      @click="setOpenUp"
    >
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Player } from "@/types";

@Component
export default class OpenUpRole extends Vue {
  isCardUser = false;

  @Prop({ type: Boolean, default: false }) isOpenUp!: boolean;
  @Prop({ type: Boolean, default: false }) isOpenUpSelector!: boolean;
  @Prop({ type: Boolean, default: false }) isOpenUpTarget!: boolean;
  @Prop({ type: Boolean, default: false }) isOpenUpViewer!: boolean;
  @Prop({ type: Object, default: false }) openUpTargetPlayer!: Player;

  get roleImage() {
    return require(`../../assets/${this.openUpTargetPlayer.image}`);
  }

  setOpenUp() {
    this.$emit("set-open-up");
  }
  checkRole() {
    this.$emit("check-role");
  }
}
</script>

<style lang="scss" scoped>
.image-button {
  cursor: pointer;
}
</style>
