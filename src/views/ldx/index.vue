<template>
<div class="content">
  <img class="bgImage" v-if="studentInfo&&studentInfo.schoolThirdpartyId" :src="`https://file.aicar365.com/mini-program/${studentInfo.schoolThirdpartyId}/1.png`" alt="">
  <div class="top_bg">
    <div class="notice">
      <transition-group name="notice" appear>
        <div :style="{minWidth: '80%'}" v-for="(item) in num" :key="item">

          <div class="notice_box">
            <img class="notice_icon" src="../../assets/images/ldx/ldx_banner_icon_laba.svg" alt="">
            <div>{{item.nickname}} 邀请了{{item.num}}个好友，赚到奖励{{studentConfig&&item.num*studentConfig.reward || 0}}.00元</div>
          </div>
        </div>
      </transition-group>
    </div>
    <div class="time_style">
      活动时间：{{dateRange}}
    </div>
    <div class="btn_style" @click="preview">
      立即邀请赚钱
    </div>
  </div>
  <div :style="{marginTop: '8.5rem'}">
    <div class="title">邀请1位好友 <span class="main_text">赚{{studentConfig&&studentConfig.reward }}元</span></div>
    <!-- <div class="process"></div> -->
    <img class="process" v-if="studentInfo&&studentInfo.schoolThirdpartyId" :src="`https://file.aicar365.com/mini-program/${studentInfo.schoolThirdpartyId}/2.png`" alt="">

  </div>
  <div>
    <div class="title">我的邀请详情</div>
    <div class="invitation">
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
      <div class="invite_btn" @click="goToRate">
        我的奖励进度
      </div>
    </div>
  </div>
  <div class="rule">
    <div class="list_title">
      规则说明:
    </div>
    <div class="list">活动时间：{{dateRange}}，期间不限制邀请人数，多邀请多赚钱 </div>
    <div class="list">活动期间，推荐好友成功报名，每成功一人获得{{studentConfig&&studentConfig.reward }}元，奖金将在月底转入您提供的个人账户</div>
    <div class="list">活动详情，请拨打客服电话
      {{studentConfig&&studentConfig.mobileNo }}
      </div>
  </div>
  <canvas id="myCanvas" class="myCanvas"></canvas>

</div>

</template>

<script lang="ts">
import {
  ref, reactive, getCurrentInstance,
  onUnmounted
} from 'vue';
import { Toast } from 'vant';
import {
  verifyLogin, setBanBanTitle, banbanCall, getQueryString, appShare, getBanBanToken, getYMDObj
} from '@/assets/js/common';
import $http from '@/assets/js/request';
import { setToken, getToken, removeToken } from '@/assets/js/token_cookie';
import { putUploadAliyuncs, base64ToBlob } from '@/assets/js/upload_oss';
import { name } from 'vant/lib/uploader/utils';
import dataList from './dataList';

