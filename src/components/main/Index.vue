<template>
  <v-container class="pa-0 ma-0">
    <template v-if="isVisibleTimer">
      <component
        :is="'count-down-timer'"
        :is-abort="!isVisibleTimer"
        :game-state="gameState"
        :remain-time="currentRemainTime"
        @time-up="timeUp"
      />
    </template>
    <!-- ゲーム開始前 待機状態 -->
    <div v-if="stepWaiting" class="me">
      <player-robby v-if="!isPlayerReady" :game-state="gameState" />
      <div v-else>
        <span class="subtitle"
          >他のプレイヤーが<br />準備ができるまで<br />お待ちください...</span
        >
      </div>
    </div>
    <!-- リーダーがミッション遂行メンバーを選択 -->
    <div v-else-if="stepSelecting" class="me">
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
    <div v-else-if="stepVoting && !isAccessUserVoted" class="me">
      <player-vote :game-state="gameState" />
    </div>
    <!-- 投票結果確認 -->
    <div v-else-if="stepVoted" class="me">
      <v-col cols="12">
        <span class="subtitle">
          {{ isMissionApprove ? "承認" : "否認" }}<br />
          ○： {{ missionApprovedCount }} vs ×： {{ missionDisapprovedCount }}
          <span v-if="missionCountExceeded"
            ><br /><br />連続否認で<br />ミッションが失敗しました</span
          >
        </span>
      </v-col>
      <template v-if="isAccessUserLeader">
        <v-btn
          v-if="isMissionApprove"
          color="secondary"
          class="my-4"
          @click="checkVote"
          >ミッション開始！</v-btn
        >
        <v-btn v-else color="secondary" class="my-4" @click="nextMission">{{
          missionCountExceeded ? "次のフェーズへ" : "リーダー交代！"
        }}</v-btn>
      </template>
    </div>
    <!-- ミッション開始 -->
    <div
      v-else-if="stepExecuting && isMissionMember && !isAccessUserExecuted"
      class="me"
    >
      <mission-execute :game-state="gameState" />
    </div>
    <!-- ミッション結果確認 -->
    <div v-else-if="stepExecuted" class="me">
      <v-col cols="12">
        <span class="subtitle">
          {{ isMissionSuccess ? "ミッション成功" : "ミッション失敗" }}<br />
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
    <div v-else-if="stepFinish" class="me">
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
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { CurrentStep, GameState } from "@/utils/GameState";
import CountDownTimer, {
  oneMinute,
} from "@/components/main/CountDownTimer.vue";
import PlayerRobby from "@/components/main/PlayerRobby.vue";
import PlayerVote from "@/components/main/PlayerVote.vue";
import MissionExecute from "@/components/main/MissionExecute.vue";

@Component({
  components: {
    PlayerRobby,
    PlayerVote,
    MissionExecute,
    CountDownTimer,
  },
})
export default class MainView extends Vue {
  remainTime = 9999;

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

  get accessUserID() {
    return this.$whim.accessUser.id;
  }
  get isPlayerReady() {
    return this.gameState.getPlayer(this.accessUserID)?.canStarted || false;
  }
  get isAccessUserLeader() {
    return this.gameState.currentLeader?.id === this.accessUserID;
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
  changedStep(newStep: CurrentStep, oldStep: CurrentStep) {
    if (newStep === oldStep) {
      return;
    }
    switch (newStep) {
      case "選択":
        this.remainTime = 5;
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
  checkVote() {
    this.$whim.assignState({ currentVoteChecked: true });
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
  reset() {
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

.countdown {
  position: absolute;
  top: 5vh;
  left: 50vw;
  transform: translate(-50%, -50%);
  text-align: center;
  background: #000000;
  color: #fff;
  padding: 5px;
  margin: 0px;
  font: 40px "f5.6";
  width: 140px;
}
</style>
