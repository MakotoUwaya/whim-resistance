<template>
  <v-container
    :class="{
      resistance:
        (!isLeader || stepFinish) && !stepWaiting && isVisibleResistance,
      spy: (!isLeader || stepFinish) && !stepWaiting && isVisibleSpy,
      leader: !stepFinish && isLeader,
    }"
  >
    <!-- 役割表示 -->
    <role-mark
      v-if="!stepWaiting"
      :is-visible-resistance="isVisibleResistance"
      :is-visible-spy="isVisibleSpy"
      :display-player="displayPlayer"
    />

    <!-- 所有カード表示 -->
    <owned-cards
      v-if="isDisplayUserCards.length > 0"
      :plot-cards="isDisplayUserCards"
      :current-timing="currentTiming"
      :is-game-over="stepFinish"
      :is-me="isMe"
      @using-card="usingCard"
    />

    <!-- ミッションメンバー表示 -->
    <mission-member
      v-if="!stepFinish && isMissionPlayerAdded"
      :is-spot-light-player="isSpotLightPlayer"
    />

    <!-- ゲーム開始前 待機状態 -->
    <!-- リーダーが陰謀カードを渡す -->
    <select-plot-card-owner
      v-if="timingBeforeDistribute && isAccessUserLeader && !isLeader"
      class="container"
      :display-player="displayPlayer"
      :game-state="gameState"
    />
    <!-- カード利用者が立ち聞き対象を選ぶ -->
    <public-player-role
      v-else-if="stepObserve && observablePlayer"
      :is-observer="isObserver"
      :observable-player="observablePlayer"
      @public-observer="publicObserver"
      @check-role="checkRole"
    />
    <!-- 情報開示対象を選ぶ -->
    <open-up-role
      v-else-if="stepOpenUp && openUpTargetPlayer"
      :is-open-up="!!openUpViewer"
      :is-open-up-selector="isOpenUpSelector"
      :is-open-up-target="isOpenUpTarget"
      :is-open-up-viewer="isOpenUpViewer"
      :open-up-target-player="openUpTargetPlayer"
      @set-open-up="setOpenUp"
      @check-role="checkRole"
    />
    <!-- リーダーがミッション遂行メンバーを選択 -->
    <select-player
      v-else-if="!timingBeforeDistribute && stepSelecting && isAccessUserLeader"
      class="container"
      :display-user="displayUser"
      :game-state="gameState"
    />
    <!-- メンバー確定 投票 -->
    <voting-early-status
      v-else-if="stepEarlyVoting || (stepVoting && !isAccessUserVoted)"
      :is-early-leader="isEarlyLeader"
      :is-approve="isPlayerApprove"
      :is-player-voted="isPlayerVoted"
    />
    <voting-status
      v-else-if="stepVoting && isAccessUserVoted"
      :is-early-leader="isEarlyLeader"
      :is-approve="isPlayerApprove"
      :is-player-voted="isPlayerVoted"
    />
    <!-- 投票結果確認 -->
    <approve-result
      v-else-if="stepVoted"
      :display-user="displayUser"
      :is-approve="isPlayerApprove"
      :game-state="gameState"
    />
    <!-- ミッション開始 -->
    <public-mission-status
      v-else-if="
        timingBeforeExcecute &&
        hasInTheSpotlightCard &&
        isMissionMember &&
        !isMe
      "
      @public-status="publicStatus"
    />
    <executing-status
      v-else-if="
        stepExecuting &&
        ((!isMe && isMissionMember) || (isMe && isAccessUserExecuted))
      "
      :is-player-executed="isPlayerExecuted"
    />
    <!-- ミッション結果確認 -->
    <public-mission-result
      v-else-if="stepExecuted && isMissionMember"
      :is-spot-light-player="isSpotLightPlayer"
      :can-public="hasKeepingCloseEyeOnYouCard"
      :is-mission-player-success="isMissionPlayerSuccess"
      :is-public-result="isPublicMissionMember"
      :is-me="isMe"
      @public-result="publicResult"
    />
    <!-- 最終結果確認 -->
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Card } from "@/types";
import { User } from "@/types/User";
import { GameState } from "@/utils/GameState";
import RoleMark from "@/components/player/RoleMark.vue";
import OwnedCards from "@/components/player/OwnedCards.vue";
import MissionMember from "@/components/player/MissionMember.vue";
import SelectPlotCardOwner from "@/components/player/SelectPlotCardOwner.vue";
import PublicPlayerRole from "@/components/player/PublicPlayerRole.vue";
import OpenUpRole from "@/components/player/OpenUpRole.vue";
import SelectPlayer from "@/components/player/SelectPlayer.vue";
import VotingEarlyStatus from "@/components/player/VotingEarlyStatus.vue";
import VotingStatus from "@/components/player/VotingStatus.vue";
import ApproveResult from "@/components/player/ApproveResult.vue";
import ExecutingStatus from "@/components/player/ExecutingStatus.vue";
import PublicMissionStatus from "@/components/player/PublicMissionStatus.vue";
import PublicMissionResult from "@/components/player/PublicMissionResult.vue";

@Component({
  components: {
    RoleMark,
    OwnedCards,
    MissionMember,
    SelectPlotCardOwner,
    PublicPlayerRole,
    OpenUpRole,
    SelectPlayer,
    VotingEarlyStatus,
    VotingStatus,
    ApproveResult,
    ExecutingStatus,
    PublicMissionStatus,
    PublicMissionResult,
  },
})
export default class PlayerView extends Vue {
  @Prop({ type: Object, required: true }) gameState!: GameState;
  @Prop({ type: Object, required: true }) displayUser!: User;

