import { Card, Phase, Player } from '@/types';

export type State = {
  phases?: Phase[];
  players?: Player[];
  isStarted?: boolean;
  currentVoteChecked?: boolean;
  currentMissionResultChecked?: boolean;
  isTimerHidden?: boolean;
  plotCards?: Card[];
  allPlayerTakenPlotCards?: Card[] | null;
  currentPlotCardsIndex?: number;
  currentCardUser?: Player | null;
  currentCard?: Card | null;
};
