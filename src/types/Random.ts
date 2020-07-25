/** https://sbfl.net/blog/2017/06/01/javascript-reproducible-random/ */
export default class Random {
  private w: number;
  private x: number;
  private y: number;
  private z: number;

  constructor(seed = 88675123) {
    this.x = 123456789;
    this.y = 362436069;
    this.z = 521288629;
    this.w = seed;
  }

  /** XorShift */
  private next() {
    const t = this.x ^ (this.x << 11);
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    return (this.w = this.w ^ (this.w >>> 19) ^ (t ^ (t >>> 8)));
  }

  /** min以上max以下の乱数を生成する */
  nextInt(max: number, min = 0) {
    const r = Math.abs(this.next());
    return min + (r % (max - min));
  }

  //** 配列をシャッフルする */
  suffleArray<T>(array: T[]) {
    // FIXME: 対象数が3件程度で少ない場合、同じ結果に収束してしまうので、再度Math.random()でソートしている
    // Fisher–Yates shuffle https://qiita.com/komaji504/items/62a0f8ea43053e90555a
    for (let i = array.length - 1; i > 0; i--) {
      const r = Math.abs(this.next()) % i;
      const tmp = array[i];
      array[i] = array[r];
      array[r] = tmp;
    }
    return array.sort(() => Math.random() - 0.5);
  }
}
