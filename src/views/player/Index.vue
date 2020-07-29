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

    <!-- ミッションメンバー表示 -->
    <mission-member v-if="!stepFinish && isMissionPlayerAdded" />

    <!-- ゲーム開始前 待機状態 -->
    <!-- リーダーがミッション遂行メンバーを選択 -->
    <select-player
      v-if="stepSelecting && isAccessUserLeader"
      class="container"
      :display-user="displayUser"
      :game-state="gameState"
    />
    <!-- メンバー確定 投票 -->
    <voting-status
      v-else-if="stepVoting && isAccessUserVoted"
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
    <!-- ミッション結果確認 -->
    <executing-status
      v-else-if="stepExecuting && isAccessUserExecuted && isMissionMember"
      :is-player-executed="isPlayerExecuted"
    />
    <!-- 最終結果確認 -->
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User } from "@/types/User";
import { GameState } from "@/utils/GameState";
import RoleMark from "@/components/player/RoleMark.vue";
import MissionMember from "@/components/player/MissionMember.vue";
import SelectPlayer from "@/components/player/SelectPlayer.vue";
import VotingStatus from "@/components/player/VotingStatus.vue";
import ApproveResult from "@/components/player/ApproveResult.vue";
import ExecutingStatus from "@/components/player/ExecutingStatus.vue";

@Component({
  components: {
    RoleMark,
    MissionMember,
    SelectPlayer,
    VotingStatus,
    ApproveResult,
    ExecutingStatus,
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
  get isMe() {
    return this.accessUserID === this.displayUser.id;
  }
  get displayPlayer() {
    return this.gameState.getPlayer(this.displayUser.id);
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
  get isAccessUserVoted() {
    return this.gameState.isCurrentMissionPlayerVoted(this.accessUserID);
  }
  get isPlayerVoted() {
    return this.gameState.isCurrentMissionPlayerVoted(this.displayUser.id);
  }
  get isMissionPlayerAdded() {
    return this.gameState.isCurrentMissionMember(this.displayUser.id);
  }
  get isPlayerApprove() {
    return (
      this.gameState.isCurrentMissionPlayerApprove(this.displayUser.id) || false
    );
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
