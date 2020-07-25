<template>
  <v-img
    v-if="isVisibleSpy"
    class="role-mark"
    :src="playerImageFilePath"
    :max-width="150"
  />
  <v-img
    v-else-if="isVisibleResistance"
    class="role-mark"
    :src="playerImageFilePath"
    :max-width="150"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Player } from "@/types";

@Component
export default class RoleMark extends Vue {
  @Prop({ type: Boolean, default: false }) isVisibleResistance!: boolean;
  @Prop({ type: Boolean, default: false }) isVisibleSpy!: boolean;
  @Prop({ type: Object, required: true }) displayPlayer!: Player;

  get playerImageFilePath() {
    return require(`../../assets/${this.displayPlayer.image}`);
  }
}
</script>

<style lang="scss" scoped>
.role-mark {
  margin: auto;
  position: absolute;
  justify-content: center;
  right: 20px;
  bottom: 40px;
  text-align: center;
}
</style>
