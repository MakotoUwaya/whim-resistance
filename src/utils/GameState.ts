import { Card, Mission, Phase, Player, Rule, State, Timing } from '@/types';
import { User } from '@/types/User';
import Random from '@/types/Random';
import { InitializePlotCards } from '@/types/PlotCard';

export type Step =
  | '待機' // waiting
  | '選択' // selecting
  | '立ち聞き' // observe
  | '情報開示' // openup
  | 'カード選択' // choiceCard
  | '早期投票' // earlyVoting
  | '投票' // voting
  | '投票確認' // voted
  | '遂行' // executing
  | '遂行確認' // executed
  | '終了'; // finish

export class GameState {
  private readonly rule = new Rule();
  state!: State;

  constructor(state: State) {
    this.state = state;
    if (!this.state?.phases) {
      this.state.phases = [];
    }
    if (!this.state?.players) {
      this.state.players = [];
    }
    if (state.isStarted === undefined) {
      state.isStarted = false;
    }
    if (this.state.plotCards === undefined) {
      const random = new Random(Date.now());
      this.state.plotCards = random.suffleArray(
        InitializePlotCards(this.state.players)
      );
    }
  }

  /* GameState computed */

  get currentStep(): Step {
    if (this.isGameover) {
      return '終了';
    } else if (this.state.isStarted) {
      if (this.isCurrentMissionExecuteComplete && !this.canStartNextPhase) {
        return '遂行確認';
      } else if (this.canCurrentMissionExecute) {
        return '遂行';
      } else if (this.isCurrentMissionVoteComplete) {
        return '投票確認';
      } else if (this.canCurrentMissionVote && this.isExistEarlyVotePlayers) {
        return '早期投票';
      } else if (this.canCurrentMissionVote) {
        return '投票';
      } else if (this.isExistAllPlayerTakenPlotCards) {
        return 'カード選択';
      } else if (this.isExistOpenUptargetPlayer) {
        return '情報開示';
      } else if (this.isExistOverheardConversationPlayers) {
        return '立ち聞き';
      } else {
        return '選択';
      }
    } else {
      return '待機';
    }
  }
  get currentTiming(): Timing {
    const step = this.currentStep;
    if (['終了', '待機'].includes(step)) {
      return '利用不可';
    } else if (step === '遂行確認') {
      return '遂行後';
    } else if (step === '遂行') {
      return '遂行前';
    } else if (step === '投票確認') {
      return '投票後';
    } else if (step === '投票') {
      return '投票前'; // '選択後' と同義
    } else if (this.isDistributedPlotCards) {
      return '選択前';
    } else {
      return '配布前';
    }
  }
  get currentPhase() {
    return this.state.phases
      ? this.state.phases[this.state.phases.length - 1]
      : undefined;
  }
  get currentPhaseMissionCountExceeded() {
    return this.phaseMissionCountExceeded(this.currentPhase);
  }
  get nextMissionLeader() {
    return this.nextPositionPlayer(this.currentLeader);
  }
  get isTimerHidden() {
    return this.state.isTimerHidden;
  }
  get canStartNextPhase() {
    return this.state.currentMissionResultChecked || false;
  }
  get successMissionCount() {
    return this.state.phases?.filter((p) => this.isSuccess(p)).length || 0;
  }
  get failMissionCount() {
    return this.state.phases?.filter((p) => this.isFail(p)).length || 0;
  }
  get isResistanceWin() {
    return this.successMissionCount >= 3;
  }
  get isSpyWin() {
    return this.failMissionCount >= 3;
  }
  get isGameover() {
    return this.isResistanceWin || this.isSpyWin;
  }

  /* Phase computed */

