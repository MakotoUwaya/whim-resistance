<template>
  <div class="score-board">
    <v-chip color="black white--text"
      >Res {{ successMissionCount }} vs {{ failMissionCount }} Spy</v-chip
    ><br />
    <v-icon
      v-for="i in currentMissionIndex"
      :key="`brack_${i}`"
      color="brack"
      small
      >mdi-checkbox-blank-circle</v-icon
    >
    <v-icon
      v-for="i in (5 - currentMissionIndex)"
      :key="`grey_${i}`"
      color="grey lighten-3"
      small
      >mdi-checkbox-blank-circle</v-icon
    >
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ScoreBoard extends Vue {
  @Prop({ type: Number, default: 0 }) successMissionCount!: number;
  @Prop({ type: Number, default: 0 }) failMissionCount!: number;
  @Prop({ type: Number, default: 1 }) currentMissionIndex!: number;
}
</script>

<style lang="scss" scoped>
.score-board {
  position: absolute;
  top: 14vh;
  left: 50vw;
  transform: translate(-50%, -50%);
  text-align: center;
  margin: 0px;
  width: 200px;
}
</style>
