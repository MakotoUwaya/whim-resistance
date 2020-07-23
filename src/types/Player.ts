import { Card } from '@/types';
import { User } from '@/types/User';

export type Player = User & {
  role?: 'resistance' | 'spy';
  cards?: Card[];
  canStarted?: boolean;
};