  get currentMission() {
    return this.phaseLatestMission(this.currentPhase);
  }
  get currentMissionIndex() {
    return this.currentPhase?.missions?.length || 1;
  }
  get currentLeader() {
    return this.currentMission?.leader;
  }
  private get takePlotCard() {
    return this.state.plotCards?.pop();
  }
  get currentPhasePlotCard() {
    if (this.state.currentPlotCardsIndex === undefined) return;
    return this.currentPhase?.plotCards[this.state.currentPlotCardsIndex];
  }
  get isDistributedPlotCards() {
    return (
      this.state.currentPlotCardsIndex !== undefined &&
      this.state.currentPlotCardsIndex >=
        (this.currentPhase?.plotCards.length || 0)
    );
  }
  get isExistAllPlayerTakenPlotCards() {
    return !!this.state.allPlayerTakenPlotCards;
  }
  get isExistEarlyVotePlayers() {
    const earlyVotePlayers =
      this.state.players?.filter((p) => this.hasOpinionMakerCard(p.id)) || [];
    return (
      earlyVotePlayers.length > 0 &&
      !earlyVotePlayers.every((p) =>
        this.currentMission?.votes?.find((mp) => mp.player.id === p.id)
      )
    );
  }
  get isExistOverheardConversationPlayers() {
    return this.state.canOverheardConversation?.length || 0 > 0;
  }
  get isExistOpenUptargetPlayer() {
    return !!this.state.currentCardUser && this.state.openUpExecuting;
  }
  get canCurrentMissionVote() {
    return this.canMissionVote(this.currentMission);
  }
  get isCurrentMissionVoteComplete() {
    return this.isMissionVoteComplete(this.currentMission);
  }
  get isCurrentMissionApprove() {
    return this.isMissionApprove(this.currentMission);
  }
  get currentMissionApprovedCount() {
    return this.approvedCount(this.currentMission);
  }
  get currentMissionDisapprovedCount() {
    return this.disapprovedCount(this.currentMission);
  }
  get canCurrentMissionExecute() {
    return this.canMissionExecute(this.currentMission);
  }
  get isCurrentMissionExecuteComplete() {
    return this.isMissionExecuteCompleted(this.currentMission);
  }
  get isCurrentMissionSuccess() {
    return this.isMissionSuccess(this.currentMission);
  }
  get currentMissionSuccessCount() {
    return this.successCount(this.currentMission);
  }
  get currentMissionFailCount() {
    return this.failCount(this.currentMission);
  }
  /* Mission computed */
  get spotLightPlayer() {
    return this.state.spotLightPlayer;
  }

  /* GameState method */

  private setRole() {
    if (!this.state.players) return;

    const spyCount = this.rule.spyCount(this.state.players);
    const random = new Random(Date.now());
    const resistanceImageIndex = random.suffleArray(
      [...Array(7)].map((_, k) => k + 1)
    );
    const spyImageIndex = random.suffleArray(
      [...Array(3)].map((_, k) => k + 1)
    );
    while (
      this.state.players.filter((p) => p.role === 'spy').length < spyCount
    ) {
      const player = this.state.players[
        random.nextInt(this.state.players.length)
      ];
      if (player.role === undefined) {
        player.role = 'spy';
        player.image = `spy${spyImageIndex.pop()}.png`;
      }
    }
    for (const player of this.state.players.filter(
      (p) => p.role === undefined
    )) {
      player.role = 'resistance';
      player.image = `resistance${resistanceImageIndex.pop()}.png`;
    }
  }
  private nextPhase() {
    const nextMissionLeader = this.nextMissionLeader;
    if (!nextMissionLeader) {
      console.error('次のリーダーを取得できません');
      return;
    }
    const phase = {
      missions: [],
      missionCountExceeded: false,
      plotCards: this.drowPlotCards(),
    } as Phase;
    this.state.currentPlotCardsIndex = 0;
    this.state.phases?.push(phase);
    this.nextMission(phase, nextMissionLeader);
  }

