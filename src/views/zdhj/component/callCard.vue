<template>
  <div class="card">
    <div class="card_top">
      <div>{{info.carCode}}</div>
      <div @click="call" v-if="info.isCanCall==1">
        <i class="iconfont call_icon">&#xe65b;</i>
      </div>
    </div>
    <van-divider />
    <div v-if="info.userName" @click="goToReport">
      <div class="card_center">
        <div class="user_content">
          <div class="user_image"></div>
          <span>{{info.userName}}</span>
        </div>
        <van-tag color="#FFEEE3" text-color="#FA6400" v-if="info.reserveStatus==0 && (Number(info.practiceTime) >= Number(info.examinareHours))" size="large" round>可约考</van-tag>
        <van-tag color="#DEFFF0" text-color="#3DB871"  v-if="info.reserveStatus==1" size="large" round>批复时间: {{getYMD(1, info.examTime)}}</van-tag>
      </div>
      <div class="card_bottom">
        <div class="bottom_Item">
          <div class="item_value">{{info.appointPhase || '-'}}</div>
          <div class="item_label">本次预约</div>
        </div>
        <div class="line"></div>
        <div class="bottom_Item">
          <div class="item_value">{{info.studyProgress || '-'}}</div>
          <div class="item_label">学习进度</div>
        </div>
        <div class="line"></div>
        <div class="bottom_Item">
          <div class="item_value">{{info.mobileNo || '-'}}</div>
          <div class="item_label">手机号</div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="card_center not_login">
        <div class="user_content">
          <div class="user_not_login"></div>
          <span>未登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref, reactive, getCurrentInstance, toRefs
} from 'vue';
import {
  Image, Button, List, Icon, Divider, Tag
} from 'vant';
import {
  callUser, getYMD
} from '@/assets/js/common';
// import {  } from './api';

export default {
  setup(props: any) {
    const count = ref({});
    const { proxy } = getCurrentInstance();
    const call = () => {
      const { trainingPlaceId, info = {} } = toRefs(props);
      console.log(11111, trainingPlaceId.value, info.value);
      callUser(trainingPlaceId.value, info.value);
    };
    const goToReport = () => {
      const { trainingPlaceId, info = {} } = toRefs(props);
      console.log(111, trainingPlaceId, info.userId);
      proxy.$root.$router.push({
        path: '/coach/reportDetail/general',
        query: {
          trainingPlaceId: trainingPlaceId.value,
          userId: info.value.userId,
        }
      });
    };
    return {
      count,
      call,
      goToReport,
      getYMD
    };
  },
  components: {
    [Image.name]: Image,
    [Button.name]: Button,
    [List.name]: List,
    [Icon.name]: Icon,
    [Divider.name]: Divider,
    [Tag.name]: Tag
  },
  props: {
    info: {
      default: () => ({})
    },
    trainingPlaceId: {
      default: ''
    }
  }
};

</script>

<style lang="less" scoped>
.card{
  padding: 0.24rem;
  background: #fff;
  border-radius: 0.08rem;
  .card_top{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .call_icon{
      font-size: 48px;
      color: #00CA84;
    }
  }
  .card_center{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 00.32rem;
    .user_content{
      display: flex;
      align-items: center;
      font-size: 28px;
      color: #000;
      .user_image{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: inline-block;
        background: url('../../../assets/images/sprite.png') no-repeat;
        background-size: 280px auto;
        background-position: -10px -109px;
        margin-right: 0.1rem;
      }
    }
  }
  .not_login{
    margin-bottom: 0.1rem;
  }
  .user_not_login{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: inline-block;
    background: url('../../../assets/images/sprite.png') no-repeat;
    background-size: 392px auto;
    background-position: -151px -88px;
    margin-right: 0.1rem;
  }
  .card_bottom{
    display: flex;
    justify-content: space-around;
    align-items: center;
    .line{
      height: 0.8rem;
      width: 0.01rem;
      background: #E5E5E5;
    }
    .bottom_Item{
      display: flex;
      align-items: center;
      flex-direction: column;
      text-align: center;
      width: 32%;
      .item_value{
        font-size: 28px;
        color: #000;
        margin-bottom: 0.12rem;
        height: 28px;
        line-height: 28px;
      }
      .item_label{
        font-size: 22px;
        color: #999;
        height: 28px;
        line-height: 28px;
      }
    }
  }
}
</style>
