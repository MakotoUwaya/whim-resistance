export type Card = {
  id: number;
  name: string;
  image: string;
  description: string;
  timing: Timing;
  oneTime: boolean;
  used: boolean;
};

export type Timing =
  | '即時'
  | '配布前'
  | '選択前'
  | '投票前'
  | '投票後'
  | '遂行前'
  | '遂行後'
  | '利用不可';
