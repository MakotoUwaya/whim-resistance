<template>
  <h2 v-if="isPlayerExecuted" class="subtitle">
    遂行済み
  </h2>
  <h2 v-else class="subtitle">
    遂行中...
  </h2>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ExecutingStatus extends Vue {
  @Prop({ type: Boolean, required: true }) isPlayerExecuted!: boolean;
}
</script>

<style lang="scss" scoped></style>
