<template>
  <v-carousel
    class="player-cards"
    height="300"
    hide-delimiter-background
    :show-arrows-on-hover="hasMultipleCards"
    :show-arrows="hasMultipleCards"
  >
    <v-carousel-item v-for="card in plotCards" :key="card.id">
      <v-card
        class="mx-auto"
        max-width="350"
        :elevation="10"
        @click="selectedCard(card)"
      >
        <v-img :src="convertImage(card.image)" />
        <v-card-actions class="pa-2">
          <v-spacer></v-spacer>
          <v-btn v-if="hasResponsibilityCard" text>
            これにする
          </v-btn>
          <v-btn v-else text>選択中...</v-btn>
        </v-card-actions>
      </v-card>
    </v-carousel-item>
  </v-carousel>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Card } from "@/types";

@Component
export default class ChoicePlotCard extends Vue {
  @Prop({ type: Array, required: true }) plotCards!: Card[];
  @Prop({ type: Boolean, required: true }) hasResponsibilityCard!: boolean;

  get hasMultipleCards() {
    return this.plotCards.length > 1;
  }

  convertImage(imagePath: string) {
    return imagePath ? require(`../../assets/${imagePath}`) : "";
  }

  selectedCard(card: Card) {
    if (!this.hasResponsibilityCard) return;
    this.$emit("selected-card", card);
  }
}
</script>

<style lang="scss" scoped></style>
