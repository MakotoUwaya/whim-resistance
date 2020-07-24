import { Phase, Player } from '@/types';

export class Rule {
  // TODO： 5人以上に限定する
  readonly minimumPlayersCount = 2;
  readonly maxMissionCount = 5;

  spyCount(players: Player[]) {
    switch (players.length) {
      case 5:
        return 2;
      case 6:
        return 2;
      case 7:
        return 3;
      case 8:
        return 3;
      case 9:
        return 3;
      case 10:
        return 3;
      default:
        return 1;
    }
  }

  missionMemberCount(players: Player[], phases: Phase[]) {
    switch (players.length) {
      case 5:
        switch (phases.length) {
          case 1:
            return 2;
          case 2:
            return 3;
          case 3:
            return 2;
          case 4:
            return 3;
          case 5:
            return 3;
          default:
            return 0;
        }
      case 6:
        switch (phases.length) {
          case 1:
            return 2;
          case 2:
            return 3;
          case 3:
            return 4;
          case 4:
            return 3;
          case 5:
            return 4;
          default:
            return 0;
        }
      case 7:
        switch (phases.length) {
          case 1:
            return 2;
          case 2:
            return 3;
          case 3:
            return 3;
          case 4:
            return 3;
          case 5:
            return 4;
          default:
            return 0;
        }
      case 8:
      case 9:
      case 10:
        switch (phases.length) {
          case 1:
            return 3;
          case 2:
            return 4;
          case 3:
            return 4;
          case 4:
            return 5;
          case 5:
            return 5;
          default:
            return 0;
        }
      default:
        return 2;
    }
  }

  resultDetection(players: Player[], phases: Phase[], failCount: number) {
    switch (players.length) {
      case 7:
      case 8:
      case 9:
      case 10:
        switch (phases.length) {
          case 4:
            return failCount <= 1;
          default:
            return failCount == 0;
        }
      default:
        return failCount == 0;
    }
  }

  drowCardCount(players: Player[]) {
    switch (players.length) {
      case 5:
      case 6:
        return 1;
      case 7:
      case 8:
      case 9:
        return 2;
      case 10:
        return 3;
      default:
        return 1;
    }
  }

  canStart(players: Player[]) {
    return players.length >= this.minimumPlayersCount;
  }
  canMissionVote(
    players: Player[] = [],
    phases: Phase[] = [],
    memberCount = 0
  ) {
    return memberCount >= this.missionMemberCount(players, phases);
  }
  isMissionVoteComplete(playerLength = 10, voteLength = 0) {
    return voteLength >= playerLength;
  }
  isMissionApprove(playerLength = 10, approveLength = 0) {
    return approveLength > Math.ceil(playerLength / 2);
  }
}
