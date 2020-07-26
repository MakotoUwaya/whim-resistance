# wh.im Resistance ![Build](https://github.com/MakotoUwaya/whim-resistance/workflows/Deploy/badge.svg)

![title](./public/title.png)

## Description

- Can play game "Resistance" on [wh.im](https://wh.im/).
- For the Japanese.
- The Resistance is a social deduction game with secret identities.
- Players are either members of the Resistance attempting to overthrow a malignant government, or Spies trying to thwart the Resistance.
- The Resistance wins the game if three Missions are completed successfully; the Spies win if three Missions fail.
- The Spies can also win if the Resistance is unable to organize the Mission Team at any point in the game (5 failed votes on a single mission).
- A fundamental rule of the game is that players may say anything that they want, at anytime during the game. Discussion, deception, intuition, social interaction and logical deductions are all equally important to winning.

## Using

```
yarn
yarn serve
```

## How to play

### English

#### Purpose of the game

- [Game rules](https://www.ultraboardgames.com/the-resistance/game-rules.php)
- TBD [Extended pack](https://www.ultraboardgames.com/the-resistance/the-plot-tickens.php)

### Japanese

#### ゲームの説明

- 正体を隠したスパイとレジスタンスの推理ゲーム
- １ゲーム目安時間 30分
    - ゲーム中に人が減ったとき、ゲームを再起動します。
    - 同じくゲーム中に人が増えたとき、レジスタンス陣営として追加されます。
    - ゲームは再起動しませんが、新しく参加したメンバーはいないものとしてゲームを進めて下さい。

##### プレイヤーの役割

| 役割 \ プレイヤー数 | 5 | 6 | 7 | 8 |
|:----------:|:--:|:--:|:--:|:--:|
| レジスタンス | 3 | 4 | 4 | 5 |
| スパイ      | 2 | 2 | 3 | 3 |

##### ミッションに必要な人数

| フェーズ \ プレイヤー数 | 5 | 6 | 7 | 8 |
|:--------------:|:--:|:--:|:--:|:--:|
| 1              | 2 | 2 | 2 | 3 |
| 2              | 3 | 3 | 3 | 4 |
| 3              | 2 | 4 | 3 | 4 |
| 4              | 3 | 3 | *4* | *5* |
| 5              | 3 | 4 | 4 | 5 |

- 4回目は特殊ルール発動

#### 目的

- レジスタンスはプレイヤーが自分達の本当の陣営を隠してお互いの正体を推理するゲームです。
- プレイヤーは圧政を敷く政府の転覆を図るレジスタンス側か、レジスタンス活動を妨害するスパイ側のいずれかの陣営に属することになります。
- レジスタンス側はミッションに3回成功したら勝利し、スパイ側はミッションを3回失敗させたら勝利します。
- またスパイは、ゲーム中いずれの時点でもミッションチームを編集失敗とさせた場合(1つのミッションで5回投票に失敗した場合)にも勝利します。
- ゲームの基本的なルールとして、プレイヤー何時、何を話してもかまいません。
- 討論、欺瞞、直観、人間関係、そして論理的な推察のどれもが等しくゲームの勝利には必要とされます。

#### ゲームの進行

- ゲームはいくつかのラウンドを繰り返して進行します。
- 各ラウンドはチーム編成フェイズとミッションフェイズに分かれます。

##### チーム編成

- チーム編成フェイズでは、リーダーがチームに参加させるプレイヤーを選び、そのミッションチームの編成を全プレイヤーが承認か否認の投票にかけます。

- ミッションチーム参加の指名：適宜討論の上、リーダーはミッションチーム参加の指名を行います。
- ミッションチーム編成の信任投票：適宜討論の上、リーダーはチーム編成の信任投票を開始します。
- 過半数が「承認」だった場合、チーム編成は認められます。
- 過半数が「否認」だった場合、チーム編成は認められません。同数の場合も認められません。
- ミッションチームの編成が認められた場合、ミッションフェイズに進みます。
- ミッションチームの編成が認められなかった場合、リーダーを右隣のプレイヤーに変更して、再びチーム編成フェイズを繰り返します。

##### 任務の指揮

- ミッションチームに選ばれたプレイヤーは、それぞれミッションを遂行するか妨害するかを選ばなくてはなりません。
- 「成功」か「失敗」のいずれかを選びます。
- ミッションはすべてが「成功」の場合成功となります。
- 1枚でも「失敗」があった場合、ミッションは失敗に終わります。

- 注：レジスタンス側が選ぶ際には「成功」を選ばなくてはなりません。スパイ側は「成功」か「失敗」を選ぶことになります。

- 注：7人以上でプレイしていた場合、第4ミッションで任務を失敗させるには少なくとも2つの失敗が必要になります。

- リーダーは右隣のプレイヤーにリーダーを渡し変更し、次のラウンドのチーム編成フェイズをはじめます。

#### ゲームの終了

- ゲームはミッションが3回成功するか、3回失敗した時点で即座に終了となります。
- 成功が3回ならレジスタンス側の、失敗が3回ならスパイ側の勝利となります。

##### 注意

- レジスタンスにおける情報は様々なレベルにわたって存在します。
- 第一にプレイヤーの投票パターン、第二にミッションの結果、第三にプレイヤー同士の討議における些細な兆候があります。
- レジスタンス活動のためにはありとあらゆる手段を使ってスパイの謀略を阻止しなくてはなりません。
- 強力な政府を転覆させるのは容易ではありません。特に基本ゲームにおいて7人以上でプレイした場合、かなりの確率でスパイが勝利することが予期できます。「深まる陰謀」の選択ルールを採用している場合、レジスタンス側が抵抗活動をする際に追加の情報が与えられることになり、スパイ側はより欺瞞を行う機会が増えることになります。

#### 選択ルール

- レジスタンスのルールは実際にゲームをプレイするメンバーに非常に依存しているので、様々な選択ルールを自由に採用してみてください。人気のある選択ルールは以下の2種類です。
  - 目標：リーダーがミッションとチームメンバーを選びます。それぞれのミッションは1度ずつ選ぶことができ、第5ミッションは2回のミッションを成功させた後で選ぶことができます。
  - ブラインドスパイ：スパイの表明を行いません。
- そのほかの選択ルールに関しては、 http://www.indieboardsandcards.com をご覧ください(英語)。

- [カードゲーム版マニュアル](./wiki/RealCardInfomation.md)
- TBD [拡張パック](./wiki/PlotThickensRule.md)
