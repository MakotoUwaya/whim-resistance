<template>
  <v-container>
    <!-- ゲーム開始前 待機状態 -->
    <!-- リーダーがミッション遂行メンバーを選択 -->
    <div v-if="isLeader" class="leader-mark">
      <span>{{ displayUser.name }} がリーダーですよ</span>
    </div>
    <div v-if="isSpy && isSpyUser" class="role-mark">
      <span v-if="isSpy">あなたは</span>
      <span>スパイ です</span>
    </div>
    <div v-else-if="isMe" class="role-mark">
      <span>あなたは レジスタンス です</span>
    </div>
    <select-player
      v-if="isAccessUserLeader && !canMissionVote"
      class="container"
      :display-user="displayUser"
    />
    <!-- メンバー確定 投票 -->
    <mission-member
      v-if="canMissionVote"
      class="container"
      :display-user="displayUser"
    />
    <!-- 投票結果確認 -->
    <template v-if="!canMissionExecute && !isGameover">
      <approve-result
        v-if="isVoteComplete"
        :display-user="displayUser"
        :is-approve="isPlayerApprove"
      />
      <h2 v-else-if="isAccessUserVoted && isPlayerVoted" class="subtitle">
        投票済み
      </h2>
      <h2 v-else-if="isAccessUserVoted" class="subtitle">
        投票中...
      </h2>
    </template>
    <!-- ミッション開始 -->
    <!-- ミッション結果確認 -->
    <template v-if="!canStartNextPhase && !isGameover">
      <h2 v-if="isPlayerExecuted && !isMissionComplete" class="subtitle">
        遂行済み
      </h2>
      <h2
        v-else-if="isAccessUserExecuted && !isMissionComplete"
        class="subtitle"
      >
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
  @Prop({ type: Object, required: true }) displayUser!: User;

  get isMe() {
    return this.$whim.accessUser.id === this.displayUser.id;
  }
  get isSpy() {
    return this.checkSpyUser(this.$whim.accessUser.id);
  }
  get isSpyUser() {
    return this.checkSpyUser(this.displayUser.id);
  }
  get currentPhase() {
    const gameState = new GameState(this.$whim.state);
    return gameState.currentPhase;
  }
  get isLeader() {
    const gameState = new GameState(this.$whim.state);
    return gameState.currentLeader?.id === this.displayUser.id;
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
  get isPlayerVoted() {
    const gameState = new GameState(this.$whim.state);
    return gameState.isCurrentMissionPlayerVoted(this.displayUser.id);
  }
  get isPlayerApprove() {
    const gameState = new GameState(this.$whim.state);
    return (
      gameState.isCurrentMissionPlayerApprove(this.displayUser.id) || false
    );
  }
  get isVoteComplete() {
    const gameState = new GameState(this.$whim.state);
    return gameState.isCurrentMissionVoteComplete || false;
  }
  get canMissionExecute() {
    const gameState = new GameState(this.$whim.state);
    return gameState.canCurrentMissionExecute;
  }
  get isAccessUserExecuted() {
    const gameState = new GameState(this.$whim.state);
    return gameState.isCurrentMissionPlayerExecuted(this.$whim.accessUser.id);
  }
  get isPlayerExecuted() {
    const gameState = new GameState(this.$whim.state);
    return gameState.isCurrentMissionPlayerExecuted(this.displayUser.id);
  }
  get isMissionComplete() {
    const gameState = new GameState(this.$whim.state);
    return gameState.isCurrentMissionExecuteComplete;
  }
  get canStartNextPhase() {
    const gameState = new GameState(this.$whim.state);
    return gameState.canStartNextPhase;
  }
  get isGameover() {
    const gameState = new GameState(this.$whim.state);
    return gameState.isGameover;
  }

  checkSpyUser(playerID: string) {
    const player = this.$whim.state.players?.find((p) => p.id === playerID);
    return player?.role === "spy";
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

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
</style>
