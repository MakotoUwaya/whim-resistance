import Vue from 'vue';
import App from '@/App.vue';
import whimClientVue from 'whim-client-vue';
import 'whim-client-vue/dist/whim-client-vue.css';
import vuetify from '@/plugins/vuetify';
import VueCountdown from '@chenfengyuan/vue-countdown';

Vue.config.productionTip = false;

// 通常はこれだけでよい
// Vue.use(whimClientVue);

// wh.imの開発時に用いるの設定
let targetOrigin: string;
if (new URL(window.location.toString()).searchParams.get('env') === 'dev') {
  targetOrigin = 'http://localhost:3000';
} else if (
  new URL(window.location.toString()).searchParams.get('env') === 'stg'
) {
  targetOrigin = 'https://stg.wh.im';
} else {
  targetOrigin = 'https://wh.im';
}
Vue.use(whimClientVue, { targetOrigin });
Vue.component(VueCountdown.name, VueCountdown);

new Vue({
  render: (h) => h(App),
  vuetify,
}).$mount('#app');
