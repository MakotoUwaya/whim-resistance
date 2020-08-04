<template>
  <div class="member-mark">
    <v-btn
      class="ma-2"
      fab
      x-large
      dark
      :color="isSpotLightPlayer ? 'error' : 'success'"
    >
      <v-icon>mdi-bullseye-arrow</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class MissionMember extends Vue {
  @Prop({ type: Boolean, default: false }) isSpotLightPlayer?: boolean;
}
</script>

<style lang="scss" scoped>
.member-mark {
  margin: auto;
  position: absolute;
  justify-content: center;
  top: 200px;
  text-align: center;
}
</style>
