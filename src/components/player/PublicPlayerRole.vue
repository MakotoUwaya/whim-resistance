<template>
  <v-row class="justify-center">
    <v-tooltip v-if="isPublicRole && isObserver" top>
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
        {{ observablePlayer.player.role === "spy" ? "スパイ" : "レジスタンス" }}
      </div>
    </v-tooltip>

    <v-img
      v-else-if="isPublicRole"
      src="../../assets/mark_question.png"
      :max-width="200"
    />
    <v-btn
      v-else-if="isObserver"
      class="ma-2"
      fab
      x-large
      dark
      color="primary"
      @click="publicObserver"
    >
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Player } from "@/types";

@Component
export default class PublicPlayerRole extends Vue {
  isCardUser = false;

  @Prop({ type: Boolean, default: false }) isObserver!: boolean;
  @Prop({ type: Object, default: false }) observablePlayer!: {
    player: Player;
    isPublic: boolean;
  };

  get isPublicRole() {
    return this.observablePlayer.isPublic;
  }
  get roleImage() {
    return require(`../../assets/${this.observablePlayer.player.image}`);
  }

  publicObserver() {
    this.observablePlayer.isPublic = true;
    this.$emit("public-observer");
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
