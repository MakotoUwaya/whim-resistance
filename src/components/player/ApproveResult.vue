<template>
  <div>
    <v-btn class="ma-2" fab large dark color="secondary">
      <span class="text-h4">{{ isApprove ? "○" : "×" }}</span>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User } from "@/types/User";

@Component
export default class ApproveResult extends Vue {
  @Prop({ type: Object, required: true }) displayUser!: User;
  @Prop({ type: Boolean, required: true }) isApprove!: boolean;
}
</script>

<style lang="scss" scoped></style>
