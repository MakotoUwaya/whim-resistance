import { Mission } from '@/types';

export type Phase = {
  missions?: Mission[];
  missionCountExceeded?: boolean;
};
