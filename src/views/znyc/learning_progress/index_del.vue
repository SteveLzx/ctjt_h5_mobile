// pages_znyc/learning_progress
<template>
  <div class="learning_progress">
    <div class="progress_box">
      <ul class="progress_list">
        <li class="progress" v-for="(item, index) in learnPlan" :key="item.projectLevel" :class="{'active': item.projectLevel <= projectLevel}">
          <i class="iconfont"></i>
          <div class="time_line" v-if="index < learnPlan.length - 1"></div>
          <i class="icon_img" :class="`bg${item.projectLevel}`"></i>{{item.projectName}}
          <ul class="subject_box" v-if="item.learnPhaseDtoList.length > 1">
            <li class="subject" style="border: 1px solid rgba(153, 153, 153, 1);"
              v-for="val in item.learnPhaseDtoList" :key="val.learnPhase">
              {{val.learnPhaseName}}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import $http from '@/assets/js/request';
import { verifyLogin, setBanBanTitle } from '@/assets/js/common';

type ParamsType = {
  [key: string]: string | boolean | number;
}
function queryLearnPlan(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/queryLearnPlan', data).then(res => resolve(res));
  });
}
export default {
  setup() {
    setBanBanTitle('学习计划');
    const route = useRoute();
    const { query } = route;
    const learnPlan = ref([]);
    const projectLevel = ref(query.projectLevel);
    // 校验登录
    verifyLogin().then(() => {
      queryLearnPlan(query as ParamsType).then(res => {
        const arr = (res as any[]).filter(item => item.projectLevel > 1);
        learnPlan.value = arr;
      });
    });
    return { learnPlan, projectLevel };
  }
};

</script>

<style lang="less" scoped>
.learning_progress{
  background: #F5F3F5;
  height: 100%;
  overflow: scroll;
  .progress_box{
    display: flex;
  }
  .progress_list{
    flex: 1;
    padding: 24px 24px 0 78px;
  }
  .progress{
    padding: 32px 32px 32px 87px;
    background: #fff;
    border-radius: 8px;
    line-height: 48px;
    font-size: 34px;
    color: #999;
    font-weight: 500;
    position: relative;
    margin-bottom: 32px;
    border: solid 1px #e5e5e5;
    position: relative;
    .iconfont{
      display: inline-block;
      width: 26px;
      height: 26px;
      border: solid 4px #D8D8D8;
      border-radius: 50%;
      position: absolute;
      left: -54px;
      top: 40px;
    }
    .time_line{
      position: absolute;
      height: 102%;
      width: 4px;
      background: #d8d8d8;
      top: 73px;
      left: -38px;
    }
    .icon_img{
      position: absolute;
      top: 33px;
      left: 24px;
      width: 46px;
      height: 46px;
      margin-right: 16px;
      background: url('../../../assets/images/sprite.png') no-repeat;
      background-size: 750px auto;
      &.bg0{
        background-position: -684px -54px;
      }
      &.bg1{
        background-position: -614px -54px;
      }
      &.bg2{
        background-position: -118px -54px;
      }
      &.bg3{
        background-position: -202px -54px;
      }
      &.bg4{
        background-position: -290px -54px;
      }
      &.bg5{
        background-position: -376px -54px;
      }
      &.bg6{
        background-position: -460px -54px;
      }
      &.bg7{
        background-position: -544px -54px;
      }
    }
    &.active{
      border: solid 1px #3DB871;
      color: #000;
      .iconfont{
        border: none;
        width: 30px;
        height: 30px;
        background: url('../../../assets/images/sprite.png') no-repeat;
        background-size: 750px auto;
        background-position: -48px -70px;
        background-color: #fff;
        left: -50px;
        top: 44px;
      }
      .time_line{
        background: #3DB871;
      }
    }
    .subject_box{
      overflow: hidden;
      .subject{
        padding: 0 10px;
        min-width: 110px;
        font-size: 24px;
        color: #999;
        float: left;
        border-radius: 8px;
        border: 1px solid rgba(153, 153, 153, 1);
        text-align: center;
        margin-right: 24px;
        margin-top: 24px;
        height: 36px;
        display: flex;
        align-items: center;
      }
      &.width_160 li{
        width: 155px;
        &:nth-child(1),&:nth-child(2), &:nth-child(3) {
          margin-bottom: 24px;
        }
      }
    }
  }
}
</style>
