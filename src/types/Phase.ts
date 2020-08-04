import { Card, Mission } from '@/types';

export type Phase = {
  missions?: Mission[];
  missionCountExceeded: boolean;
  plotCards: Card[];
};
