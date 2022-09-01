<template>
  <div class="img_box">
    <img :src="`https://file.aicar365.com/mini-program/playbill/${sId}_h5.png`" alt="">
  </div>
</template>

<script lang="ts">
import {
  ref
} from 'vue';
import { getQueryString } from '@/assets/js/common';

const url: any = {
  160: 'weixin://dl/business/?t=q5MhiFM8Ude',
  1609: 'weixin://dl/business/?t=feeNMBK80ml',
  16: 'weixin://dl/business/?t=nVDUliBvP5d',
  2675: 'weixin://dl/business/?t=tfhwmieB9vd',
  2997: 'weixin://dl/business/?t=riZK00f93Ni',
  320: 'weixin://dl/business/?t=loXj0V237nt',
  3374: 'weixin://dl/business/?t=HXVNKnumlxq',
  3401: 'weixin://dl/business/?t=r6owwx4Lcdu',
  370: 'weixin://dl/business/?t=ceh3yYQ9Qof',
  638: 'weixin://dl/business/?t=xSrNY6a8Tvq'
};

export default {
  setup() {
    const sId = ref(getQueryString('sId') || '16');
    window.location.href = url[sId.value];
    return {
      sId
    };
  }
};
</script>

<style lang="less" scoped>
.img_box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  img{
    width: 100%;
    height: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
