<template>
  <v-tooltip v-if="isVisibleSpy" top>
    <template v-slot:activator="{ on, attrs }">
      <v-img
        class="role-mark"
        :src="playerImageFilePath"
        :max-width="150"
        v-bind="attrs"
        v-on="on"
      />
    </template>
    <div class="text-center">スパイ</div>
  </v-tooltip>
  <v-tooltip v-else-if="isVisibleResistance" top>
    <template v-slot:activator="{ on, attrs }">
      <v-img
        class="role-mark"
        :src="playerImageFilePath"
        :max-width="150"
        v-bind="attrs"
        v-on="on"
      />
    </template>
    <div class="text-center">レジスタンス</div>
  </v-tooltip>
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
