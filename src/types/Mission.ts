import { Player } from '@/types';

export type Mission = {
  members?: { player: Player; isSuccess: boolean | null }[];
  votes?: { player: Player; isApprove: boolean }[];
  leader: Player;
};
