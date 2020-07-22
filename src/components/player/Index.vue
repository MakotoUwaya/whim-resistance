<template>
  <div class="container">
    <result-view v-if="isAllSelected" :display-user="displayUser" />
    <h2 v-else-if="isAccessUserSelected && isSelected" class="subtitle">
      選択済み
    </h2>
    <h2 v-else-if="isAccessUserSelected" class="subtitle">
      選択中
    </h2>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ResultView from "@/components/player/Result.vue";
import { User } from "@/types/User";

@Component({
  components: {
    ResultView,
  },
})
export default class PlayerView extends Vue {
  @Prop({ type: Object, required: true }) displayUser!: User;

  get users() {
    return this.$whim.users;
  }
  get isMe() {
    return this.$whim.accessUser.id === this.displayUser.id;
  }
  get isAccessUserSelected() {
    return !!this.$whim.state[this.$whim.accessUser.id];
  }
  get isSelected() {
    return !!this.$whim.state[this.displayUser.id];
  }
  get isAllSelected() {
    return (
      this.users.length > 0 &&
      this.users.every((user) => this.$whim.state[user.id])
    );
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
</style>
