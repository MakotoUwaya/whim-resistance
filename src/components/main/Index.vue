<template>
  <v-container class="pa-0 ma-0">
    <!-- ゲーム開始前 待機状態 -->
    <div v-if="!isGameStarted" class="me">
      <player-robby v-if="!isPlayerReady" />
      <div v-else>
        <span class="subtitle"
          >他のプレイヤーが<br />準備ができるまで<br />お待ちください...</span
        >
      </div>
    </div>
    <!-- リーダーがミッション遂行メンバーを選択 -->
    <div v-else-if="isGameStarted && !canMissionVote" class="me">
      <div v-if="isAccessUserLeader">
        <span class="subtitle"
          >ミッションを<br />遂行するメンバーを<br />選んでください</span
        >
      </div>
      <div v-else>
        <span class="subtitle"
          >リーダーの<br />メンバー選択が終わるまで<br />お待ちください...</span
        >
      </div>
    </div>
    <!-- メンバー確定 投票 -->
    <div v-else-if="isGameStarted && !isAccessUserVoted" class="me">
      <player-vote />
    </div>
    <!-- 投票結果確認 -->
    <div
      v-else-if="isVoteComplete && isMissionMember && !canMissionExecute"
      class="me"
    >
      <v-col cols="12">
        <span class="subtitle">
          {{ isMissionApprove ? "承認" : "否認" }}<br />
          ○： {{ missionApprovedCount }} vs ×： {{ missionDisapprovedCount }}
        </span>
      </v-col>
      <v-btn
        v-if="isMissionApprove"
        color="secondary"
        class="my-4"
        @click="checkVote"
        >ミッション開始！</v-btn
      >
      <v-btn v-else color="secondary" class="my-4" @click="nextMission"
        >リーダー交代！</v-btn
      >
    </div>
    <!-- ミッション開始 -->
    <div
      v-else-if="
        canMissionExecute && !isAccessUserExecuted && !isMissionComplete
      "
      class="me"
    >
      <mission-execute />
    </div>
    <!-- ミッション結果確認 -->
    <div
      v-else-if="isMissionComplete && !canStartNextPhase && !isGameover"
      class="me"
    >
      <v-col cols="12">
        <span class="subtitle">
          {{ isMissionSuccess ? "成功" : "失敗" }}<br />
          成功： {{ missionSuccessCount }} vs 失敗： {{ missionFailCount }}
        </span>
      </v-col>
      <v-btn color="secondary" class="my-4" @click="nextPhase"
        >次のミッションへ</v-btn
      >
    </div>
    <!-- 最終結果確認 -->
    <div v-else-if="isGameover" class="me">
      <v-col cols="12">
        <span class="subtitle">
          {{ isResistanceWin ? "レジスタンスの勝ち！" : "スパイの勝ち！"
          }}<br />
          {{ successMissionCount }} vs {{ failMissionCount }}
        </span>
      </v-col>
      <v-btn color="secondary" class="my-4" @click="reset">もう一度！</v-btn>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { GameState } from "@/utils/GameState";
import PlayerRobby from "@/components/main/PlayerRobby.vue";
import PlayerVote from "@/components/main/PlayerVote.vue";
import MissionExecute from "@/components/main/MissionExecute.vue";

@Component({
  components: {
    PlayerRobby,
    PlayerVote,
    MissionExecute,
  },
})
export default class MainView extends Vue {
  get isPlayerReady() {
    if (!this.$whim.state.players || !this.$whim.accessUser.id) return false;
    const player = this.$whim.state.players?.find(
      (p) => p.id === this.$whim.accessUser.id
    );
    if (!player) {
      throw new Error("プレイヤー情報が取得できません");
    }
    return player.canStarted;
  }
  get isGameStarted() {
    return this.$whim.state.isStarted;
  }
  get isAccessUserLeader() {
    const gameState = new GameState(this.$whim.state);
    return gameState.currentLeader?.id === this.$whim.accessUser.id;
  }
  get canMissionVote() {
    const gameState = new GameState(this.$whim.state);
    return gameState.canCurrentMissionVote;
  }
  get isAccessUserVoted() {
    const gameState = new GameState(this.$whim.state);
    return gameState.isCurrentMissionPlayerVoted(this.$whim.accessUser.id);
  }
  get isVoteComplete() {
    const gameState = new GameState(this.$whim.state);
    return gameState.isCurrentMissionVoteComplete;
  }
  get isMissionApprove() {
    const gameState = new GameState(this.$whim.state);
    return gameState.isCurrentMissionApprove;
  }
  get missionApprovedCount() {
    const gameState = new GameState(this.$whim.state);
    return gameState.currentMissionApprovedCount;
  }
  get missionDisapprovedCount() {
    const gameState = new GameState(this.$whim.state);
    return gameState.currentMissionDisapprovedCount;
  }
  get canMissionExecute() {
    const gameState = new GameState(this.$whim.state);
    return gameState.canCurrentMissionExecute;
  }
  get isMissionMember() {
    const gameState = new GameState(this.$whim.state);
    return gameState.isCurrentMissionMember(this.$whim.accessUser.id);
  }
  get isAccessUserExecuted() {
    const gameState = new GameState(this.$whim.state);
    return gameState.isCurrentMissionPlayerExecuted(this.$whim.accessUser.id);
  }
  get isMissionComplete() {
    const gameState = new GameState(this.$whim.state);
    return gameState.isCurrentMissionExecuteComplete;
  }
  get isMissionSuccess() {
    const gameState = new GameState(this.$whim.state);
    return gameState.isCurrentMissionSuccess;
  }
  get missionSuccessCount() {
    const gameState = new GameState(this.$whim.state);
    return gameState.currentMissionSuccessCount;
  }
  get missionFailCount() {
    const gameState = new GameState(this.$whim.state);
    return gameState.currentMissionFailCount;
  }
  get canStartNextPhase() {
    const gameState = new GameState(this.$whim.state);
    return gameState.canStartNextPhase;
  }

  get successMissionCount() {
    const gameState = new GameState(this.$whim.state);
    return gameState.successMissionCount;
  }
  get failMissionCount() {
    const gameState = new GameState(this.$whim.state);
    return gameState.failMissionCount;
  }
  get isGameover() {
    const gameState = new GameState(this.$whim.state);
    return gameState.isGameover;
  }
  get isResistanceWin() {
    const gameState = new GameState(this.$whim.state);
    return gameState.isResistanceWin;
  }
  get isSpyWin() {
    const gameState = new GameState(this.$whim.state);
    return gameState.isSpyWin;
  }

  checkVote() {
    this.$whim.assignState({ currentVoteChecked: true });
  }
  nextMission() {
    const gameState = new GameState(this.$whim.state);
    gameState.next();
    this.$whim.assignState(gameState.state);
  }
  nextPhase() {
    this.$whim.assignState({ currentMissionResultChecked: true });

    const gameState = new GameState(this.$whim.state);
    gameState.next();
    this.$whim.assignState(gameState.state);
  }
  reset() {
    this.$emit("restart-game");
  }
}
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

.subtitle {
  font-weight: 300;
  font-size: 30px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.result {
  font-weight: 500;
  font-size: 60px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
</style>
