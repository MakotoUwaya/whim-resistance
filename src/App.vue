<template>
  <v-app>
    <main-view class="main" />
    <player-view
      v-for="user in $whim.users"
      :key="user.id"
      :class="whimUserWindowClass(user)"
      :display-user="user"
    />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MainView from "@/components/main/Index.vue";
import PlayerView from "@/components/player/Index.vue";

@Component({
  components: {
    MainView,
    PlayerView,
  },
})
export default class App extends Vue {
  get users() {
    return this.$whim.users;
  }

  // settings for debug
  // mounted() {
  //   const recaptchaScript = document.createElement("script");
  //   recaptchaScript.setAttribute("src", "http://localhost:8098");
  //   document.head.appendChild(recaptchaScript);
  // }
}
</script>

<style lang="scss" scoped>
.theme--light.v-application {
  background: none;
}

.main {
  position: relative;
  z-index: 1;
}
</style>
