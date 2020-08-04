import { Player } from '@/types';

export type Mission = {
  members?: { player: Player; isSuccess: boolean | null; isPublic: boolean }[];
  votes?: { player: Player; isApprove: boolean }[];
  leader: Player;
};
