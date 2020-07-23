export type User = {
  /** ユーザーのユニークなID */
  id: string;
  /** ユーザーが設定した名前 */
  name?: string;
  /** ユーザがルームに参加した時間 */
  timestamp?: Date;
  /** ユーザーが画面上で位置している場所 左上から時計回りに1,2,3,4,5,6,7,8と割り振られる */
  positionNumber?: number;
  /** ユーザーがプレイの途中から入ったかどうか 途中から入った場合trueが割り当てられる */
  entry?: boolean;
  /** ユーザーがプレイの途中で抜けたかどうか 途中で抜けた場合trueが割り当てられる */
  left?: boolean;
};
