<template>
  <v-row class="justify-center">
    <v-btn class="ma-2" fab x-large dark color="primary" @click="toPublic">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class PublicMissionStatus extends Vue {
  toPublic() {
    this.$emit("public-status");
  }
}
</script>

<style lang="scss" scoped></style>
