<template>
  <div class="content">
    <div class="iconStyle">
      <van-icon name="checked" color="#26c589" size="55" />
    </div>
    <div class="title">服务完成</div>
    <div class="subtitle">本月共完成主动呼叫{{count}}单</div>
    <!-- <van-button plain type="primary" color="#26C589">查看过往服务记录</van-button> -->
  </div>
</template>

<script lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue';
import {
  Image, Button, List, Icon
} from 'vant';
import {
  verifyLogin, setBanBanTitle, banbanCall, getYMDObj, getQueryString
} from '@/assets/js/common';
import { orderFinish } from './api';

export default {
  setup() {
    const count = ref(0);
    const orderFinishApi = async () => {
      const query: any = {
        callType: 0
      };
      const res: any = await orderFinish(query);
      console.log(111, res);
      count.value = res || 0;
    };

    verifyLogin(1).then(async () => {
      orderFinishApi();
    });
    return {
      count,
    };
  },
  components: {
    [Image.name]: Image,
    [Button.name]: Button,
    [List.name]: List,
    [Icon.name]: Icon
  }
};

</script>

<style lang="less" scoped>
.content{
  text-align: center;
  background: #f3f4fb;
  .iconStyle{
    padding: 0.48rem 0 0.24rem;
  }
  .title{
    font-size: 0.34rem;
    color: #000;
    font-weight: bold;
    padding-bottom: 0.64rem;
  }
  .subtitle{
    color: #666666;
    font-size: 0.34rem;
    margin-bottom: 6.4rem;

  }
}
</style>
