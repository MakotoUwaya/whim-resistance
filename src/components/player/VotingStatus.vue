<template>
  <h2 v-if="isPlayerVoted" class="subtitle">
    投票済み
  </h2>
  <h2 v-else class="subtitle">
    投票中...
  </h2>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class VotingStatus extends Vue {
  @Prop({ type: Boolean, required: true }) isPlayerVoted!: boolean;
}
</script>

<style lang="scss" scoped></style>
