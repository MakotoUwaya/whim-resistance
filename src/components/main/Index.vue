<template>
  <v-container class="pa-0 ma-0">
    <div v-if="isAllSelected" class="me">
      <h2>
        <v-btn class="ma-2" fab x-large dark color="accent">
          <span class="text-h4">{{ average }}</span>
        </v-btn>
      </h2>
      <v-btn color="secondary" class="my-4" @click="reset">続ける</v-btn>
    </div>
    <Me v-if="!isAccessUserSelected" class="me" />
  </v-container>
</template>

<script>
export default {
  name: "Main",
  components: {
    Me: () => import("@/components/main/Me"),
  },
  computed: {
    users() {
      return this.$whim.users;
    },
    isAllSelected() {
      return (
        this.users.length > 0 &&
        this.users.every((user) => this.$whim.state[user.id])
      );
    },
    // TODO: 平均値を表示するか、最大値を表示するか設定できるようにする
    average() {
      let sum = 0;
      for (const user of this.users) {
        sum += Number(this.$whim.state[user.id]);
      }
      return sum / this.users.length;
    },
    isAccessUserSelected() {
      return !!this.$whim.state[this.$whim.accessUser.id];
    },
  },
  methods: {
    reset() {
      this.$whim.resetState();
    },
  },
};
</script>

<style lang="scss" scoped>
.me {
  position: absolute;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 400px;
}

.result {
  font-weight: 500;
  font-size: 60px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
</style>
