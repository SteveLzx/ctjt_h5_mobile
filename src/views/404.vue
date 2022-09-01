<template>
  <div class="page_404">
    <img src="../assets/images/queshengye_nofound.png" alt="">
    <p>页面失联了，程序猿正在紧急搜寻中～</p>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';

export default {
  setup() {
    const count = ref(0);
    return { count };
  }
};

</script>

<style lang="less" scoped>
.page_404{
  height: 100%;
  width: 100%;
  background: #f4f4f4;
  text-align: center;
  img{
    width: 548px;
    height: auto;
    padding-top: 260px;
  }
  p{
    line-height: 40px;
    color: #666;
    font-size: 28px;
    margin-top: 24px;
  }
}
</style>
