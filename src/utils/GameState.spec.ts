import { GameState } from './GameState';
import { Player } from '@/types';

function createState(playerCount: number) {
  const players: Player[] = [];
  for (let i = 0; i < playerCount; i++) {
    players.push({
      id: `hoge_id${i + 1}`,
      name: `fuga_name${i + 1}`,
      timestamp: new Date('2020-01-01 09:00:00'),
      positionNumber: i + 1,
      entry: false,
      left: false,
      role: undefined,
      cards: undefined,
      canStarted: undefined,
      image: undefined,
    });
  }
  return players;
}

describe('Stepのテスト', () => {
  test('空のstateが与えられたとき、「待機」になること', () => {
    const state = new GameState({});
    expect(state.currentStep).toBe('待機');
  });
  test('プレイヤーを指定したとき、「待機」になること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      expect(state.currentStep).toBe('待機');
    }
  });
  test('プレイヤーがゲームを開始したとき、「選択」になること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      expect(state.currentStep).toBe('選択');
    }
  });
  test('リーダーがミッションメンバーを選択したとき、「投票」になること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      for (let k = 1; k <= (i === 8 ? 3 : 2); k++) {
        state.addCurrentMissionMember(`hoge_id${k}`);
      }
      expect(state.currentStep).toBe('投票');
    }
  });
  test('プレイヤー全員が投票を終えたとき、「投票確認」になること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      for (let k = 1; k <= i; k++) {
        state.currentMissionVote(`hoge_id${k}`, false)
      }
      expect(state.currentStep).toBe('投票確認');
    }
  });
  test('投票が承認され、確認を終えたとき、「遂行」になること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      for (let k = 1; k <= i; k++) {
        state.currentMissionVote(`hoge_id${k}`, true)
      }
      state.state.currentVoteChecked = true;
      expect(state.currentStep).toBe('遂行');
    }
  });
  test('ミッションが遂行されたとき、「遂行確認」になること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      for (let k = 1; k <= (i === 8 ? 3 : 2); k++) {
        state.addCurrentMissionMember(`hoge_id${k}`);
        state.currentMissionExecute(`hoge_id${k}`, false);
      }
      expect(state.currentStep).toBe('遂行確認');
    }
  });
  test('ゲームの決着がついたとき、「終了」になること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      // フェーズ1
      for (let k = 1; k <= (i === 8 ? 3 : 2); k++) {
        state.addCurrentMissionMember(`hoge_id${k}`);
        state.currentMissionExecute(`hoge_id${k}`, false);
      }
      state.next();
      // フェーズ2
      for (let k = 1; k <= (i === 8 ? 4 : 3); k++) {
        state.addCurrentMissionMember(`hoge_id${k}`);
        state.currentMissionExecute(`hoge_id${k}`, false);
      }
      state.next();
      // フェーズ3
      for (let k = 1; k <= ([8, 6].includes(i) ? 4 : (i === 7 ? 3 : 2)); k++) {
        state.addCurrentMissionMember(`hoge_id${k}`);
        state.currentMissionExecute(`hoge_id${k}`, false);
      }
      expect(state.currentStep).toBe('終了');
    }
  });
});

