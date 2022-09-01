<template >
<div class="content">
  <div class="top_content">
    <van-radio-group v-model="checked">
      <div :class="['radio_box', checked== '0'&&'radio_active']">
        <van-radio checked-color="#FE8A01" name="0">
          <div class="radio_label">
            <div class="icon1"></div>
            <span class="radio_title">模拟机学习阶段</span>
            <div class="learn_style" v-if="progress.learnPhase >= 0">正在学习</div>
            <div class="unstudy_style" v-if="progress.learnPhase < 0">未开始</div>
            <van-icon name="arrow" size="0.24rem" v-if="progress.learnPhase >= 0" color="#FE8A01" />
          </div>
        </van-radio>
      </div>
      <div :class="['radio_box', checked== '1'&&'radio_active']">
        <van-radio checked-color="#FE8A01" :disabled="progress.learnPhase < 1" name="1">
          <div class="radio_label">
            <div class="icon3"></div>
            <span class="radio_title">术科理论培训</span>
            <div class="learn_style" v-if="progress.learnPhase >= 1">正在学习</div>
            <div class="unstudy_style" v-if="progress.learnPhase < 1">未开始</div>
            <van-icon name="arrow" size="0.24rem" v-if="progress.learnPhase >= 1" color="#FE8A01" />
          </div>
        </van-radio>
      </div>
      <div :class="['radio_box', checked== '2'&&'radio_active']">
        <van-radio checked-color="#FE8A01" :disabled="progress.learnPhase <= 1" name="2">
          <div class="radio_label">
            <div class="icon2"></div>
            <span class="radio_title">实车学习阶段</span>
            <div class="learn_style" v-if="progress.learnPhase > 1">正在学习</div>
            <div class="unstudy_style" v-if="progress.learnPhase <= 1">未开始</div>
            <van-icon name="arrow" size="0.24rem" v-if="progress.learnPhase > 1" color="#FE8A01" />
          </div>
        </van-radio>
      </div>
    </van-radio-group>

  </div>
  <van-button color="#3DB871" size="large" @click="goToUrl">下一步</van-button>
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
  Icon,
  RadioGroup,
  Radio
} from 'vant';
import { queryStudentProgress } from './api';

export default {
  setup() {
    setBanBanTitle('预约学车');
    const { proxy } = getCurrentInstance();
    const progress = ref({});
    const checked = ref('');
    const goToAppointSimulator = () => {
      proxy.$root.$router.replace({
        path: '/appointSimulator',
      });
    };

    const goToAppointTraining = () => {
      if (progress.value.learnPhase > 0) {
        proxy.$root.$router.replace({
          path: '/training_appoint',
        });
      }
    };

    const goToAppointCar = () => {
      if (progress.value.learnPhase > 1) {
        proxy.$root.$router.replace({
          path: '/appoint_car',
        });
      }
    };

    const goToUrl = () => {
      if (checked.value === '0') {
        goToAppointSimulator();
      }
      if (checked.value === '1') {
        goToAppointTraining();
      }
      if (checked.value === '2') {
        goToAppointCar();
      }
    };

    verifyLogin().then(async () => {
      const studentProgress: any = await queryStudentProgress();
      progress.value = studentProgress || {};
      if (studentProgress.learnPhase === 1) {
        checked.value = '1';
      } else if (studentProgress.learnPhase === 0) {
        checked.value = '0';
      } else {
        checked.value = '2';
      }
    });
    return {
      goToAppointSimulator,
      goToAppointCar,
      progress,
      checked,
      goToUrl
    };
  },
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio
  }
};

</script>

<style lang="less" scoped>
  .content{
    height: calc(100% - 0.48rem);
    background: #f3f4fb;
    padding: 0.24rem 0.36rem;
  }
  .top_content{
    min-height: calc(100% - 1.5rem);
  }
  .radio_box{
    background: #fff;
    padding: 0.24rem 0.32rem;
    margin-bottom: 0.32rem;
    border-radius: 0.08rem;
    font-size: 0.34rem;
    &.radio_active{
      outline: 1px solid #FE8A01;
    }
    /deep/ .van-radio__label{
      flex-grow: 1;
    }
    .radio_label{
      display: flex;
      align-items: center;
      .radio_title{
        flex-grow: 1;
      }
    }

  }
  .isChecked{
    border: 1px solid #3DB871;
  }
  .normal{
    border: 1px solid #fff;
  }
  .icon_style{
    font-size: 0.34rem;
    color: #3DB871;
    margin-right: 0.16rem;
  }
  .icon_no_checked{
    font-size: 0.34rem;
    color: #E5E5E5;
    margin-right: 0.16rem;
  }
.auth_con{
  height: 100%;
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
.icon1{
  width: 70px;
  height: 70px;
  margin: 0 auto;
  background: url('../../../assets/images/icon1.png') no-repeat;
  background-size: 750px auto;
  background-position: -25px -220px;
}
.icon2{
  width: 70px;
  height: 70px;
  margin: 0 auto;
  background: url('../../../assets/images/icon1.png') no-repeat;
  background-size: 750px auto;
  background-position: -105px -220px;
}
.icon3{
  width: 70px;
  height: 70px;
  margin: 0 auto;
  background: url('../../../assets/images/sprite.png') no-repeat;
  background-size: 750px auto;
  background-position: -678px -42px;
}
.learn_style{
  color: #FE8A01;
  font-size: 0.22rem;
}
.unstudy_style{
  font-size: 0.22rem;
  color: #999999;
}
</style>
