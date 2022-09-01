<template>
  <div class="content">
    <van-notice-bar
      left-icon="volume-o"
      wrapable
      background="#F0FFF8"
      color="#3db871"
    >
      <div class="notice_bar">
        考前5天，请联系{{myCoach.trueName}}统一安排练车。({{myCoach.mobileNo}})
      </div>
    </van-notice-bar>

    <van-cell-group v-for="(value, index) in resDate" :key="index" class="cell_group_margin" inset>
      <van-cell>
        <template #title>
          <span class="title" v-if="value.sortBy === 1">我的班主任</span>
          <span class="title" v-if="value.sortBy === 2">我的主教练</span>
          <span class="title" v-if="value.sortBy === 3">我的教练</span>
        </template>
      </van-cell>
      <van-cell>
        <template #icon>

          <div v-if="!value.profilePhoto" class="avatar"></div>
          <van-image
            v-if="value.profilePhoto"
            round
            width="0.8rem"
            height="0.8rem"
            :src="value.profilePhoto"
          ></van-image>
        </template>
        <template #label v-if="value.sortBy !== 1">
          <div :style="{minWidth: '3.5rem',color: '#666'}">
            <span>{{value.teachingYears}}年教龄 </span>
            <span>毕业学员{{value.graduateNum}}+个</span>
          </div>
        </template>
        <template #title>
          <span>{{value.trueName}}</span>
          <van-tag round color="#F0FFF8" text-color="#3DB871">{{medalLevelName[value.medalLevel]}}</van-tag>
        </template>
        <template #value >
          <i class="cell_icon_call iconfont" @click="call(value.mobileNo)">&#xe65b;</i>
        </template>
      </van-cell>
      <van-cell v-if="value.motto">
        <template #value>
          <span class="sub_text">{{value.motto}}</span>
        </template>
      </van-cell>
    </van-cell-group>
    <jump-service v-if="showJump" />
  </div>
</template>

<script lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue';
import {
  Cell,
  Image,
  Button,
  Icon,
  CellGroup,
  Tag,
  NoticeBar
} from 'vant';
import {
  verifyLogin, setBanBanTitle, banbanCall, getQueryString
} from '@/assets/js/common';
import { queryPlaceDuty } from './api';
import jumpService from '../xxtz/jumpService.vue';

export default {
  setup() {
    setBanBanTitle('我的教练');
    const { proxy } = getCurrentInstance();
    const showJump = ref(false);
    // 初始化接口返回数据
    const resDate = ref({});
    const video = ref('');
    // 初始化接口查询所需字段
    const query = reactive({
      venueId: getQueryString('venueId'),
      venueName: getQueryString('venueName')
    });
    const medalLevelName = ref({
      4: '银牌教练',
      5: '金牌教练',
      99: '班主任'
    });
    const myCoach = ref({});
    // 初始化页面
    const init = async () => {
      const res: any = await queryPlaceDuty(query);
      resDate.value = res || [];
      showJump.value = true;
      resDate.value.forEach((coach: any, index: any) => {
        if (coach.sortBy === 2) {
          myCoach.value = coach;
        }
      });
    };

    // 校验登录后查询教练场地信息
    verifyLogin().then(async () => {
      init();
    });

    const call = (mobile: string) => {
      console.log('mobile', mobile);
      banbanCall(mobile);
    };

    return {
      resDate,
      video,
      query,
      call,
      medalLevelName,
      showJump,
      myCoach
    };
  },
  components: {
    [Cell.name]: Cell,
    [Image.name]: Image,
    [Button.name]: Button,
    [Icon.name]: Icon,
    [CellGroup.name]: CellGroup,
    [Tag.name]: Tag,
    [NoticeBar.name]: NoticeBar,
    jumpService
  }
};
</script>

<style lang="less" scoped>
  .content{
    min-height: 100%;
    overflow: hidden;
    background: url("../../assets/images/contact_bg.png") no-repeat #f3f4fb;
    background-size: contain;
    padding-bottom: 0.24rem;
    .cell_icon{
      vertical-align: sub;
      color: #3db871;
      font-size: 32px;
    }
    .avatar{
      float: left;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-right: 24px;
      background: url('../../assets/images/sprite.png') no-repeat;
      background-size: 545px auto;
      background-position: -17px -208px;
    }
    .top_text{
      margin: 0 32px;
      font-size: 24px;
      color: #666;
      line-height: 72px;
      height: 72px;
    }
    .cell_group_margin{
      margin-top: 24px;
      &:last-child{
        margin-bottom: 24px;
      }
    }
    .cell_icon_call{
      vertical-align: text-top;
      color: #3db871;
      font-size: 48px;
      padding: 0.05rem;
    }
    .sub_text{
      color: #999;
    }
    .title{
      font-weight: bolder;
      font-size: 32px;
    }
  }
  .notice_bar{
    font-size: 24px;
    color: #666;
  }
</style>