export default {
  setup() {
    setBanBanTitle('邀请有奖');
    const { proxy } = getCurrentInstance();

    const num: any = ref([]);
    const info: any = ref({});
    const current = ref(0);
    const disable = ref(false);
    const studentInfo = ref({});
    const studentConfig = ref({});
    const dateRange = ref('');
    const goToRate = () => {
      proxy.$root.$router.push({
        path: '/rate',
      });
    };

    const preview = async () => {
      if (!disable.value) {
        Toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        });
        disable.value = true;
        const token: string = getBanBanToken();
        const active: any = await $http.post(
          'sale/v1/recommend/joinActivity',
          {
            banbanToken: token,
            activitiyId: 10001,
            recommendedId: '',
            openId: '',
            mchId: '',
          }
        );
        const data = {
          url: 'pages/personal/invite/landing_page',
          params: `uId-${active.id}_sId-${active.mchId}`
        };
        const base64 = await $http.post('user/v1/wechat/queryWeChatQRCode', data);
        console.log(base64);
        const c: any = document.getElementById('myCanvas');
        c.width = 750;
        c.height = 1334;
        const ctx: any = c.getContext('2d');

        ctx.fillStyle = '#333333';

        ctx.textAlign = 'left';
        ctx.fillText('textAlign=center', 10, 30);
        const imageBG: any = new Image();
        imageBG.src = require('../../assets/images/ldx/invite.png');
        imageBG.setAttribute('width', '1500');
        imageBG.setAttribute('height', '2668');
        imageBG.onload = async () => {
          ctx.drawImage(imageBG, 0, 0, 750, 1334);

          const image: any = new Image();
          image.src = `data:image/png;base64,${base64}`;
          image.setAttribute('crossOrigin', 'anonymous');
          image.setAttribute('width', '860');
          image.setAttribute('height', '860');

          image.onload = async () => {
            ctx.drawImage(image, 265, 1037, 220, 220);
            const uploadUrl = c.toDataURL();
            const uploadImage: any = new Image();
            uploadImage.src = uploadUrl;
            console.log('uploadUrl', uploadUrl, uploadImage);
            const uploadBlob = base64ToBlob(uploadUrl);
            const body = await putUploadAliyuncs(uploadBlob, 'coach');
            console.log(body);

            const { hostname } = window.location;
            let _mode = '.dev';
            if (hostname.startsWith('coach-h5.aicar365')) _mode = '';
            if (hostname.startsWith('coach-h5.test.aicar365')) _mode = '.test';
            const _hostname = hostname.includes('aicar24') ? 'aicar24' : 'aicar365';
            console.log(1111, `https://file${_mode}.${_hostname}.com/${body}`);
            appShare({
              title: '活动',
              content: '活动内容',
              imageUrl: `http://file${_mode}.${_hostname}.com/${body}`,
              pageCode: 'ldx',
              shareUrl: ''
            });
            disable.value = false;
            Toast.clear();
          };
        };
      }
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

    const queryInfo = async () => {
      const res: any = await $http.get('sale/v1/recommend/queryStudentInfo');
      studentInfo.value = res || {};
      const config: any = await $http.post('sale/v1/reward/queryRewardConf', {
        mchId: res.schoolThirdpartyId,
        activitiyId: 10001
      });
      studentConfig.value = config || {};
      const start = getYMDObj(config.beginDate || '');
      const end = getYMDObj(config.endDate || '');
      dateRange.value = `${start.month}月${start.day}日 - ${end.month}月${end.day}日`;
    };
    const init = () => {
      const token: string = getBanBanToken();
      setToken(token);
      getInviteTallys();
      queryInfo();
      current.value = Math.floor(dataList.length * Math.random());
      console.log('current', current);
      num.value.push({
        ...dataList[current.value],
        num: Math.ceil(5 * Math.random())
      });

      setInterval(() => {
        current.value += 1;
        num.value.push({
          ...dataList[current.value],
          num: Math.ceil(5 * Math.random())
        });
        num.value.shift();
      }, 5000);
    };
    init();
    return {
      num,
      goToRate,
      preview,
      info,
      studentInfo,
      studentConfig,
      dateRange
    };
  },
  components: {
    [Toast.name]: Toast
  }
};
</script>

<style lang="less" scoped>
  .content{
    min-height: 100%;
    background: #D40620;
    background-size: contain;
    overflow-x: hidden;
    position: relative;
    .bgImage{
      width: 100%;
      position: absolute;
    }
    .top_bg{
      padding-top: 100px;
      height: 750px;
      position: absolute;
      z-index: 20;
      width: 100%;
      .notice{
        // display: flex;
        margin-top: 100px;
        position: relative;
        // width: max-content;
        .notice_box{
          background: rgba(133, 21, 50, 0.65);
          height: 40px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          padding: 0px 24px 0px 24px;
          margin: 0px 50px 0px 100px;
          color: #FFFFFF;
          font-size: 24px;
          position: absolute;
          .notice_icon{
            width: 25px;
            height: 25px;
            margin-right: 12px;
          }
        }
      }
      .time_style{
        margin: 160px;
        text-align: center;
        color: #fff;
        font-size: 24px;
      }
      .btn_style{
        color: #D40620;
        background: url("../../assets/images/ldx/ldx_banner_btn.png") no-repeat;
        background-size: 385px 85px;
        margin: 390px auto 0;
        text-align: center;
        width: 385px;
        height: 85px;
        line-height: 85px;
      }
    }
    .title{
      color: #FFFFFF;
      font-size: 34px;
      margin: 0px 24px;
      .main_text{
        color: #FBEB77;
      }
    }
    .process{
      background: url("../../assets/images/ldx/ldx_floortwo.png") no-repeat;
      background-size: 702px 324px;
      text-align: center;
      width: 702px;
      height: 324px;
      margin: 24px;
    }
    .list_title{
      color: #fff;
      font-size: 24px;
    }
    .list{
      list-style: auto;
      margin: 0 24px 0 30px;
      display: list-item;
      color: #fff;
      font-size: 24px;
    }
    .rule{
      padding: 0px 24px 70px 24px;
    }

    .invitation{
      width: 702px;
      height: 324px;
      margin: 24px;
      border-radius: 16px;
      background: #fff;
      .invite_list{
        display: flex;
        padding: 50px 0px 24px;
        align-items: center;
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
      .invite_btn{
        margin: 40px auto 40px;
        width: 320px;
        height: 70px;
        border-radius: 35px;
        background: #D40620;
        color: #fff;
        text-align: center;
        line-height: 70px;

      }
    }
  }
.notice-enter-active, .notice-leave-active {
  transition: all 5s linear;
}
.notice-enter-from {
  transform: translateX(120%);
}
.notice-leave-to {
  transform: translateX(-120%);
}
.myCanvas{
  position: fixed;
  left: 10000px;
  top: 0px;
}
</style>
