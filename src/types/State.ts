import { Card, Phase, Player } from '@/types';

export type State = {
  phases?: Phase[];
  players?: Player[];
  isStarted?: boolean;
  currentVoteChecked?: boolean;
  currentMissionResultChecked?: boolean;
  isTimerHidden?: boolean;
  // PlotCards
  plotCards?: Card[];
  currentPlotCardsIndex?: number;
  currentCardUser?: Player | null;
  currentCard?: Card | null;
  // Plot_TakeResponsibility
  allPlayerTakenPlotCards?: Card[] | null;
  // Plot_OverheardConversation
  canOverheardConversation?: { player: Player; isPublic: boolean }[] | null;
  // Plot_OpenUp, Plot_EstablishConfidence
  openUpViewer?: Player | null;
  openUpExecuting?: boolean;
};
