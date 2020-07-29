<template>
  <v-card class="mx-auto" max-width="350" :elevation="10">
    <v-img :src="cardImage" />
    <v-card-text class="pa-1"
      >リーダーは他のプレイヤーに<br />カードを分配してください</v-card-text
    >
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Card } from "@/types";

@Component
export default class PlotCard extends Vue {
  @Prop({ type: Object, required: true }) plotCard!: Card;

  get cardImage() {
    return require(`../../assets/${this.plotCard.image}`);
  }
}
</script>

<style lang="scss" scoped></style>
