<template>
  <v-container class="pa-0 ma-0">
    <!-- カウントダウンタイマー -->
    <component
      :is="'count-down-timer'"
      v-if="isVisibleTimer"
      :is-abort="!isVisibleTimer"
      :game-state="gameState"
      :remain-time="currentRemainTime"
      @time-up="timeUp"
    />
    <!-- ゲーム開始前 待機状態 -->
    <player-robby
      v-if="stepWaiting"
      class="me"
      :is-player-ready="isPlayerReady"
      @start-game="startGame"
    />
    <!-- リーダーが陰謀カードを渡す -->
    <plot-card
      v-else-if="timingBeforeDistribute"
      class="me"
      :plot-card="currentPlotCard"
    />
    <!-- リーダーが陰謀カードを渡す -->
    <choice-plot-card
      v-else-if="stepChoiceCard"
      class="me"
      :plot-cards="allPlayerTakenPlotCards"
      :has-responsibility-card="hasResponsibilityCard"
      @selected-card="selectedCard"
    />
    <!-- リーダーがミッション遂行メンバーを選択 -->
    <select-player
      v-else-if="stepSelecting"
      class="me"
      :is-access-user-leader="isAccessUserLeader"
    />
    <!-- メンバー確定 投票 -->
    <player-vote
      v-else-if="!isAccessUserVoted && (isEarlyLeader || stepVoting)"
      class="me"
      @voting="voting"
    />
    <!-- 投票結果確認 -->
    <vote-result
      v-else-if="stepVoted"
      class="me"
      :is-mission-approve="isMissionApprove"
      :mission-approved-count="missionApprovedCount"
      :mission-disapproved-count="missionDisapprovedCount"
      :mission-count-exceeded="missionCountExceeded"
      :is-access-user-leader="isAccessUserLeader"
      @check-vote="checkVote"
      @next-mission="nextMission"
    />
    <!-- ミッション開始 -->
    <mission-execute
      v-else-if="stepExecuting && isMissionMember && !isAccessUserExecuted"
      class="me"
      :is-spy="isSpy"
      @mission-execute="missionExecute"
    />
    <!-- ミッション結果確認 -->
    <mission-result
      v-else-if="stepExecuted"
      class="me"
      :is-mission-success="isMissionSuccess"
      :mission-success-count="missionSuccessCount"
      :mission-fail-count="missionFailCount"
      :is-access-user-leader="isAccessUserLeader"
      @next-phase="nextPhase"
    />
    <!-- 最終結果確認 -->
    <game-result
      v-else-if="stepFinish"
      class="me"
      :is-resistance-win="isResistanceWin"
      :success-mission-count="successMissionCount"
      :fail-mission-count="failMissionCount"
      @restart-game="restartGame"
    />

    <v-snackbar :value="showUsingCard" color="primary" rounded="pill" top>
      {{ currentCardUser.name }} が {{ currentCard.name }} を使いました
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Card } from "@/types";
import { Step, GameState } from "@/utils/GameState";
import CountDownTimer, {
  oneMinute,
} from "@/components/main/CountDownTimer.vue";
import PlayerRobby from "@/components/main/PlayerRobby.vue";
import PlotCard from "@/components/main/PlotCard.vue";
import SelectPlayer from "@/components/main/SelectPlayer.vue";
import ChoicePlotCard from "@/components/main/ChoicePlotCard.vue";
import PlayerVote from "@/components/main/PlayerVote.vue";
import VoteResult from "@/components/main/VoteResult.vue";
import MissionExecute from "@/components/main/MissionExecute.vue";
import MissionResult from "@/components/main/MissionResult.vue";
import GameResult from "@/components/main/GameResult.vue";

@Component({
  components: {
    CountDownTimer,
    PlayerRobby,
    PlotCard,
    SelectPlayer,
    ChoicePlotCard,
    PlayerVote,
    VoteResult,
    MissionExecute,
    MissionResult,
    GameResult,
  },
})
export default class MainView extends Vue {
  remainTime = 9999;
  showUsingCard = false;

  @Prop({ type: Object, required: true }) gameState!: GameState;

  get currentStep() {
    return this.gameState.currentStep;
  }
  get stepWaiting() {
    return this.currentStep === "待機";
  }
  get stepSelecting() {
    return this.currentStep === "選択";
  }
  get stepChoiceCard() {
    return this.currentStep === "カード選択";
  }
  get stepEarlyVoting() {
    return this.currentStep === "早期投票";
  }
  get stepVoting() {
    return this.currentStep === "投票";
  }
  get stepVoted() {
    return this.currentStep === "投票確認";
  }
  get stepExecuting() {
    return this.currentStep === "遂行";
  }
  get stepExecuted() {
    return this.currentStep === "遂行確認";
  }
  get stepFinish() {
    return this.currentStep === "終了";
  }

  get currentTiming() {
    return this.gameState.currentTiming;
  }
  get timingBeforeDistribute() {
    return this.currentTiming === "配布前";
  }
  get timingBeforeSelect() {
    return this.currentTiming === "選択前";
  }
  get timingBeforeVote() {
    return this.currentTiming === "投票前";
  }
  get timingAfterVote() {
    return this.currentTiming === "投票後";
  }
  get timingBeforeExcecute() {
    return this.currentTiming === "遂行前";
  }
  get timingAfterExcecute() {
    return this.currentTiming === "遂行後";
  }

