<template>
  <v-carousel
    class="player-cards"
    height="230"
    hide-delimiter-background
    :show-arrows-on-hover="hasMultipleCards"
    :show-arrows="hasMultipleCards"
  >
    <v-carousel-item v-for="card in plotCards" :key="card.id">
      <v-img
        :src="convertImage(card.image)"
        contain
        max-height="200"
        @click="openCardDialog(card)"
      >
        <div
          :class="{ 'fill-height': true, 'bottom-gradient': card.used }"
        ></div>
      </v-img>
      <div class="pager"></div>
    </v-carousel-item>
    <v-dialog v-if="selectedCard && !isGameOver" v-model="showUsingCardDialog">
      <v-card class="mx-auto" max-width="350" :elevation="10">
        <v-img :src="convertImage(selectedCard.image)" />
        <v-card-actions class="pa-1">
          <v-spacer></v-spacer>
          <template v-if="canUsingCard">
            <v-btn color="gray" text @click="showUsingCardDialog = false">
              やめる
            </v-btn>
            <v-btn color="primary" @click="usingCard">
              使用する
            </v-btn>
          </template>
          <v-btn v-else color="gray" text @click="showUsingCardDialog = false">
            閉じる
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      :value="showTimingErrorSnackbar"
      color="warning"
      rounded="pill"
      bottom
    >
      このカードは利用できません。
    </v-snackbar>
  </v-carousel>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Card } from "@/types";
import { GameState } from "@/utils/GameState";

@Component
export default class OwnedCards extends Vue {
  showUsingCardDialog = false;
  showTimingErrorSnackbar = false;
  selectedCard: Card = {} as Card;

  @Prop({ type: Array, default: [] }) plotCards!: Card[];
  @Prop({ type: String, default: "" }) currentTiming!: string;
  @Prop({ type: Boolean, required: true }) isGameOver!: boolean;
  @Prop({ type: Boolean, required: true }) isMe!: boolean;

  get hasMultipleCards() {
    return this.plotCards.length > 1;
  }
  get canUsingCard() {
    return (
      this.isMe &&
      !this.selectedCard.used &&
      this.selectedCard.timing === this.currentTiming &&
      this.selectedCard.oneTime
    );
  }

  convertImage(imagePath: string) {
    return imagePath ? require(`../../assets/${imagePath}`) : "";
  }
  openCardDialog(card: Card) {
    this.selectedCard = card || ({} as Card);
    this.showUsingCardDialog = true;
    this.showTimingErrorSnackbar = false;
  }
  usingCard() {
    try {
      this.$emit("using-card", this.selectedCard);
    } catch {
      this.showTimingErrorSnackbar = true;
    } finally {
      this.showUsingCardDialog = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.player-cards {
  margin: auto;
  position: absolute;
  left: 10px;
  bottom: 20px;
  max-width: 300px;
  text-align: center;
}

.pager {
  height: 30px;
}

.bottom-gradient {
  background-image: linear-gradient(
    to top right,
    rgba(100, 115, 201, 0.33),
    rgba(25, 32, 72, 0.7)
  );
}
</style>
