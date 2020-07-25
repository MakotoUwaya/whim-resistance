<template>
  <v-container>
    <v-row class="justify-center">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-img :src="resultImage" :max-width="300" v-bind="attrs" v-on="on" />
        </template>
        <div class="text-center">
          <span>
            {{ isMissionSuccess ? "ミッション成功" : "ミッション失敗" }}<br />
            {{ missionSuccessCount }} vs {{ missionFailCount }}
          </span>
        </div>
      </v-tooltip>
    </v-row>
    <v-btn
      v-if="isAccessUserLeader"
      color="secondary"
      class="my-4"
      @click="nextPhase"
      >次のミッションへ</v-btn
    >
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class MissionResult extends Vue {
  @Prop({ type: Boolean, default: false }) isMissionSuccess!: boolean;
  @Prop({ type: Number, default: 0 }) missionSuccessCount!: number;
  @Prop({ type: Number, default: 0 }) missionFailCount!: number;
  @Prop({ type: Boolean, default: false }) isAccessUserLeader!: boolean;

  get resultImage() {
    return require(`../../assets/${
      this.isMissionSuccess ? "success" : "fail"
    }.png`);
  }

  nextPhase() {
    this.$emit("next-phase");
  }
}
</script>

<style lang="scss" scoped></style>