  getPlayer(playerID: string) {
    return this.state.players?.find((p) => p.id === playerID);
  }
  addPlayer(user: User) {
    if (this.getPlayer(user.id)) {
      return;
    }
    const player = { ...user, cards: [], canStarted: false };
    this.state.players?.push(player);
  }
  setCanStartedPlayer(playerID: string) {
    const player = this.state.players?.find((p) => p.id === playerID);
    if (player) {
      player.canStarted = true;
    }
  }
  startGame() {
    if (!this.state.players || !this.rule.canStart(this.state.players)) {
      throw Error(
        `プレイヤー参加数が足りません: ${this.state.players?.length}`
      );
    }
    if (!this.state.players.every((p) => p.canStarted)) {
      throw Error(
        `開始状態になっていないプレイヤーがいます: ${
          this.state.players?.filter((p) => p.canStarted).length
        }/${this.state.players?.length}`
      );
    }

    this.setRole();
    this.next();
    this.state.isStarted = true;
  }
  next() {
    this.refreshState();
    if (
      !this.currentPhase ||
      this.isSuccess(this.currentPhase) ||
      this.isFail(this.currentPhase)
    ) {
      this.nextPhase();
      return;
    }

    const nextMissionLeader = this.nextMissionLeader;
    if (!nextMissionLeader) {
      console.error('次のリーダーが取得できません');
      return;
    }
    this.nextMission(this.currentPhase, nextMissionLeader);
  }
  refreshState() {
    this.state.currentVoteChecked = false;
    this.state.currentMissionResultChecked = false;
    this.state.currentCard = null;
    this.state.currentCardUser = null;
    this.state.canOverheardConversation = null;
    this.state.spotLightPlayer = null;
  }
  isSpyPlayer(playerID: string) {
    const player = this.getPlayer(playerID);
    return player?.role === 'spy';
  }
  isEarlyLeader(playerID: string) {
    return this.hasOpinionMakerCard(playerID);
  }
  canOverheardConversation(playerID: string) {
    return (
      this.state.canOverheardConversation?.find(
        (p) => p.player.id === playerID
      ) || false
    );
  }
  ownedCard(playerID: string, card: Card) {
    const player = this.getPlayer(playerID);
    if (!player || !card || this.state.currentPlotCardsIndex === undefined) {
      return;
    }
    if (!player.cards) {
      player.cards = [];
    }
    player.cards.push(card);
    this.state.currentPlotCardsIndex++;
  }
  getOwnedCards(playerID: string) {
    const player = this.getPlayer(playerID);
    return player ? player.cards || [] : [];
  }
  prevPositionPlayer(targetPlayer: Player | undefined) {
    const currentPosition = targetPlayer?.positionNumber || 1;
    const prevPosition =
      currentPosition <= 1
        ? this.state.players?.length || 1
        : currentPosition - 1;
    return this.state.players?.find((p) => p.positionNumber === prevPosition);
  }
  nextPositionPlayer(targetPlayer: Player | undefined) {
    const currentPosition = targetPlayer?.positionNumber || 1;
    const nextPosition =
      currentPosition >= (this.state.players?.length || 1)
        ? 1
        : currentPosition + 1;
    return this.state.players?.find((p) => p.positionNumber === nextPosition);
  }
  private hasCard(playerID: string, cardName: string, unused = false) {
    const player = this.getPlayer(playerID);
    return !!player?.cards?.find(
      (c) => c.name === cardName && (unused || !c.used)
    );
  }
  hasOpinionMakerCard(playerID: string) {
    return this.hasCard(playerID, '総意の形成者', true);
  }
  hasResponsibilityCard(playerID: string) {
    return this.hasCard(playerID, '責任者', true);
  }
  hasKeepingCloseEyeOnYouCard(playerID: string) {
    return this.hasCard(playerID, '監視者');
  }
  hasInTheSpotlightCard(playerID: string) {
    return this.hasCard(playerID, '注目の的');
  }

  /* Phase method */

