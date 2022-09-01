import { createApp } from 'vue';
import VConsole from 'vconsole';
import axios from '@/assets/js/request'; // axios封装
import { isMobile } from '@/assets/js/util';
import VideoPlayer from 'vue-video-player/src';

import * as Sentry from '@sentry/vue'; // 错误监控
import { Integrations } from '@sentry/tracing'; // 错误监控

import App from './App.vue';
import router from './router';
import store from './store';
import '@/assets/js/rem';
import '@/assets/js/permission'; // 权限控制
import '@/assets/css/common.less'; // 公共样式

import 'vue-video-player/src/custom-theme.css';
import 'video.js/dist/video-js.css';

const app = createApp(App);
const showVc = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test_env';
if (showVc && isMobile() && !window.location.href.includes('localhost')) {
  const vC = new VConsole();

  // 收集错误日志上报sentry
  Sentry.init({
    app,
    dsn: 'https://0729b30eefd648ed9a403d3710cf8115@o975245.ingest.sentry.io/6055389',
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ['localhost', /^\//],
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

app.config.globalProperties.$http = axios;

app.use(store).use(router).use(VideoPlayer).mount('#app');
