<template>
  <v-container>
    <span class="subtitle">ミッションを<br />遂行してください</span>
    <v-row class="justify-center">
      <v-img
        :class="{ 'image-button': true, 'mr-8': isSpy }"
        src="../../assets/mark_maru.png"
        :max-width="150"
        @click="missionExecute('成功')"
      />
      <v-img
        v-if="isSpy"
        :class="{ 'image-button': true, 'ml-8': isSpy }"
        src="../../assets/mark_batsu.png"
        :max-width="150"
        @click="missionExecute('失敗')"
      />
    </v-row>
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
