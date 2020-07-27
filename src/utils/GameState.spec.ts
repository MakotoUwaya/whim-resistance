import { GameState } from './GameState';

describe('Stepのテスト', () => {
  test('空のstateが与えられたとき、「待機」になること', () => {
    const state = new GameState({});
    expect(state.currentStep).toBe('待機');
  });
});
