<template>
  <div>
    <v-btn class="ma-2" fab large dark color="secondary">
      <span class="text-h5">{{ point }}</span>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User } from "@/types/User";

@Component
export default class ResultView extends Vue {
  @Prop({ type: Object, required: true }) displayUser!: User;

  get point() {
    return this.$whim.state[this.displayUser.id];
  }
}
</script>

<style lang="scss" scoped>
.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
</style>
