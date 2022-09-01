<template >
<div class="content">
  <div v-if="data.stuId">
    <div class="top_content">
      <div class="base_info">
        <div class="user_content">
          <div class="user">
            <van-image
              v-if="data.headUrl"
              round
              width="0.8rem"
              height="0.8rem"
              :src="data.headUrl"
            ></van-image>
            <div v-if="!data.headUrl" class="default_image"></div>
            <div v-if="data.sex==='0'" class="default_man"></div>
            <div v-if="data.sex==='1'" class="default_woman"></div>
            <div class="bind_coach">{{data.bindCoachName && data.bindCoachName.split('')[0]}}</div>
          </div>
          <div>{{data.trueName}}</div>
        </div>
        <div class="user_content">
          <i class="iconfont user" :style="{color: '#3DB871'}">&#xe67d;</i>
          <div>{{data.idNo}}</div>
        </div>
      </div>
      <div class="detail_info">
        <div class="item_content">
          <div class="item_value">{{data.mobileNo}}</div>
          <div class="item_label">手机号</div>
        </div>
        <div class="item_content">
          <div class="item_value">{{data.analogPhaseName}}</div>
          <div class="item_label">学习进度</div>
        </div>
        <div class="item_content">
          <div class="item_value">{{data.totalPracticeTime}}小时</div>
          <div class="item_label">总时长</div>
        </div>
      </div>
    </div>
    <van-button color="#357EF9" size="normal" class="btn" @click="skipPractice">跳过模拟机学习</van-button>
  </div>

  <div v-if="!data.stuId" class="no_data">
    <div></div>
    <p>查询不到此学员</p>
  </div>
</div>

</template>

<script lang="ts">
import { ref, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import {
  verifyLogin, setBanBanTitle, getYMD, getQueryString
} from '@/assets/js/common';
import { getToken } from '@/assets/js/token_cookie';
import {
  Button,
  Toast,
  Image,
  Dialog
} from 'vant';
import {
  coachQueryAnalogPhase, skipAnalogPractice
} from './api';

export default {
  setup() {
    setBanBanTitle('修改进度');
    const { proxy } = getCurrentInstance();
    const data = ref({});
    const skipPractice = () => {
      Dialog.confirm({
        title: `是否确认帮助学员${data.value.trueName}跳过模拟机学习？`,
        message: '',
        confirmButtonColor: '#357EF9',
      })
        .then(async () => {
          const params: any = {
            stuId: data.value.stuId
          };
          await skipAnalogPractice(params);
          Toast('修改成功');
          setTimeout(() => {
            proxy.$root.$router.back();
          }, 4 * 1000);
        })
        .catch(() => {
          // on cancel
        });
    };

    const query = async () => {
      const params: any = {
        mobileNoOrIdNo: getQueryString('No')
      };
      setTimeout(() => {
        proxy.$root.$router.back();
      }, 5 * 60 * 1000);
      const res = await coachQueryAnalogPhase(params);
      console.log(res);
      data.value = res || {};
    };
    query();
    return {
      data,
      skipPractice
    };
  },
  components: {
    [Button.name]: Button,
    [Image.name]: Image
  }
};

</script>

<style lang="less" scoped>
  .content{
    height: calc(100% - 0.48rem);
    background: #f5f3f5;
    padding: 0.24rem 0.36rem;
  }
  .top_content{
    margin-top: 3.5rem;
    background: #fff;
    border-radius: 8px;
    padding: 24px;
  }
  .base_info{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #E5E5E5;
    height: 48px;
    line-height: 48px;
    font-size: 28px;
    padding-bottom: 24px;
  }
  .detail_info{
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    padding: 32px 0px 8px;
    :not(:last-child).item_content{
      border-right: 1px solid #E5E5E5;
    }
    .item_content{
      flex: 1;
      .item_value{
        font-size: 28px;
        color: #000;
      }
      .item_label{
        font-size: 22px;
        color: #999;
      }
    }

  }
  .user_content{
    display: flex;
    justify-content: start;
    align-items: center;
  }
  .user{
    position: relative;
    min-width: 0.5rem;
    font-size: 30px;
    text-align: center;
    .default_image{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: inline-block;
      background: url('../../../assets/images/sprite.png') no-repeat;
      background-size: 280px auto;
      background-position: -10px -109px;
      vertical-align: middle;
    }
    .default_man{
      position: absolute;
      top: 0px;
      right: 32px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: inline-block;
      background: url('../../../assets/images/sprite.png') no-repeat;
      background-size: 560px auto;
      background-position: -215px -260px;
      vertical-align: middle;
    }
    .default_woman{
      position: absolute;
      top: 0px;
      right: 32px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: inline-block;
      background: url('../../../assets/images/sprite.png') no-repeat;
      background-size: 560px auto;
      background-position: -235px -260px;
      vertical-align: middle;
    }
    .bind_coach{
      position: absolute;
      left: -20px;
      top: -30px;
      font-size: 20px;
    }
  }
  .btn{
    margin: 100px auto 0px;
    display: flex;
  }
  .no_data{
    background: transparent;
    div{
      width: 272px;
      height: 262px;
      margin: 300px auto 0;
      background: url('../../../assets/images/nonichewuxinxi.png') no-repeat;
      background-size: 272px auto;
    }
    p{
      text-align: center;
      color: #666;
      margin-top: 24px;
      line-height: 40px;
      font-size: 28px;
    }
  }
</style>
