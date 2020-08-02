<template>
  <v-row class="justify-center">
    <v-img :src="approveResultImage" :max-width="200" />
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User } from "@/types/User";

@Component
export default class ApproveResult extends Vue {
  @Prop({ type: Object, required: true }) displayUser!: User;
  @Prop({ type: Boolean }) isApprove?: boolean;

  get approveResultImage() {
    return require(`../../assets/mark_${
      this.isApprove ? "maru" : "batsu"
    }.png`);
  }
}
</script>

<style lang="scss" scoped></style>
