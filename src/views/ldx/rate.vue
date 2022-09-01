<template>
<div class="content">
  <div class="title">我的邀请详情</div>
  <div class="invite_list">
    <div class="info">
      <div class="value">{{info.appySuccessCount|| 0}}<span class="unit">人</span></div>
      <div class="label">留下联系方式</div>
    </div>
    <div class="info">
      <div class="value">{{info.paymentSuccessCount|| 0}}<span class="unit">人</span></div>
      <div class="label">成功报名</div>
    </div>
    <div class="info">
      <div class="value">{{info.reward||0}}<span class="unit">元</span></div>
      <div class="label">获得奖金</div>
    </div>
  </div>
  <div class="title">看过邀请函的朋友(潜在客户) <span class="sub_title">{{list1.length}}人</span></div>
  <div class="list" v-if="list1.length>0">
    <div class="person" v-for="(l1,index) in (look1 ? list1: [list1[0]])" :key="index">
      <img class="avator" :src="l1.wechatLogoUrl||require('../../assets/images/ldx/ldx_morentouxiang.svg')" />
      <div class="name">{{l1.wechatNickname|| '微信用户'}}</div>
    </div>
    <div class="more" v-if="!look1&& list1.length>1" @click="lookMore1">
      <div>查看更多</div>
      <i class="iconfont icon_down">&#xe64c;</i>
    </div>
  </div>
  <div class="title">已留联系方式的朋友 <span class="sub_title">{{list2.length}}人</span></div>
  <div class="list" v-if="list2.length>0">
    <div class="person" v-for="(l2,index) in (look2 ? list2: [list2[0]])" :key="index">
      <img class="avator" :src="l2.wechatLogoUrl||require('../../assets/images/ldx/ldx_morentouxiang.svg')" />
      <div class="name">{{l2.wechatNickname|| '微信用户'}}</div>
      <div class="note">客服正在邀请他报名</div>
    </div>
    <div class="more" v-if="!look2&& list2.length>1" @click="lookMore2">
      <div>查看更多</div>
      <i class="iconfont icon_down">&#xe64c;</i>
    </div>
  </div>
  <div class="title">成功报名的朋友 <span class="sub_title">{{list3.length}}人</span></div>
  <div class="list" v-if="list3.length>0">
    <div class="person" v-for="(l3,index) in (look3 ? list3: [list3[0]])" :key="index">
      <img class="avator" :src="l3.wechatLogoUrl || require('../../assets/images/ldx/ldx_morentouxiang.svg')" />
      <div class="name">{{l3.wechatNickname || '微信用户'}}</div>
      <div class="note">报名成功</div>
    </div>
    <div class="more" v-if="!look3 && list3.length>1" @click="lookMore3">
      <div>查看更多</div>
      <i class="iconfont icon_down">&#xe64c;</i>
    </div>
  </div>
</div>

</template>

<script lang="ts">
import {
  ref, reactive, getCurrentInstance,
  onUnmounted
} from 'vue';

import {
  verifyLogin, setBanBanTitle, banbanCall, getQueryString, getBanBanToken
} from '@/assets/js/common';
import $http from '@/assets/js/request';
import { setToken, getToken, removeToken } from '@/assets/js/token_cookie';

export default {
  setup() {
    setBanBanTitle('');
    const info = ref({});
    const list = ref([]);
    const list1 = ref([]);
    const list2 = ref([]);
    const list3 = ref([]);
    const look1 = ref(false);
    const look2 = ref(false);
    const look3 = ref(false);

    const lookMore1 = () => {
      look1.value = true;
    };
    const lookMore2 = () => {
      look2.value = true;
    };
    const lookMore3 = () => {
      look3.value = true;
    };
    const getInviteTallys = async () => {
      const token: string = getBanBanToken();
      const res = await $http.post('sale/v1/recommend/queryRecommendInviteTallys', {
        banbanToken: token,
        activitiyId: 10001,
        openId: ''
      });
      info.value = res || {};
    };

    const getList = async () => {
      const token: string = getBanBanToken();

      const res = await $http.post('sale/v1/recommend/getActivityLogList', {
        banbanToken: token,
        activitiyId: 10001,
        openId: ''
      });
      list.value = res || [];
      list1.value = list.value.filter((item: any) => item.types === 1);

      list2.value = list.value.filter((item: any) => item.types === 2);
      list3.value = list.value.filter((item: any) => item.types === 4);
    };

    const init = () => {
      const token: string = getBanBanToken();
      setToken(token);
      getInviteTallys();
      getList();
    };
    init();
    return {
      info,
      list,
      list1,
      list2,
      list3,
      lookMore1,
      lookMore2,
      lookMore3,
      look1,
      look2,
      look3,
    };
  },
  components: {

  }
};
</script>

<style lang="less" scoped>
  .content{
    min-height: calc(100% - 70px);
    background: #D40620;
    padding-bottom: 70px;
    .title{
      font-size: 34px;
      color: #fff;
      padding: 40px 24px 24px 24px;
      width: calc(100% - 48px);
      .sub_title{
        float: right;
        color: #FEF97C;
      }
    }
    .invite_list{
      display: flex;
      margin: 0px 24px 24px;
      padding: 56px 0px;
      align-items: center;
      background: #fff;
      border-radius: 16px;
      .info{
        width: 33%;
        text-align: center;
        padding: 0.06rem;
        &:not(:last-child){
          border-right: 1px solid #E5E5E5;
        }
        .value{
          font-size: 48px;
          color: #D40620;
        }
        .unit{
          font-size: 24px;
        }
        .label{
          font-size: 24px;
          color: #999;
        }
      }
    }
    .list{
      margin: 0px 24px;
      background: #fff;
      border-radius: 16px;
      padding: 0px 32px;
      .person{
        height: 152px;
        display: flex;
        align-items: center;
        &:not(:last-child){
          border-bottom: 1px solid #E5E5E5;
        }
        .avator{
          width: 88px;
          height: 88px;
          border-radius: 44px;
          background: #e5e5e5;
          margin-right: 16px;
          min-width: 88px;
        }
        .name{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex-grow: 1;
          padding: 0 24px;
          border-left: 1px solid #E5E5E5;
          color: #999;
          font-size: 24px;
        }
        .note{
          color: #000;
          font-size: 24px;
          white-space: nowrap;
        }
      }
      .more{
        height: 70px;
        line-height: 70px;
        color: #999;
        display: flex;
        justify-content: space-between;
        font-size: 24px;
      }

    }
  }

</style>
