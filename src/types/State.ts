import { Card, Phase, Player } from '@/types';

export type State = {
  phases?: Phase[];
  players?: Player[];
  isStarted?: boolean;
  currentVoteChecked?: boolean;
  currentMissionResultChecked?: boolean;
  isTimerHidden?: boolean;
  currentPlotCardsIndex?: number;
};
