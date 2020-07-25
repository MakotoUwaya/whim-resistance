<template>
  <div class="text-center">
    <template v-if="isPlayerExecuted">
      <span class="subtitle">遂行済み</span>
      <v-progress-linear :height="7" color="primary" rounded value="100" />
    </template>
    <template v-else>
      <span class="subtitle">遂行中...</span>
      <v-progress-linear :height="7" color="accent" rounded indeterminate />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ExecutingStatus extends Vue {
  @Prop({ type: Boolean, required: true }) isPlayerExecuted!: boolean;
}
</script>

<style lang="scss" scoped></style>
