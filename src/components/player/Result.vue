<template>
  <div>
    <v-btn class="ma-2" fab large dark color="secondary">
      <span class="text-h5">{{ point }}</span>
    </v-btn>
  </div>
</template>
<script>
export default {
  name: "Result",
  props: {
    displayUser: {
      type: Object,
      required: true,
    },
  },
  computed: {
    point() {
      return this.$whim.state[this.displayUser.id];
    },
  },
};
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