describe('startGameのテスト', () => {
  test('人数不足のとき、例外が発生すること', () => {
    const state = new GameState({
      players: createState(4),
    });
    expect(() => state.startGame()).toThrow(
      'プレイヤー参加数が足りません: 4/5'
    );
  });
  test('開始状態になっていないプレイヤーがいたとき、例外が発生すること', () => {
    const state = new GameState({
      players: createState(5),
    });
    for (let i = 1; i < 5; i++) {
      state.setCanStartedPlayer(`hoge_id${i}`);
    }
    expect(() => state.startGame()).toThrow(
      '開始状態になっていないプレイヤーがいます: 4/5'
    );
  });
  test('プレイヤーが5人以上、かつ全員が開始状態になっているとき、ゲームが開始すること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      expect(state.state.isStarted).toBeTruthy();
      expect(state.currentPhase).toBeTruthy();
      expect(state.currentMission).toBeTruthy();
    }
  });
});
describe('setRoleのテスト', () => {
  test('プレイヤーの役割人数がルール通りに設定されていること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      expect(
        state.state.players?.filter((p) => p.role === 'resistance').length
      ).toBe(i - (i < 7 ? 2 : 3));
      expect(state.state.players?.filter((p) => p.role === 'spy').length).toBe(
        i < 7 ? 2 : 3
      );
    }
  });
});
describe('addPlayer/getPlayerのテスト', () => {
  test('プレイヤーを追加して情報を取得できること', () => {
    const state = new GameState({
      players: createState(7),
    });
    state.addPlayer({
      id: 'hoge_id8',
      name: 'fuga_name8',
      timestamp: new Date('2020-01-01 09:00:00'),
      positionNumber: 8,
      entry: false,
      left: false
    });
    for (let i = 1; i <= 8; i++) {
      expect(state.getPlayer(`hoge_id${i}`)?.name).toBe(`fuga_name${i}`);
    }
  });
});
describe('isSpyPlayerのテスト', () => {
  test('スパイプレイヤーを指定してtrueが返ること', () => {
    const state = new GameState({
      players: [{
        id: 'spy_player',
        role: 'spy'
      }]
    });
    expect(state.isSpyPlayer('spy_player')).toBeTruthy();
  });
  test('レジスタンスプレイヤーを指定してfalseが返ること', () => {
    const state = new GameState({
      players: [{
        id: 'resistance_player',
        role: 'resistance'
      }]
    });
    expect(state.isSpyPlayer('resistance_player')).toBe(false);
  });
});
describe('Phase/Missionのテスト', () => {
  test('5回投票が否決されると、phaseMissionCountExceededがtrueになること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      for (let l = 0; l < 4; l++) {
        state.next();
      }
      for (let k = 1; k <= i; k++) {
        state.currentMissionVote(`hoge_id${k}`, false);
      }
      expect(state.currentPhase?.missionCountExceeded).toBe(true);
    }
  });
  test('ミッションメンバーに追加すると、isCurrentMissionMemberがtrueになること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      for (let k = 1; k <= i; k++) {
        state.addCurrentMissionMember(`hoge_id${k}`);
        expect(state.isCurrentMissionMember(`hoge_id${k}`)).toBeTruthy();
      }
    }
  });
  test('ミッションメンバーに追加していないプレイヤーIDを指定すると、isCurrentMissionMemberがfalseになること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      for (let k = 1; k <= i; k++) {
        state.addCurrentMissionMember(`hoge_id${k}`);
        expect(state.isCurrentMissionMember(`error_id${k}`)).toBe(false);
      }
    }
  });
  test('投票すると、isCurrentMissionPlayerVotedがtrueになること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      for (let k = 1; k <= i; k++) {
        state.currentMissionVote(`hoge_id${k}`, true);
        expect(state.isCurrentMissionPlayerVoted(`hoge_id${k}`)).toBeTruthy();
      }
    }
  });
  test('投票していないプレイヤーIDを指定すると、isCurrentMissionPlayerVotedがfalseになること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      for (let k = 1; k <= i; k++) {
        state.currentMissionVote(`hoge_id${k}`, true);
        expect(state.isCurrentMissionPlayerVoted(`error_id${k}`)).toBe(false);
      }
    }
  });
  test('投票で賛成すると、isCurrentMissionPlayerApproveがtrueになること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      for (let k = 1; k <= i; k++) {
        state.currentMissionVote(`hoge_id${k}`, true);
        expect(state.isCurrentMissionPlayerApprove(`hoge_id${k}`)).toBeTruthy();
      }
    }
  });
  test('投票で反対すると、isCurrentMissionPlayerApproveがfalseになること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      for (let k = 1; k <= i; k++) {
        state.currentMissionVote(`hoge_id${k}`, false);
        expect(state.isCurrentMissionPlayerApprove(`hoge_id${k}`)).toBe(false);
      }
    }
  });
  test('ミッションメンバーがミッションを遂行すると、isCurrentMissionPlayerExecutedがtrueになること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      for (let k = 1; k <= i; k++) {
        state.addCurrentMissionMember(`hoge_id${k}`);
        state.currentMissionExecute(`hoge_id${k}`, false);
        expect(state.isCurrentMissionPlayerExecuted(`hoge_id${k}`)).toBeTruthy();
      }
    }
  });
  test('ミッションメンバーに追加していないプレイヤーがミッションを遂行すると、isCurrentMissionPlayerExecutedがfalseになること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      for (let k = 1; k <= i; k++) {
        state.addCurrentMissionMember(`hoge_id${k}`);
        state.currentMissionExecute(`fuga`, false);
        expect(state.isCurrentMissionPlayerExecuted(`fuga`)).toBe(false);
      }
    }
  });
  test('ミッションを成功させると、isCurrentMissionPlayerSuccessがtrueになること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      for (let k = 1; k <= i; k++) {
        state.addCurrentMissionMember(`hoge_id${k}`);
        state.currentMissionExecute(`hoge_id${k}`, true);
        expect(state.isCurrentMissionPlayerSuccess(`hoge_id${k}`)).toBeTruthy();
      }
    }
  });
  test('ミッションを失敗させると、isCurrentMissionPlayerSuccessがfalseになること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      for (let k = 1; k <= i; k++) {
        state.addCurrentMissionMember(`hoge_id${k}`);
        state.currentMissionExecute(`hoge_id${k}`, false);
        expect(state.isCurrentMissionPlayerSuccess(`hoge_id${k}`)).toBe(false);
      }
    }
  });
});
describe('auto処理のテスト', () => {
  test('autoSelectMissionMemberが実行されると、canCurrentMissionVoteがtrueになること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      state.autoSelectMissionMember();
      expect(state.canCurrentMissionVote).toBeTruthy();
    }
  });
  test('autoVoteが実行されると、isCurrentMissionVoteCompleteがtrueになること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      state.autoVote();
      expect(state.isCurrentMissionVoteComplete).toBeTruthy();
    }
  });
  test('autoExecuteが実行されると、isCurrentMissionExecuteCompleteがtrueになること', () => {
    for (let i = 5; i <= 8; i++) {
      const state = new GameState({
        players: createState(i),
      });
      for (let j = 1; j <= i; j++) {
        state.setCanStartedPlayer(`hoge_id${j}`);
      }
      state.startGame();
      for (let k = 1; k <= i; k++) {
        state.addCurrentMissionMember(`hoge_id${k}`);
        state.autoExecute();
        expect(state.isCurrentMissionExecuteComplete).toBeTruthy();
      }
    }
  });
});
