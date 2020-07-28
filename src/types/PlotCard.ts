import { Card, Player } from '@/types';

export function InitializePlotCards(players: Player[]): Card[] {
  const baseCards: Card[] = [
    {
      id: 1,
      name: '責任者',
      image: 'Plot_TakeResponsibility.png',
      description:
        'あなたは他のプレイヤーの陰謀カードを1枚引き取らなければならない。',
      timing: '即時',
      oneTime: true,
      used: false,
    },
    {
      id: 2,
      name: '強力なリーダー',
      image: 'Plot_StrongLeader.png',
      description:
        'あなたはリーダーになれる。陰謀カードが分配される前に使用する。',
      timing: '選択前',
      oneTime: true,
      used: false,
    },
    {
      id: 3,
      name: '強力なリーダー',
      image: 'Plot_StrongLeader.png',
      description:
        'あなたはリーダーになれる。陰謀カードが分配される前に使用する。',
      timing: '選択前',
      oneTime: true,
      used: false,
    },
    {
      id: 4,
      name: '不信',
      image: 'Plot_NoConfidence.png',
      description:
        'あなたは承認された投票を無効とし、リーダーを交代させることができる。',
      timing: '投票後',
      oneTime: true,
      used: false,
    },
    {
      id: 5,
      name: '総意の形成者',
      image: 'Plot_OpinionMaker.png',
      description:
        'あなたはこのカードを獲得した後、他のプレイヤーより先に投票カードを公開して投票しなくてはならない。',
      timing: '投票前',
      oneTime: false,
      used: false,
    },
    {
      id: 6,
      name: '監視者',
      image: 'Plot_KeepingCloseEyeOnYou.png',
      description:
        'あなたは、プレイヤーの前に出されたミッションカードを１枚見ることができる。',
      timing: '遂行後',
      oneTime: true,
      used: false,
    },
    {
      id: 7,
      name: '監視者',
      image: 'Plot_KeepingCloseEyeOnYou.png',
      description:
        'あなたは、プレイヤーの前に出されたミッションカードを１枚見ることができる。',
      timing: '遂行後',
      oneTime: true,
      used: false,
    },
  ];

  if (players.length < 7) return baseCards;

  const addedCards: Card[] = [
    {
      id: 8,
      name: '総意の形成者',
      image: 'Plot_OpinionMaker.png',
      description:
        'あなたはこのカードを獲得した後、他のプレイヤーより先に投票カードを公開して投票しなくてはならない。',
      timing: '投票前',
      oneTime: false,
      used: false,
    },
    {
      id: 9,
      name: '立ち聞きされた会話',
      image: 'Plot_OverheardConversation.png',
      description:
        'あなたはすぐ右にいるか左にいるプレイヤー1人の役割カードの中身を見なければならない。',
      timing: '即時',
      oneTime: true,
      used: false,
    },
    {
      id: 10,
      name: '立ち聞きされた会話',
      image: 'Plot_OverheardConversation.png',
      description:
        'あなたはすぐ右にいるか左にいるプレイヤー1人の役割カードの中身を見なければならない。',
      timing: '即時',
      oneTime: true,
      used: false,
    },
    {
      id: 11,
      name: '情報開示',
      image: 'Plot_OpenUp.png',
      description:
        'あなたは自分の役割カードをあなたの選んだ他のプレイヤー(リーダーを含む)１人に見せなくてはならない。',
      timing: '即時',
      oneTime: true,
      used: false,
    },
    {
      id: 12,
      name: '注目の的',
      image: 'Plot_InTheSpotlight.png',
      description:
        'あなたは他のプレイヤー１人を選び、ミッションカードを公開して提出させることができる。',
      timing: '遂行前',
      oneTime: true,
      used: false,
    },
    {
      id: 13,
      name: '信用の確立',
      image: 'Plot_EstablishConfidence.png',
      description:
        'リーダーは自分の役割カードを他のプレイヤー１人を選んで見せなくてはならない。',
      timing: '即時',
      oneTime: true,
      used: false,
    },
    {
      id: 14,
      name: '不信',
      image: 'Plot_NoConfidence.png',
      description:
        'あなたは承認された投票を無効とし、リーダーを交代させることができる。',
      timing: '投票後',
      oneTime: true,
      used: false,
    },
    {
      id: 15,
      name: '不信',
      image: 'Plot_NoConfidence.png',
      description:
        'あなたは承認された投票を無効とし、リーダーを交代させることができる。',
      timing: '投票後',
      oneTime: true,
      used: false,
    },
  ];
  return baseCards.concat(addedCards);
}
