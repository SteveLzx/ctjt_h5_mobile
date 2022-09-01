<template >
<div class="content" v-if="authFlag">
  <div ref="qrcodeDom" class="qrcode"></div>

  <ul class="table">
    <li class="table_title">本次预约清单</li>
    <li>
      <ul class="table_tr table_th">
        <li class="table_td" :style="{width: '20%'}">姓名</li>
        <li class="table_td" :style="{width: '40%'}">手机号</li>
        <li class="table_td" :style="{width: '20%'}">车型</li>
        <li class="table_td" :style="{width: '20%'}">签到</li>
      </ul>
    </li>
    <li v-for="(item,index) in result" :key="index">
      <ul class="table_tr" :style="{background: item.isOwn === 1 ? '#F0FFF8': 'transparent'}">
        <li class="table_td bind_content" :style="{width: '20%'}">
          {{item.trueName}}
          <div class="bind_coach">{{item.bindCoachName &&item.bindCoachName.split('')[0]}}</div>
        </li>
        <li class="table_td" :style="{width: '40%'}">{{item.mobileNo}}</li>
        <li class="table_td" :style="{width: '20%'}">{{item.driveType}}</li>
        <li class="table_td" :style="{width: '20%'}">
          <i class="iconfont icon_style icon_checked" v-if="item.isSign === 1">&#xe65d;</i>
          <i class="iconfont icon_style icon_unchecked" v-if="item.isSign !== 1">&#xe634;</i>
        </li>
      </ul>
    </li>
  </ul>
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
  Icon,
  DropdownMenu,
  DropdownItem
} from 'vant';
import QRCode from 'qrcodejs2';
import { queryTheoryAppoint, theorySignInBanner } from './api';

export default {
  setup() {
    setBanBanTitle('扫码签到');
    const { proxy } = getCurrentInstance();

    const qrcodeDom = ref({});
    const result: any = ref([]);
    const query = async () => {
      const res: any = await queryTheoryAppoint();
      result.value = res || [];
    };

    // 登录后没有姓名则无权提交
    const authFlag = ref(true);
    // 校验登录后查询教练场地信息
    verifyLogin(1).then(async () => {
      if (!getToken('loginName')) { // 登录后没有姓名则无权限
        authFlag.value = false;
      }
      query();
      const qrcode = await theorySignInBanner();
      // eslint-disable-next-line no-new
      new QRCode(qrcodeDom.value, {
        text: qrcode,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });
      setInterval(() => {
        query();
      }, 10000);
    });

    return {

      authFlag,
      qrcodeDom,
      result
    };
  },
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem
  }
};

</script>

<style lang="less" scoped>
  .content{
    min-height: calc(100% - 0.24rem);
    background: #f3f4fb;
    padding: 0rem 0rem 0.24rem;
  }
  .table{
    margin-top: 20px;
    .table_title{
      text-align: center;
      background: #26C589;
      line-height: 60px;
      height: 60px;
      border-bottom: 1px solid #E5E5E5;
      color: #fff;
    }
    .table_tr{
      display: flex;
      justify-content: space-around;
      align-items: center;
      text-align: center;
      border-bottom: 1px solid #E5E5E5;
      height: 80px;
      .table_td{

      }
    }
    .table_tr.table_th{
      background: #26C589;
      color: #fff;
      font-size: 28px;
      height: 60px;
    }
  }
  .qrcode{
    display: flex;
    justify-content: center;
    padding: 0.7rem 0rem;
  }
  .icon_style{
    font-size: 0.32rem;
  }
  .icon_checked{
    color: #6DCEB7;

  }
  .icon_unchecked{
    color: #999;
  }
  .bind_content{
    position: relative;
    .bind_coach{
      position: absolute;
      right: -0px;
      top: -25px;
      font-size: 20px;
    }
  }
</style>
