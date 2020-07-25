<template>
  <v-container :class="{ border: isLeader }">
    <!-- 役割表示 -->
    <div
      v-if="(stepFinish && isSpyUser) || (isSpy && isSpyUser)"
      class="role-mark"
    >
      <span v-if="isMe">あなたは </span>スパイ です
    </div>
    <div v-else-if="stepFinish || (!stepWaiting && isMe)" class="role-mark">
      <span v-if="isMe">あなたは </span>レジスタンス です
    </div>
    <!-- ミッションメンバー表示 -->
    <mission-member v-if="isMissionPlayerAdded" />

    <!-- ゲーム開始前 待機状態 -->
    <!-- リーダーがミッション遂行メンバーを選択 -->
    <select-player
      v-if="stepSelecting && isAccessUserLeader"
      class="container"
      :display-user="displayUser"
      :game-state="gameState"
    />
    <!-- メンバー確定 投票 -->
    <template v-else-if="stepVoting && isAccessUserVoted">
      <h2 v-if="isPlayerVoted" class="subtitle">
        投票済み
      </h2>
      <h2 v-else class="subtitle">
        投票中...
      </h2>
    </template>
    <!-- 投票結果確認 -->
    <approve-result
      v-else-if="stepVoted"
      :display-user="displayUser"
      :is-approve="isPlayerApprove"
      :game-state="gameState"
    />
    <!-- ミッション開始 -->
    <!-- ミッション結果確認 -->
    <template
      v-else-if="stepExecuting && isAccessUserExecuted && isMissionMember"
    >
      <h2 v-if="isPlayerExecuted" class="subtitle">
        遂行済み
      </h2>
      <h2 v-else class="subtitle">
        遂行中...
      </h2>
    </template>
    <!-- 最終結果確認 -->
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User } from "@/types/User";
import { GameState } from "@/utils/GameState";
import ApproveResult from "@/components/player/ApproveResult.vue";
import SelectPlayer from "@/components/player/SelectPlayer.vue";
import MissionMember from "@/components/player/MissionMember.vue";

@Component({
  components: {
    ApproveResult,
    SelectPlayer,
    MissionMember,
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
  get isSpy() {
    return this.gameState.isSpyPlayer(this.accessUserID);
  }
  get isSpyUser() {
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
    return this.gameState.isCurrentMissionPlayerAdded(this.displayUser.id);
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

.leader-mark {
  margin: auto;
  position: absolute;
  justify-content: center;
  top: 50px;
  text-align: center;
}

.role-mark {
  margin: auto;
  position: absolute;
  justify-content: center;
  top: 80px;
  text-align: center;
}

.border {
  box-sizing: border-box;
  border-radius: 20px;
  border-width: 10px;
  box-shadow: 0 0 0 10px #67c5ff inset;
}
</style>
