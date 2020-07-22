declare module '*.vue' {
  import Vue from 'vue';
  import { Room } from '@/types/Room';
  import { State } from '@/types/State';
  import { User } from '@/types/User';
  export default Vue;
  module 'vue/types/vue' {
    interface Vue {
      $whim: {
        /** ルームに入っているユーザー一覧 */
        users: User[],
        /** Room Object */
        room: Room,
        /** 現在アクセスしているUser */
        accessUser: User,
        /** ゲームの状態 */
        state: State,
        /** 画面の縦向き(portrait)or横向き(landscape) */
        orientation: 'portrait' | 'landscape',
        /** ゲーム情報の差分更新を行います。v1.1よりネストしたオブジェクトも扱えるように更新されました。 */
        assignState: (state: State) => void,
        /** stateの情報を削除します。引数はオプショナルです。引数を渡すと、その値に初期化されます。ゲームのはじめから機能等に有用です。 */
        resetState: (state?: State) => void,
        /** */
        sound: (type: string) => void
      };
    }
  }
}

declare module 'vuetify/lib/locale/ja';
declare module 'whim-client-vue';