  private nextMission(phase: Phase, missionLeader: Player) {
    if (!phase || !phase.missions) return;
    const mission = {
      members: [],
      votes: [],
      leader: missionLeader,
    } as Mission;
    if (!phase.missions) {
      phase.missions = [];
    }
    phase.missions.push(mission);
  }
  private drowPlotCards(): Card[] {
    if (!this.state.players) return [];
    const cards: Card[] = [];
    for (let i = 0; i < this.rule.drowCardCount(this.state.players); i++) {
      const card = this.takePlotCard;
      if (!card) break;
      cards.push(card);
    }
    return cards;
  }
  phaseLatestMission(phase: Phase | undefined) {
    if (!phase?.missions) return;
    return phase.missions[phase.missions.length - 1];
  }
  phaseMissionCountExceeded(phase: Phase | undefined) {
    return phase?.missionCountExceeded || false;
  }
  isPublicCurrentMissionMember(playerID: string) {
    const player = this.getPlayer(playerID);
    return !!player && this.isPublicMissionMember(this.currentMission, player);
  }
  addCurrentMissionMember(playerID: string) {
    const player = this.getPlayer(playerID);
    if (!player) return;
    this.addMissionMember(this.currentMission, player);
  }
  isComplete(phase: Phase | undefined) {
    return this.isMissionExecuteCompleted(this.phaseLatestMission(phase));
  }
  isSuccess(phase: Phase | undefined) {
    return (
      this.isComplete(phase) &&
      this.isMissionSuccess(this.phaseLatestMission(phase))
    );
  }
  isFail(phase: Phase | undefined) {
    return (
      this.phaseMissionCountExceeded(phase) ||
      (this.isComplete(phase) && !this.isSuccess(phase))
    );
  }
  currentMissionVote(playerID: string, isApprove: boolean) {
    const player = this.getPlayer(playerID);
    if (!player) return;
    this.vote(this.currentMission, player, isApprove);

    if (
      this.isCurrentMissionVoteComplete &&
      this.currentPhase &&
      this.currentPhase.missions &&
      this.currentPhase.missions.filter((m) => this.isMissionVoteComplete(m))
        .length >= this.rule.maxMissionCount
    ) {
      this.currentPhase.missionCountExceeded = true;
    }
  }
  isCurrentMissionPlayerVoted(playerID: string) {
    return this.isPlayerVoted(this.currentMission, playerID);
  }
  isCurrentMissionPlayerApprove(playerID: string) {
    return this.isPlayerApproved(this.currentMission, playerID);
  }
  currentMissionExecute(playerID: string, isSuccess: boolean) {
    const player = this.getPlayer(playerID);
    if (!player) return;
    this.execute(this.currentMission, player, isSuccess);
  }
  isCurrentMissionMember(playerID: string) {
    return this.isPlayerMissionMember(this.currentMission, playerID);
  }
  isCurrentMissionPlayerExecuted(playerID: string) {
    return this.isPlayerExecuted(this.currentMission, playerID);
  }
  isCurrentMissionPlayerSuccess(playerID: string) {
    return this.isPlayerSuccess(this.currentMission, playerID);
  }
  moveCard(card: Card, playerID: string) {
    const player = this.getPlayer(playerID);
    if (!player) return;
    for (const targetPlayer of this.state.players?.filter(
      (p) => p.id !== player.id
    ) || []) {
      const targetCard = targetPlayer.cards?.find((c) => c.id === card.id);
      if (targetCard) {
        if (!player.cards) {
          player.cards = [];
        }
        player.cards.push(card);
        targetPlayer.cards = targetPlayer.cards?.filter(
          (c) => c.id !== card.id
        );
        this.state.allPlayerTakenPlotCards = null;
        break;
      }
    }
  }
  usingCard(
    card: Card | undefined,
    player: Player | undefined,
    targetPlayer: Player | undefined = undefined
  ) {
    if (!player || !card) {
      throw new Error('カードは利用できません');
    }
    this.state.currentCard = card;
    this.state.currentCardUser = player;

    if (card.name === '強力なリーダー') {
      this.currentPhase?.missions?.pop();
      this.setCurrentMissionLeader(player);
    } else if (card.name === '責任者') {
      if (!this.state.players) return;
      const allCards: Card[] = this.state.players.flatMap((p) =>
        p.id !== player.id && p.cards !== undefined && p.cards.every((c) => !!c)
          ? p.cards
          : []
      );
      this.state.allPlayerTakenPlotCards = allCards.filter(
        (c) => !!c && !c.used
      );
    } else if (card.name === '不信') {
      this.next();
    } else if (card.name === '総意の形成者') {
      return;
    } else if (card.name === '監視者') {
      if (!targetPlayer) return;
      const member = this.currentMission?.members?.find(
        (m) => m.player.id === targetPlayer.id
      );
      if (!member) return;
      member.isPublic = true;
    } else if (card.name === '立ち聞きされた会話') {
      const prevPositionPlayer = this.prevPositionPlayer(player);
      const nextPositionPlayer = this.nextPositionPlayer(player);
      if (!prevPositionPlayer || !nextPositionPlayer) return;
      this.state.canOverheardConversation = [
        { player: prevPositionPlayer, isPublic: false },
        { player: nextPositionPlayer, isPublic: false },
      ];
    } else if (card.name === '情報開示') {
      this.state.openUpViewer = null;
      this.state.openUpExecuting = true;
    } else if (card.name === '注目の的') {
      if (!targetPlayer) return;
      const member = this.currentMission?.members?.find(
        (m) => m.player.id === targetPlayer.id
      );
      if (!member) return;
      member.isPublic = true;
      this.state.spotLightPlayer = targetPlayer;
    } else if (card.name === '信用の確立') {
      this.state.currentCardUser = this.currentLeader;
      this.state.openUpViewer = null;
      this.state.openUpExecuting = true;
    }
    card.used = true;
  }

