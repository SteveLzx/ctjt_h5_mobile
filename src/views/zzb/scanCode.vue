<template>
    <div class="wrapper">
      <div class="content">
          <!-- <img src="@/assert/coachLogin/icon_znjl.png" alt="" class="logo"> -->
          <h1 class="title">智能教练{{text}}确认</h1>
          <div class="btn-login" @click="onLogin">{{text}}</div>
          <div class="btn-cancel" @click="onBack">取消{{text}}</div>
      </div>
      <ctl-dialog class="message-dialog" v-model="messageDialog" :loading="loading"></ctl-dialog>
    </div>
</template>

<script>
import { Toast } from 'vant';
import ctlDialog from '@/components/dialog/index.vue';
import { getBanBanToken, verifyLogin, } from '@/assets/js/common';
import $http from '@/assets/js/request';
import jsBridge from '../../assets/js/jsBridge';

export default {
  name: 'coachLogin',
  components: {
    ctlDialog
  },
  data() {
    return {
      loading: false,
      messageDialog: {},
      scanInfo: {},
      text: '登录'
    };
  },
  methods: {
    // 返回
    onBack() {
      jsBridge.callBackHandler('returnLastPage');
    },
    // 返回扫码
    pushScanKitPage() {
      jsBridge.callBackHandler('pushScanKitPage');
    },
    // 登陆
    onLogin() {
      Toast.loading({ duration: 0, message: `正在${this.text}`, forbidClick: true });

      $http.post('teaching/v1/scan/scanQrCode', {
        param: JSON.stringify(this.scanInfo)
      }).then(res => {
        // 登陆成功通知客户端
        // jsBridge.callBackHandler('coachLoginSuccess');
        Toast.success({
          message: `${this.text}成功`,
          duration: 5000,
          onClose: () => {
            this.onBack();
            Toast.clear();
          }
        });
      }).catch((res) => {
        Toast.clear();
        this.messageDialog = {
          visible: true,
          close: true,
          rightBtnName: '重新扫码',
          leftBtnName: `取消${this.text}`,
          title: `${this.text}失败`,
          content: res.message,
          leftBtnMethod: () => {
            this.messageDialog.visible = false;
            // 返回上一页
            jsBridge.callBackHandler('returnLastPage');
          },
          rightBtnMethod: () => {
            this.pushScanKitPage();
          },
        };
      });
    },
  },
  created() {
    verifyLogin().then(() => {
      this.scanInfo = JSON.parse(jsBridge.callBackHandler('passBarcodeData'));
      if (this.scanInfo.type === 'smart.coach') {
        this.text = '签到';
      } else {
        this.text = '登录';
      }
    });
  },
};
</script>

<style scoped lang="less">

    .content{
        line-height: 1;
        text-align: center;
        padding-top: 87px;
        font-size: 0;
    }
    .content .logo{
        width: 120px;
    }
    .content .title{
        font-size: 32px;
        font-weight: 700;
        color: #333333;
        margin-top: 100px;
    }
    .content .card-info{
        margin-top: 15px;
    }

    .content .label{
        vertical-align: middle;
        display: inline-block;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
    }

    .content .value{
        vertical-align: middle;
        display: inline-block;
        width: 90px;
        height: 18px;
        line-height: 18px;
        font-size: 14px;
        font-weight: 400;
        color: #000000;
        // background: url("~@/assert/coachLogin/icon_cp.png") no-repeat;
        background-size: 100%;
    }

    .content .btn-login{
        margin: 350px auto 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 300px;
        height: 60px;
        background: #53CB85;
        border-radius: 30px;
        font-size: 28px;
        font-weight: 400;
        color: #FFFFFF;
    }

    .btn-cancel{
        line-height: 1;
        margin-top: 100px;
        font-size: 28px;
        font-weight: 400;
        color: #5D6C93;
    }

</style>
