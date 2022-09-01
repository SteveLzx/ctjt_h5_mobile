/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue';

declare module 'js-cookie';

// 对vue进行类型补充说明
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $http: any
  }
}

declare module 'dplayer';

declare module 'video.js';

declare module 'vue-video-player/src';

declare module 'vue-aliplayer-v3';

declare module 'Aliplayer';

declare module 'jquery';

declare module 'map';

declare module 'qrcodejs2';