  /* Mission method */

  private setCurrentMissionLeader(player: Player) {
    if (!this.currentPhase || !this.currentMission) return;
    this.currentMission.leader = player;
    this.nextMission(this.currentPhase, player);
  }
  private canMissionVote(mission: Mission | undefined) {
    return this.rule.canMissionVote(
      this.state.players,
      this.state.phases,
      mission?.members?.length
    );
  }

  isMissionVoteComplete(mission: Mission | undefined) {
    return this.rule.isMissionVoteComplete(
      this.state.players?.length,
      mission?.votes?.length
    );
  }

  isMissionApprove(mission: Mission | undefined) {
    return this.rule.isMissionApprove(
      this.state.players?.length,
      this.approvedCount(mission)
    );
  }

  private canMissionExecute(mission: Mission | undefined) {
    return (
      (this.state.currentVoteChecked && this.isMissionApprove(mission)) || false
    );
  }

  isMissionExecuteCompleted(mission: Mission | undefined) {
    return (
      !!mission?.members &&
      mission.members.length > 0 &&
      mission.members.every(
        (m) => m.isSuccess !== undefined && m.isSuccess !== null
      )
    );
  }

  isMissionSuccess(mission: Mission | undefined) {
    return this.rule.resultDetection(
      this.state.players || [],
      this.state.phases || [],
      mission?.members?.filter((m) => !m.isSuccess)?.length || 0
    );
  }

  isPublicMissionMember(mission: Mission | undefined, player: Player) {
    if (!mission || !player) return false;
    const member = mission.members?.find((m) => m.player.id === player.id);
    return !!member && member.isPublic;
  }

  addMissionMember(mission: Mission | undefined, player: Player) {
    if (!mission) return;
    if (!mission.members) {
      mission.members = [];
    }
    const member = mission.members.find((d) => d.player.id === player.id);
    if (member) return;
    mission.members.push({ player, isSuccess: null, isPublic: false });
  }

  removeMember(mission: Mission | undefined, player: Player) {
    if (!mission?.members) return;
    mission.members = mission.members.filter((d) => d.player.id !== player.id);
  }

