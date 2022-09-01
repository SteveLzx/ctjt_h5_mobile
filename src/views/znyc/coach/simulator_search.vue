<template >
<div class="content">
  <van-search
    v-model="value"
    show-action
    class="search_box"
    background="#ffffff"
    shape="round"
    placeholder="请输入学员手机号或身份证号"
    @clear="value = ''"
  >
    <template #action>
      <van-button class="search_btn" round type="primary" size="small" @click="goToResult">提交</van-button>
    </template>
  </van-search>
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
  Search,
  Button,
  Toast
} from 'vant';

export default {
  setup() {
    setBanBanTitle('模拟机查询');
    const { proxy } = getCurrentInstance();
    const value = ref('');

    const goToResult = () => {
      if (value.value && (value.value.length === 11 || value.value.length === 18)) {
        proxy.$root.$router.push({
          path: '/coach/simulator_result',
          query: { No: value.value }
        });
      } else {
        Toast('请输入正确的手机号或身份证号');
      }
    };

    return {
      value,
      goToResult
    };
  },

  components: {
    [Search.name]: Search,
    [Button.name]: Button,

  }
};

</script>

<style lang="less" scoped>
  .content{
    height: 100%;
    background: #f5f3f5;
  }
  .search_btn{
    display: flex;
    font-size: 28px;
    padding: 0rem 0.3rem ;
  }
</style>
