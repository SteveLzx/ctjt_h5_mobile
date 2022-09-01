<template>
<transition name="fade">
  <router-view v-slot="{ Component }">
    <!-- 缓存页面 -->
    <keep-alive>
      <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.path"/>
    </keep-alive>
    <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.path"/>
  </router-view>
</transition>
</template>

<script lang="ts">
import { ref } from 'vue';
import {
  Dialog
} from 'vant';
import {
  getAppVersion,
  getBanBanToken,
} from '@/assets/js/common';
import { getToken } from '@/assets/js/token_cookie';

export default {
  setup() {
    const isNewVersion = (version: string, oldVersion: string) => {
      const newV = version.split('.');
      const oldV = oldVersion.split('.');
      let bool = false;
      newV.forEach((ver, index) => {
        if (Number(ver) > Number(oldV[index])) {
          bool = true;
        }
      });

      return !bool;
    };

    const init = () => {
      const appVersion: string = getAppVersion();
      const token: string = getBanBanToken();
      const banbanTokenObj = JSON.parse(getToken('banbanTokenObj')) || {};
      const notTipEnv = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test_env' || document.domain.includes('localhost');

      if (isNewVersion(appVersion, '4.7.0') && !banbanTokenObj.coachId && !getToken('loginName') && !notTipEnv) {
        Dialog.alert({
          title: '更新提示',
          message: '您的版本过低，建议您去下载最新版',
        }).then(() => {
          // on close
        });
      }
    };
    init();

    return { };
  }
};

</script>
