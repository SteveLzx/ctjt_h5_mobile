<template >
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component class="view" :is="Component" />
    </transition>
  </router-view>
  <div>
    <van-tabbar v-model="active" active-color="#3DB871" safe-area-inset-top inactive-color="#000">
      <van-tabbar-item
        v-for="(item) in tabList"
        replace
        :to="item.url"
        :name="item.name"
        :icon="item.icon"
        :key='item.name'
      >
        {{item.title}}
        <template #icon>
          <i class="iconfont tab_style" v-html="item.icon"></i>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  verifyLogin, setBanBanTitle, getYMD, getQueryString
} from '@/assets/js/common';
import { getToken } from '@/assets/js/token_cookie';
import {
  Tabbar,
  TabbarItem
} from 'vant';

export default {
  setup() {
    const { name } = useRoute();
    const active = ref(name);

    const tabList: any = [{
      url: `/coach/reportDetail/general?trainingPlaceId=${getQueryString('trainingPlaceId')}&userId=${getQueryString('userId')}`,
      name: 'General',
      title: '总体概况',
      icon: '&#xe663;'
    }, {
      url: `/coach/reportDetail/previous?trainingPlaceId=${getQueryString('trainingPlaceId')}&userId=${getQueryString('userId')}`,
      name: 'Previous',
      title: '上次练习',
      icon: '&#xe661;'
    }, {
      url: `/coach/reportDetail/history?trainingPlaceId=${getQueryString('trainingPlaceId')}&userId=${getQueryString('userId')}`,
      name: 'History',
      title: '历史练习',
      icon: '&#xe662;'
    }];

    return {
      active,
      tabList,
    };
  },
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
  }
};

</script>

<style lang="less" scoped>
.view{
  height: calc(100vh - 1rem);
  padding-bottom: 1rem;
  overflow: auto;
  background: #f3f4fb;
}
.tab_style{
  font-size: 48px;
}
</style>