  get accessUserID() {
    return this.$whim.accessUser.id;
  }
  get currentStep() {
    return this.gameState.currentStep;
  }
  get stepWaiting() {
    return this.currentStep === "待機";
  }
  get stepSelecting() {
    return this.currentStep === "選択";
  }
  get stepObserve() {
    return this.currentStep === "立ち聞き";
  }
  get stepOpenUp() {
    return this.currentStep === "情報開示";
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
  get isMe() {
    return this.accessUserID === this.displayUser.id;
  }
  get displayPlayer() {
    return this.gameState.getPlayer(this.displayUser.id);
  }
  get accessPlayer() {
    return this.gameState.getPlayer(this.accessUserID);
  }
  get isVisibleResistance() {
    return (
      (this.stepFinish && !this.isDisplayUserSpy) ||
      (!this.isAccessUserSpy && this.isMe)
    );
  }
  get isVisibleSpy() {
    return (
      (this.stepFinish && this.isDisplayUserSpy) ||
      (this.isAccessUserSpy && this.isDisplayUserSpy)
    );
  }
  get isAccessUserSpy() {
    return this.gameState.isSpyPlayer(this.accessUserID);
  }
  get isDisplayUserSpy() {
    return this.gameState.isSpyPlayer(this.displayUser.id);
  }
  get isLeader() {
    return this.gameState.currentLeader?.id === this.displayUser.id;
  }
  get isAccessUserLeader() {
    return this.gameState.currentLeader?.id === this.accessUserID;
  }
  get isDisplayUserCards() {
    return this.gameState.getOwnedCards(this.displayUser.id);
  }
  get observablePlayer() {
    return this.gameState.state.canOverheardConversation?.find(
      (p) => p.player.id === this.displayUser.id
    );
  }
  get isObserver() {
    return this.gameState.state.currentCardUser?.id === this.accessUserID;
  }
  get openUpTargetPlayer() {
    return this.gameState.state.currentCardUser;
  }
  get openUpViewer() {
    return this.gameState.state.openUpViewer;
  }
  get isOpenUpSelector() {
    return (
      this.openUpTargetPlayer &&
      this.openUpTargetPlayer.id === this.accessUserID &&
      !this.isMe
    );
  }
  get isOpenUpTarget() {
    return (
      !!this.openUpTargetPlayer &&
      this.openUpTargetPlayer.id === this.displayUser.id
    );
  }
  get isOpenUpViewer() {
    return !!this.openUpViewer && this.openUpViewer.id === this.accessUserID;
  }
  get isAccessUserVoted() {
    return this.gameState.isCurrentMissionPlayerVoted(this.accessUserID);
  }
  get isPlayerVoted() {
    return this.gameState.isCurrentMissionPlayerVoted(this.displayUser.id);
  }
  get isEarlyLeader() {
    return this.gameState.isEarlyLeader(this.displayUser.id);
  }
  get isMissionPlayerAdded() {
    return this.gameState.isCurrentMissionMember(this.displayUser.id);
  }
  get isPlayerApprove() {
    return this.gameState.isCurrentMissionPlayerApprove(this.displayUser.id);
  }
  get isMissionMember() {
    return this.gameState.isCurrentMissionMember(this.displayUser.id);
  }
  get isAccessUserExecuted() {
    return this.gameState.isCurrentMissionPlayerExecuted(this.accessUserID);
  }
  get isPlayerExecuted() {
    return this.gameState.isCurrentMissionPlayerExecuted(this.displayUser.id);
  }
  get isMissionPlayerSuccess() {
    return this.gameState.isCurrentMissionPlayerSuccess(this.displayUser.id);
  }
  get hasKeepingCloseEyeOnYouCard() {
    return this.gameState.hasKeepingCloseEyeOnYouCard(this.accessUserID);
  }
  get hasInTheSpotlightCard() {
    return this.gameState.hasInTheSpotlightCard(this.accessUserID);
  }
  get isPublicMissionMember() {
    return this.gameState.isPublicCurrentMissionMember(this.displayUser.id);
  }
  get isSpotLightPlayer() {
    return this.gameState.spotLightPlayer?.id === this.displayUser.id;
  }

  usingCard(card: Card) {
    this.gameState.usingCard(card, this.accessPlayer);
    this.$whim.assignState(this.gameState.state);
  }
  publicObserver() {
    this.$whim.assignState(this.gameState.state);
  }
  checkRole() {
    this.gameState.state.canOverheardConversation = null;
    this.gameState.state.currentCardUser = null;
    this.gameState.state.openUpViewer = null;
    this.gameState.state.openUpExecuting = false;
    this.$whim.assignState(this.gameState.state);
  }
  setOpenUp() {
    this.gameState.state.openUpViewer = this.displayPlayer;
    this.$whim.assignState(this.gameState.state);
  }
  publicStatus() {
    const card = this.accessPlayer?.cards?.find(
      (c) => !c.used && c.name === "注目の的"
    );
    if (!card) return;
    this.gameState.usingCard(card, this.accessPlayer, this.displayPlayer);
    this.$whim.assignState(this.gameState.state);
  }
  publicResult() {
    const card = this.accessPlayer?.cards?.find(
      (c) => !c.used && c.name === "監視者"
    );
    if (!card) return;
    this.gameState.usingCard(card, this.accessPlayer, this.displayPlayer);
    this.$whim.assignState(this.gameState.state);
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

.leader {
  box-sizing: border-box;
  border-radius: 20px;
  border-width: 10px;
  box-shadow: 0 0 0 10px #edc32f inset;
}

.resistance {
  box-sizing: border-box;
  border-radius: 20px;
  border-width: 10px;
  box-shadow: 0 0 0 10px #1f76dd inset;
}

.spy {
  box-sizing: border-box;
  border-radius: 20px;
  border-width: 10px;
  box-shadow: 0 0 0 10px #ff5252 inset;
}
</style>
