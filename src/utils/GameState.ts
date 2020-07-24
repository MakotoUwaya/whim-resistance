import { Mission, Phase, Player, Rule, State } from '@/types';
import { User } from '@/types/User';
import Random from '@/types/Random';

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
  }

  /* GameState computed */

  get isGameStarted() {
    return this.state.isStarted || false;
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
    const currentPosition = this.currentLeader?.positionNumber || 0;
    const nextPosition =
      currentPosition >= (this.state.players?.length || 0)
        ? 1
        : currentPosition + 1;
    return this.state.players?.find((p) => p.positionNumber === nextPosition);
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
  get currentLeader() {
    return this.currentMission?.leader;
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

  /* GameState method */

  private setRole() {
    if (!this.state.players) return;

    const spyCount = this.rule.spyCount(this.state.players);
    const random = new Random(Date.now());
    while (
      this.state.players.filter((p) => p.role === 'spy').length < spyCount
    ) {
      const player = this.state.players[
        random.nextInt(this.state.players.length)
      ];
      if (player.role === undefined) {
        player.role = 'spy';
      }
    }
    for (const player of this.state.players.filter(
      (p) => p.role === undefined
    )) {
      player.role = 'resistance';
    }
  }
  private nextPhase() {
    const nextMissionLeader = this.nextMissionLeader;
    if (!nextMissionLeader) {
      console.error('次のリーダーを取得できません');
      return;
    }
    const phase = { missions: [], missionCountExceeded: false } as Phase;
    this.state.phases?.push(phase);
    this.nextMission(phase, nextMissionLeader);
  }

  getPlayer(playerID: string) {
    const player = this.state.players?.find((p) => p.id === playerID);
    if (!player) {
      console.error(
        'プレイヤー情報が取得できません',
        playerID,
        this.state.players
      );
    }
    return player;
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
    if (this.isGameStarted) {
      console.error('既にゲームを開始しています');
      return;
    }
    if (!this.state.players || !this.rule.canStart(this.state.players)) {
      console.warn('プレイヤー参加数が足りません', this.state.players?.length);
      return;
    }
    if (!this.state.players.every((p) => p.canStarted)) {
      console.info(
        '開始状態になっていないプレイヤーがいます',
        this.state.players.map((p) => {
          return { name: p.name, canStarted: p.canStarted };
        })
      );
      return;
    }

    this.setRole();
    this.next();
    this.state.isStarted = true;
  }
  next() {
    console.log(
      'resistance:',
      this.successMissionCount,
      'spy:',
      this.failMissionCount
    );
    this.state.currentVoteChecked = false;
    this.state.currentMissionResultChecked = false;

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
  phaseLatestMission(phase: Phase | undefined) {
    if (!phase?.missions) return;
    return phase.missions[phase.missions.length - 1];
  }
  phaseMissionCountExceeded(phase: Phase | undefined) {
    return phase?.missionCountExceeded || false;
  }
  addCurrentMissionMember(playerID: string) {
    const player = this.getPlayer(playerID);
    if (!player) return;
    this.addMissionMember(this.currentMission, player);
  }
  isCurrentMissionPlayerAdded(playerID: string) {
    return this.isPlayerAdded(this.currentMission, playerID);
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
      this.currentPhase.missions.length >= this.rule.maxMissionCount
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

  /* Mission method */
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
      mission?.members?.every(
        (m) => m.isSuccess !== undefined && m.isSuccess !== null
      ) || false
    );
  }

  isMissionSuccess(mission: Mission | undefined) {
    return this.rule.resultDetection(
      this.state.players || [],
      this.state.phases || [],
      mission?.members?.filter((m) => !m.isSuccess)?.length || 0
    );
  }

  addMissionMember(mission: Mission | undefined, player: Player) {
    if (!mission) return;
    if (!mission.members) {
      mission.members = [];
    }
    const member = mission.members.find((d) => d.player.id === player.id);
    if (member) return;
    mission.members.push({ player, isSuccess: null });
  }

  removeMember(mission: Mission | undefined, player: Player) {
    if (!mission?.members) return;
    mission.members = mission.members.filter((d) => d.player.id !== player.id);
  }

  isPlayerAdded(mission: Mission | undefined, playerID: string) {
    if (!mission?.members) return false;
    return !!mission.members.find((v) => v.player.id === playerID);
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
    mission.votes.push({ player, isApprove });
  }

  isPlayerVoted(mission: Mission | undefined, playerID: string) {
    if (!mission?.votes) return false;
    return (
      mission.votes.find((v) => v.player.id === playerID)?.isApprove !==
      undefined
    );
  }

  isPlayerApproved(mission: Mission | undefined, playerID: string) {
    if (!mission?.votes) return false;
    return (
      mission.votes.find((v) => v.player.id === playerID)?.isApprove || false
    );
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
