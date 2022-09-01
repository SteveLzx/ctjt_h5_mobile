// 勿删 营销小程序端使用
<template>
  <div style="height: 100%;width: 100%">
    <iframe style="height: 100%;width: 100%" :src="link" frameborder="0"></iframe>
    <div class="fixed_box">
      <div class="top">
        <img :src="headportrait" alt="" class="headportrait">
        <span class="name">{{defaultName}}</span>
        <div class="code_img">
          <img :src="codeUrl" alt="" v-if="codeUrl"/>
        </div>
      </div>
      <div class="bottom">
        一对一学车咨询: <span class="mobile">{{defaultMobile}}</span><span class="code_des">长按识别  报名优惠</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue';
import $http from '@/assets/js/request';

const schoolName: any = {
  3374: '惠州深港驾校', // 惠州深港
  160: '东莞广仁驾校', // 东莞广仁
  3401: '成都悦成驾校', // 成都悦成
  16: '深圳深港驾校', // 深港驾校
  370: '广仁学车', // 广仁陪驾
  1609: '兰州深港驾校', // 兰州深港
  638: '港安驾校', // 港安驾校
  2997: '重庆凯旋驾校', // 重庆凯旋
  2675: '肇庆深港驾校', // 肇庆深港
  320: '福华驾校' // 福华驾校
};
const schoolTelephone: any = {
  3374: '0752-8860066', // 惠州深港
  160: '0769-33333333', // 东莞广仁
  3401: '13708002061', // 成都悦成
  16: '0755-33333333', // 深港驾校
  370: '0755-33228895', // 广仁陪驾
  1609: '0931-8522222', // 兰州深港
  638: '0755-33331111 ', // 港安驾校
  2997: '023-36991111', // 重庆凯旋
  2675: '0758-6929999', // 肇庆深港
  320: '020-88888888' // 福华驾校
};
const queryWeChatQRCode = ({ url = 'pages/public/dynamic/publish/share_landingpage', params = '', schoolId = 16 }) => new Promise(resolve => {
  const sendData = {
    url, // 需要生成二维码的url，默认落地页
    params, // 需要 携带的参数，参数最长32位字符
    schoolId
  };
  $http.post('user/v1/wechat/queryWeChatQRCode', sendData).then(base64 => resolve(base64));
});

export default {
  setup() {
    const { proxy } = getCurrentInstance();
    const {
      id,
      mobile,
      sId,
      name,
      scene
    } = proxy.$root.$route.query;
    const link = ref(`https://exc.aicar365.com?ctjt-exc-id=${id}`);
    const headportrait = ref(`https://file.aicar365.com/mini-program/${sId || 16}/common/headportrait_normal.png`);
    const defaultName = ref(name || schoolName[sId || 16]);
    const defaultMobile = ref(mobile || schoolTelephone[sId || 16]);
    const codeUrl = ref('');
    const getCode = async () => {
      let url = 'pages/public/home_new/index';
      if (scene) { // 有分享人场景ID
        url = 'pages/public/dynamic/publish/share_landingpage';
      }
      const code = await queryWeChatQRCode({ url, params: scene || '1', schoolId: Number(sId) });
      codeUrl.value = `data:image/png;base64,${code}`;
    };
    getCode();
    return {
      link,
      headportrait,
      defaultName,
      defaultMobile,
      codeUrl
    };
  }
};
</script>
<style scoped lang="less">
.fixed_box{
  position: fixed;
  bottom: 0;
  left: 0;
  right:0;
  padding: 16px 0 16px 20px;
  background-color: rgba(0, 0, 0, 0.3);
  .top{
    height: 150px;
    display: flex;
    align-items: center;
    font-size: 32px;
    color: #fff;
    .headportrait{
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin-right: 20px;
    }
    .name{
      flex: 1;
    }
    .code_img{
      width: 150px;
      padding: 0 30px 0 37px;
      position: relative;
      img{
        width: 150px;
        height: 150px;
        background: #fff;
      }
      &::before{
        content: '';
        position: absolute;
        width: 1px;
        background: #fff;
        height: 159px;
        left: 0;
        top: 8px;
      }
    }
  }
  .bottom{
    color: #fff;
    display: flex;
    font-size: 28px;
    align-items: center;
    .mobile{
      font-size: 36px;
      flex: 1;
    }
    .code_des{
      width: 217px;
      text-align: center;
      font-size: 22px;
    }
  }
}
</style>
