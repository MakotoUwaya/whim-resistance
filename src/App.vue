<template>
  <v-app>
    <main-view class="main" :game-state="gameState" @restart-game="restart" />
    <player-view
      v-for="user in users"
      :key="user.id"
      :class="whimUserWindowClass(user)"
      :display-user="user"
      :game-state="gameState"
    />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { User } from "@/types/User";
import { GameState } from "@/utils/GameState";
import MainView from "@/views/main/Index.vue";
import PlayerView from "@/views/player/Index.vue";

@Component({
  components: {
    MainView,
    PlayerView,
  },
})
export default class App extends Vue {
  get gameState() {
    return new GameState(this.$whim.state);
  }
  get users() {
    return this.$whim.users;
  }

  /** デバッグ表示 */
  debugView() {
    const recaptchaScript = document.createElement("script");
    recaptchaScript.setAttribute("src", "http://localhost:8098");
    document.head.appendChild(recaptchaScript);
  }

  mounted() {
    // this.debugView();
  }

  @Watch("users")
  addPlayers(newUsers: User[], oldUsers: User[]) {
    if (newUsers.length === oldUsers.length) {
      return;
    }
    console.info("Change users:", newUsers, oldUsers);
    for (const user of newUsers) {
      this.gameState.addPlayer(user);
    }
    this.$whim.assignState(this.gameState.state);
  }

  restart() {
    this.$whim.resetState();
    this.addPlayers(this.users, []);
  }
}
</script>

<style lang="scss">
.theme--light.v-application {
  background: none !important;
}

.main {
  position: relative;
  z-index: 1;
}

.subtitle {
  font-weight: 300;
  font-size: 30px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.image-button {
  cursor: pointer;
}
</style>