  get currentPlotCard() {
    return this.gameState.currentPhasePlotCard;
  }
  get currentCardUser() {
    return this.gameState.state.currentCardUser || {};
  }
  get currentCard() {
    return this.gameState.state.currentCard || {};
  }
  get accessUserID() {
    return this.$whim.accessUser.id;
  }
  get isAccessUserLeader() {
    return this.gameState.currentLeader?.id === this.accessUserID;
  }
  get isEarlyLeader() {
    return this.gameState.isEarlyLeader(this.accessUserID);
  }
  get isPlayerReady() {
    return this.gameState.getPlayer(this.accessUserID)?.canStarted || false;
  }
  get isSpy() {
    return this.gameState.isSpyPlayer(this.accessUserID);
  }
  get allPlayerTakenPlotCards() {
    return this.gameState.state.allPlayerTakenPlotCards;
  }
  get hasResponsibilityCard() {
    return this.gameState.hasResponsibilityCard(this.accessUserID);
  }
  get isAccessUserVoted() {
    return this.gameState.isCurrentMissionPlayerVoted(this.accessUserID);
  }
  get missionCountExceeded() {
    return this.gameState.currentPhaseMissionCountExceeded;
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
  get isMissionMember() {
    return this.gameState.isCurrentMissionMember(this.accessUserID);
  }
  get isAccessUserExecuted() {
    return this.gameState.isCurrentMissionPlayerExecuted(this.accessUserID);
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
  get successMissionCount() {
    return this.gameState.successMissionCount;
  }
  get failMissionCount() {
    return this.gameState.failMissionCount;
  }
  get isResistanceWin() {
    return this.gameState.isResistanceWin;
  }
  get isSpyWin() {
    return this.gameState.isSpyWin;
  }

  get currentRemainTime() {
    return (this.remainTime || 9999) * oneMinute;
  }
  get isVisibleTimer() {
    return (
      !this.gameState.state.isTimerHidden &&
      this.currentRemainTime !== 9999 * oneMinute
    );
  }

  @Watch("currentStep")
  changedStep(newStep: Step, oldStep: Step) {
    if (newStep === oldStep) {
      return;
    }
    switch (newStep) {
      case "選択":
        this.remainTime = 5;
        break;
      case "早期投票":
        this.remainTime = 1;
        break;
      case "投票":
        this.remainTime = 3;
        break;
      case "投票確認":
        this.remainTime = 3;
        break;
      case "遂行":
        this.remainTime = 1;
        break;
      case "遂行確認":
        this.remainTime = 3;
        break;
      default:
        this.$whim.assignState({ isTimerHidden: true });
        return;
    }
    this.timerRestart();
  }

  @Watch("currentCard.id")
  onChangedCurrentCard(newCard: Card | undefined, oldCard: Card | undefined) {
    console.log("newCard", newCard?.id, "oldCard", oldCard?.id);
    this.showUsingCard = newCard ? newCard.id === oldCard?.id : false;
  }

  timerRestart() {
    if (!this.isAccessUserLeader) {
      return;
    }
    this.$whim.assignState({ isTimerHidden: true });
    this.$whim.assignState({ isTimerHidden: false });
  }

  timeUp() {
    if (!this.isAccessUserLeader) return;
    switch (this.gameState.currentStep) {
      case "選択":
        this.gameState.autoSelectMissionMember();
        this.assignState();
        break;
      case "早期投票":
        this.gameState.autoEarlyVote();
        this.assignState();
        break;
      case "投票":
        this.gameState.autoVote();
        this.assignState();
        break;
      case "投票確認":
        if (this.isMissionApprove) {
          this.checkVote();
        } else {
          this.nextMission();
        }
        break;
      case "遂行":
        this.gameState.autoExecute();
        this.assignState();
        break;
      case "遂行確認":
        this.nextPhase();
        break;
    }
  }
  selectedCard(card: Card) {
    this.gameState.moveCard(card, this.accessUserID);
    this.assignState();
  }
  voting(approve: boolean) {
    this.gameState.currentMissionVote(this.accessUserID, approve);
    this.assignState();
  }
  checkVote() {
    this.$whim.assignState({ currentVoteChecked: true });
  }
  missionExecute(result: boolean) {
    this.gameState.currentMissionExecute(this.accessUserID, result);
    this.assignState();
  }
  next() {
    this.gameState.next();
    this.assignState();
  }
  nextMission() {
    this.next();
  }
  nextPhase() {
    this.$whim.assignState({ currentMissionResultChecked: true });
    this.next();
  }
  startGame() {
    try {
      this.gameState.setCanStartedPlayer(this.accessUserID);
      this.gameState.startGame();
    } catch (error) {
      console.warn(error);
    } finally {
      this.$whim.assignState(this.gameState.state);
    }
  }
  restartGame() {
    this.$emit("restart-game");
  }
  assignState() {
    this.$whim.assignState(this.gameState.state);
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
</style>
