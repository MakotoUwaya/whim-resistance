<template>
  <v-container class="pa-0 ma-0">
    <!-- ゲーム開始前 待機状態 -->
    <div v-if="!isGameStarted" class="me">
      <player-robby v-if="!isPlayerReady" :game-state="gameState" />
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
      <player-vote :game-state="gameState" />
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
        v-if="isMissionApprove && isAccessUserLeader"
        color="secondary"
        class="my-4"
        @click="checkVote"
        >ミッション開始！</v-btn
      >
      <v-btn
        v-else-if="isAccessUserLeader"
        color="secondary"
        class="my-4"
        @click="nextMission"
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
      <mission-execute :game-state="gameState" />
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
      <v-btn
        v-if="isAccessUserLeader"
        color="secondary"
        class="my-4"
        @click="nextPhase"
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
import { Component, Prop, Vue } from "vue-property-decorator";
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
  @Prop({ type: Object, required: true }) gameState!: GameState;

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
    return this.gameState.currentLeader?.id === this.$whim.accessUser.id;
  }
  get canMissionVote() {
    return this.gameState.canCurrentMissionVote;
  }
  get isAccessUserVoted() {
    return this.gameState.isCurrentMissionPlayerVoted(this.$whim.accessUser.id);
  }
  get isVoteComplete() {
    return this.gameState.isCurrentMissionVoteComplete;
  }
  get isMissionApprove() {
    return this.gameState.isCurrentMissionApprove;
  }
  get missionApprovedCount() {
    return this.gameState.currentMissionApprovedCount;
  }
  get missionDisapprovedCount() {
    return this.gameState.currentMissionDisapprovedCount;
  }
  get canMissionExecute() {
    return this.gameState.canCurrentMissionExecute;
  }
  get isMissionMember() {
    return this.gameState.isCurrentMissionMember(this.$whim.accessUser.id);
  }
  get isAccessUserExecuted() {
    return this.gameState.isCurrentMissionPlayerExecuted(
      this.$whim.accessUser.id
    );
  }
  get isMissionComplete() {
    return this.gameState.isCurrentMissionExecuteComplete;
  }
  get isMissionSuccess() {
    return this.gameState.isCurrentMissionSuccess;
  }
  get missionSuccessCount() {
    return this.gameState.currentMissionSuccessCount;
  }
  get missionFailCount() {
    return this.gameState.currentMissionFailCount;
  }
  get canStartNextPhase() {
    return this.gameState.canStartNextPhase;
  }

  get successMissionCount() {
    return this.gameState.successMissionCount;
  }
  get failMissionCount() {
    return this.gameState.failMissionCount;
  }
  get isGameover() {
    return this.gameState.isGameover;
  }
  get isResistanceWin() {
    return this.gameState.isResistanceWin;
  }
  get isSpyWin() {
    return this.gameState.isSpyWin;
  }

  checkVote() {
    this.$whim.assignState({ currentVoteChecked: true });
  }
  nextMission() {
    this.gameState.next();
    this.$whim.assignState(this.gameState.state);
  }
  nextPhase() {
    this.$whim.assignState({ currentMissionResultChecked: true });
    this.gameState.next();
    this.$whim.assignState(this.gameState.state);
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
