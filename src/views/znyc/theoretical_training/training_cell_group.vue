<template >
<div class="content" v-if="authFlag">
  <div>
    <div :class="['radio_box']" @click="goToTrainingApply">
      <i class="iconfont icon_style">&#xe66e;</i>
      <span class="radio_title">理论课申请</span>
      <span>
        <van-icon name="arrow" color="#9c9c9c" />
      </span>
    </div>
    <div :class="['radio_box']"  @click="goToTrainingSearch">
      <i class="iconfont icon_style">&#xe66d;</i>
      <span class="radio_title">理论课查询</span>
      <span>
        <van-icon name="arrow" color="#9c9c9c" />
      </span>
    </div>
    <div :class="['radio_box']"  @click="goToTrainingSetting">
      <i class="iconfont icon_style">&#xe793;</i>
      <span class="radio_title">其它设置</span>
      <span>
        <van-icon name="arrow" color="#9c9c9c" />
      </span>
    </div>
  </div>
</div>
<div class="auth_con" v-if="!authFlag">
  <img src="../../../assets/images/a_c_auth.png" alt="">
  <p>您没有提交申请的权限，请联系片区经理～</p>
</div>
</template>

<script lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  verifyLogin, setBanBanTitle, getYMD, getQueryString
} from '@/assets/js/common';
import { getToken } from '@/assets/js/token_cookie';
import {
  Button,
  Toast,
  Icon
} from 'vant';

export default {
  setup() {
    setBanBanTitle('理论课');
    const { proxy } = getCurrentInstance();
    const qrcodeDom = ref({});
    const goToTrainingApply = () => {
      proxy.$root.$router.push({
        path: '/coach/training_apply',
      });
    };

    const goToTrainingSearch = () => {
      proxy.$root.$router.push({
        path: '/coach/training_search',
      });
    };

    const goToTrainingSetting = () => {
      proxy.$root.$router.push({
        path: '/coach/training_setting',
      });
    };

    // 登录后没有姓名则无权提交
    const authFlag = ref(true);
    // 校验登录后查询教练场地信息
    verifyLogin(1).then(async () => {
      console.log("getToken('loginName')", getToken('loginName'));
      if (!getToken('loginName')) { // 登录后没有姓名则无权限
        authFlag.value = false;
      }
    });

    return {
      goToTrainingApply,
      goToTrainingSearch,
      goToTrainingSetting,
      authFlag,
      qrcodeDom
    };
  },
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon,

  }
};

</script>

<style lang="less" scoped>
  .content{
    height: calc(100% - 0.48rem);
    background: #f3f4fb;
    padding: 0.24rem 0.36rem;
  }
  .radio_box{
    display: flex;
    align-items: center;
    background: #fff;
    padding: 0.24rem 0.32rem;
    margin-bottom: 0.32rem;
    border-radius: 0.08rem;
    font-size: 0.34rem;
    .radio_title{
      flex-grow: 1;
    }
  }
  .normal{
    border: 1px solid #fff;
  }
  .icon_style{
    font-size: 0.42rem;
    color: #6DCEB7;
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
  background-size: 1500px auto;
  background-position: -1430px -285px;
}
.icon2{
  width: 70px;
  height: 70px;
  margin: 0 auto;
  background: url('../../../assets/images/icon1.png') no-repeat;
  background-size: 1500px auto;
  background-position: -1345px -285px;
}

</style>
