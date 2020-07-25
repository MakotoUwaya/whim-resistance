<template>
  <v-container>
    <template v-if="isAccessUserLeader">
      <span class="subtitle"
        >ミッションを<br />遂行するメンバーを<br />選んでください</span
      >
    </template>
    <template v-else>
      <span class="subtitle"
        >リーダーの<br />メンバー選択が終わるまで<br />お待ちください...</span
      >
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class SelectPlayer extends Vue {
  @Prop({ type: Boolean, default: false }) isAccessUserLeader!: boolean;
}
</script>

<style lang="scss" scoped></style>
