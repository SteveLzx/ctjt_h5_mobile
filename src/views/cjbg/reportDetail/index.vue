<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component class="view" :is="Component" />
      </transition>
    </router-view>
    <div>
      <van-tabbar v-model="active" safe-area-inset-top active-color="#3DB871" inactive-color="#000">
        <van-tabbar-item
          v-for="(item) in tabList"
          replace
          :to="item.url"
          :name="item.name"
          :icon="item.icon"
          :key='item.name'
        >
          {{item.title}}
        </van-tabbar-item>
      </van-tabbar>
    </div>
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
      icon: 'home-o',
      url: `/reportDetail/gross?trainingPlaceId=${getQueryString('trainingPlaceId')}&userId=${getQueryString('userId')}&appointId=${getQueryString('appointId')}`,
      name: 'Gross',
      title: '总体分析'
    }, {
      icon: 'home-o',
      url: `/reportDetail/error?trainingPlaceId=${getQueryString('trainingPlaceId')}&userId=${getQueryString('userId')}&appointId=${getQueryString('appointId')}`,
      name: 'Error',
      title: '错误解析'
    }, {
      icon: 'home-o',
      url: `/reportDetail/suggestions?trainingPlaceId=${getQueryString('trainingPlaceId')}&userId=${getQueryString('userId')}&appointId=${getQueryString('appointId')}`,
      name: 'Suggestions',
      title: '名师建议'
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
}
.tab_style{
  font-size: 48px;
}
.auth_con{
  height: 100vh;
  background: #F4F4F4;
  text-align: center;
  img{
    width: 240px;
    height: auto;
    padding-top: 360px;
  }
  p{
    line-height: 40px;
    color: #666;
    font-size: 28px;
    margin-top: 44px;
  }
}
</style>
