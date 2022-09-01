<template>
<div class="content">
  <canvas id="myCanvas" class="myCanvas"></canvas>
</div>

</template>

<script lang="ts">
import {
  ref, reactive, getCurrentInstance,
  onUnmounted, onMounted
} from 'vue';

import {
  verifyLogin, setBanBanTitle, banbanCall, getQueryString
} from '@/assets/js/common';
import $http from '@/assets/js/request';
import { putUploadAliyuncs, base64ToBlob } from '@/assets/js/upload_oss';

import { setToken, getToken, removeToken } from '@/assets/js/token_cookie';

export default {
  setup() {
    setBanBanTitle('预览');
    const { proxy } = getCurrentInstance();

    onMounted(async () => {
      const data = {
        url: 'pages/public/home/index',
        params: 'userId-123'
      };
      const base64 = await $http.post('user/v1/wechat/queryWeChatQRCode', data);
      console.log(base64);
      const c: any = document.getElementById('myCanvas');
      c.width = 400;
      c.height = 500;
      const ctx: any = c.getContext('2d');

      ctx.textAlign = 'left';
      ctx.fillText('textAlign=center', 10, 30);

      const image: any = new Image();
      image.src = `data:image/png;base64,${base64}`;
      image.setAttribute('crossOrigin', 'anonymous');
      image.setAttribute('width', '200');
      image.setAttribute('height', '200');

      console.log('1111', image, `data:image/png;base64,${base64}`);
      image.onload = async () => {
        ctx.drawImage(image, 100, 50, 200, 200);

        const uploadUrl = c.toDataURL();
        const uploadImage: any = new Image();
        uploadImage.src = uploadUrl;
        console.log('uploadUrl', uploadUrl, uploadImage);
        const uploadBlob = base64ToBlob(uploadUrl);
        const body = await putUploadAliyuncs(uploadBlob, '');
        console.log(body);
      };

      // https://file.dev.aicar365.com/b9b9856d-d5ad-4807-aa51-164607807130.png
    });
    return {

    };
  },
  components: {

  }
};
</script>

<style lang="less" scoped>
  .content{
    min-height: 100%;
    background: #f3f4fb;
    width: -webkit-fill-available;
    .myCanvas{
      margin: 0 auto;
    }
  }

</style>
