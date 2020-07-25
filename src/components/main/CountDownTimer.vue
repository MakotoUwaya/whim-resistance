<template>
  <countdown
    ref="countdown"
    :auto-start="false"
    :time="remainTime"
    class="countdown"
    :transform="transform"
    @end="timeeUp"
  >
    <template slot-scope="props"
      >{{ props.minutes }}:{{ props.seconds }}</template
    >
  </countdown>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

export const oneMinute = 60 * 1000;

@Component
export default class CountDownTimer extends Vue {
  @Prop({ type: Number, required: true }) remainTime!: number;
  @Prop({ type: Boolean, default: false }) isAbort!: boolean;

  @Watch("isAbort")
  onChangedIsAbort(current: boolean, old: boolean) {
    if (current === old) {
      return;
    }
    this.abortCountdown();
  }

  /** カウントダウンタイマーの表示整形 */
  transform(
    props: { minutes: string | number; seconds: string | number },
    digit = 2
  ) {
    props.minutes = props.minutes.toString().padStart(digit, "0");
    props.seconds = props.seconds.toString().padStart(digit, "0");
    return props;
  }
  mounted() {
    if (this.remainTime > 0 && this.remainTime !== 9999 * oneMinute) {
      this.startCountdown();
    }
  }
  startCountdown() {
    Vue.nextTick(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.$refs.countdown as any).start();
    });
  }
  abortCountdown() {
    Vue.nextTick(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.$refs.countdown as any).abort();
    });
  }
  timeeUp() {
    this.$emit("time-up");
  }
}
</script>

<style lang="scss" scoped>
.subtitle {
  font-weight: 300;
  font-size: 30px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
</style>
