<template >
<div class="content" v-if="authFlag">
  <div class="top_content">
    <div :class="['radio_box', checked ==='1'? 'isChecked': 'normal']" @click="changeChecked('1')">
      <i class="iconfont icon_style">&#xe66d;</i>
      <span class="radio_title">占用申请</span>
      <span>
        <i v-if="checked === '1'" class="iconfont icon_style">&#xe646;</i>
        <i v-else class="iconfont icon_no_checked">&#xe66c;</i>
      </span>
    </div>
    <div :class="['radio_box', checked ==='2'? 'isChecked': 'normal']"  @click="changeChecked('2')">
      <i class="iconfont icon_style">&#xe66e;</i>
      <span class="radio_title">占用查询</span>
      <span>
        <i v-if="checked === '2'" class="iconfont icon_style">&#xe646;</i>
        <i v-else class="iconfont icon_no_checked">&#xe66c;</i>
      </span>
    </div>
  </div>
  <van-button color="#3DB871" size="large" @click="goToUrl">下一步</van-button>
</div>
<div class="auth_con" v-if="!authFlag">
  <img src="../../../assets/images/a_c_auth.png" alt="">
  <p>您没有提交申请的权限，请联系片区经理～</p>
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
  Toast
} from 'vant';

export default {
  setup() {
    setBanBanTitle('车辆占用');
    const { proxy } = getCurrentInstance();
    const checked = ref('1');
    const goToAllocationCar = () => {
      proxy.$root.$router.push({
        path: '/coach/allocation_car',
      });
    };

    const goToAllocationList = () => {
      proxy.$root.$router.push({
        path: '/coach/allocation_list',
      });
    };

    const changeChecked = (value: string) => {
      checked.value = value;
    };

    const goToUrl = () => {
      if (checked.value === '1') {
        goToAllocationCar();
      } else if (checked.value === '2') {
        goToAllocationList();
      }
    };
    // 登录后没有姓名则无权提交
    const authFlag = ref(true);
    // 校验登录后查询教练场地信息
    verifyLogin(1).then(async () => {
      if (!getToken('loginName')) { // 登录后没有姓名则无权限
        authFlag.value = false;
      }
    });

    return {
      goToUrl,
      changeChecked,
      checked,
      authFlag
    };
  },
  components: {
    [Button.name]: Button,
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
    min-height: calc(100% - 1.5rem);
  }
  .radio_box{
    display: flex;
    align-items: center;
    background: #fff;
    padding: 0.32rem;
    margin-bottom: 0.32rem;
    border-radius: 0.08rem;
    font-size: 0.34rem;
    .radio_title{
      flex-grow: 1;
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
</style>