  isPlayerAdded(mission: Mission | undefined, playerID: string) {
    if (!mission?.members) return false;
    return !!mission.members.find((v) => v.player.id === playerID);
  }

  autoSelectMissionMember() {
    if (!this.currentMission || !this.state.players) {
      return;
    }
    if (!this.currentMission.members) {
      this.currentMission.members = [];
    }

    while (!this.canCurrentMissionVote) {
      const selectedMembers =
        this.currentMission.members?.map((m) => m.player.id) || [];
      const players = this.state.players.filter(
        (p) => !selectedMembers.includes(p.id)
      );
      const random = new Random(Date.now());
      const player = players[random.nextInt(players.length)];
      this.addMissionMember(this.currentMission, player);
    }
  }

  vote(mission: Mission | undefined, player: Player, isApprove: boolean) {
    if (!mission || this.isMissionVoteComplete(mission)) {
      return;
    }
    if (!mission.votes) {
      mission.votes = [];
    }

    const member = mission.votes.find((d) => d.player.id === player.id);
    if (member) {
      member.isApprove = isApprove;
      return;
    }
    mission.votes.push({
      player,
      isApprove,
    });
  }

  isPlayerVoted(mission: Mission | undefined, playerID: string) {
    if (!mission?.votes) return false;
    return (
      mission.votes.find((v) => v.player.id === playerID)?.isApprove !==
      undefined
    );
  }

  autoEarlyVote() {
    const votes = this.currentMission?.votes || [];
    for (const player of this.state.players?.filter((p) =>
      this.hasOpinionMakerCard(p.id)
    ) || []) {
      if (!votes.find((v) => v.player.id === player.id)) {
        this.currentMissionVote(player.id, false);
      }
    }
  }
  autoVote() {
    const votes = this.currentMission?.votes || [];
    for (const player of this.state.players || []) {
      if (!votes.find((v) => v.player.id === player.id)) {
        this.currentMissionVote(player.id, false);
      }
    }
  }

  isPlayerApproved(mission: Mission | undefined, playerID: string) {
    if (!mission?.votes) return undefined;
    return mission.votes.find((v) => v.player.id === playerID)?.isApprove;
  }

  approvedCount(mission: Mission | undefined) {
    return mission?.votes?.filter((v) => v.isApprove)?.length || 0;
  }

  disapprovedCount(mission: Mission | undefined) {
    return mission?.votes?.filter((v) => !v.isApprove)?.length || 0;
  }

  execute(mission: Mission | undefined, player: Player, isSuccess: boolean) {
    if (!mission || this.isMissionExecuteCompleted(mission)) {
      return;
    }
    if (!mission.members) {
      mission.members = [];
    }

    const member = mission.members.find((d) => d.player.id === player.id);
    if (!member) {
      return;
    }
    member.isSuccess = isSuccess;
  }

  isPlayerMissionMember(mission: Mission | undefined, playerID: string) {
    return !!mission?.members?.find((v) => v.player.id === playerID);
  }

  isPlayerExecuted(mission: Mission | undefined, playerID: string) {
    const member = mission?.members?.find((v) => v.player.id === playerID);
    return member?.isSuccess !== undefined && member.isSuccess !== null;
  }

  autoExecute() {
    const members = this.currentMission?.members || [];
    for (const member of members) {
      if (member.isSuccess === null || member.isSuccess === undefined) {
        this.currentMissionExecute(member.player.id, true);
      }
    }
  }

  isPlayerSuccess(mission: Mission | undefined, playerID: string) {
    if (!mission?.members) return false;
    return (
      mission.members.find((v) => v.player.id === playerID)?.isSuccess || false
    );
  }

  successCount(mission: Mission | undefined) {
    return mission?.members?.filter((v) => v.isSuccess)?.length || 0;
  }

  failCount(mission: Mission | undefined) {
    return mission?.members?.filter((v) => !v.isSuccess)?.length || 0;
  }
}
