<template>
  <div>

  </div>
</template>

<script lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue';
import {
  verifyLogin, setBanBanTitle, banbanCall, getQueryString
} from '@/assets/js/common';
import { eventEvaluateList, batchOverEvent } from './api';

export default {
  setup() {
    const { proxy } = getCurrentInstance();

    // 初始化页面
    const init = async () => {
      const res: any = await eventEvaluateList();

      if (res && res.length > 0) {
        proxy.$root.$router.push({
          path: '/serviceSupervision',
        });
      }
    };

    // 校验登录后查询教练场地信息
    verifyLogin().then(async () => {
      init();
    });

    return {

    };
  },
  components: {
  }
};
</script>

<style lang="less" scoped>

</style>
