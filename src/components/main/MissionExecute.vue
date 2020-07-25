<template>
  <v-container>
    <span class="subtitle">ミッションを遂行してください</span>
    <v-col cols="12">
      <v-btn
        class="ma-4"
        x-large
        dark
        large
        color="success"
        @click="missionExecute('成功')"
      >
        <span class="text-h3">○</span>
      </v-btn>
      <v-btn
        v-if="isSpy"
        class="ma-4"
        x-large
        dark
        large
        color="error"
        @click="missionExecute('失敗')"
      >
        <span class="text-h3">×</span>
      </v-btn>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { GameState } from "@/utils/GameState";

@Component
export default class MissionExecute extends Vue {
  @Prop({ type: Boolean, default: false }) isSpy!: boolean;

  missionExecute(result: "成功" | "失敗") {
    this.$emit("mission-execute", result === "成功");
  }
}
</script>

<style lang="scss" scoped></style>
