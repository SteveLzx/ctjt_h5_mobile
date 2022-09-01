<template>
  <div class="content">
    <div class="iconStyle">
      <van-icon name="checked" color="#26c589" size="21" />
    </div>
    <div class="title">预约成功</div>
    <!-- <van-button plain type="primary" color="#26C589">查看过往服务记录</van-button> -->
  </div>
  <div class="divider_line"></div>
  <div class="bottom_content">
    <div class="notice">
      <img class="notice_image" src="../../../assets/images/caller.png" alt="" srcset="">
      <div class="notice_title">温馨提示</div>
    </div>
    <div class="block">
        <div class="text_sub">1、预约成功，请尽量准时到达！</div>
        <div class="text_sub">
          2、如果您临时有急事，
          <span class="text_main">提前{{computNumber(config.cancalUnpunished/60)}}个小时取消预约，</span>
          大家会理解你的！<span class="text_main">（不惩罚）</span>请提前{{computNumber(config.cancalUnpunished/60)}}个小时取消，可以预留给其他学员规划行程，赶到训练场。
        </div>
        <div class="text_sub">
          3、取消{{computNumber(config.cancalUnpunished/60)}}个小时以内的预约，我们会在“小本本”上记录您浪费练车资源的行为，
          <span class="text_main">累计{{config.cancalCount}}次浪费练车资源，</span>
          您将受到{{computNumber(config.cancalNoReservation/(60*24))}}天不可约车的
          <span class="text_main">惩罚</span>。
        </div>
        <div class="text_sub">
          4、
          <span class="text_main">爽约</span>
          是最不可取的行为，不仅浪费练车资源，还让教练及同学们担心您的安全。出现爽约行为，您将受到{{computNumber(config.breakAppointNoReservation/(60*24))}}天内不可约车的
          <span class="text_main">惩罚</span>。
        </div>
      </div>
  </div>
  <div class="replaceUrl" @click="goToMyLooking">查看预约信息</div>

</template>

<script lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue';
import $http from '@/assets/js/request';
import {
  Image, Button, List, Icon
} from 'vant';
import {
  verifyLogin, setBanBanTitle, banbanCall, getYMDObj, getQueryString
} from '@/assets/js/common';

function queryPunishConf() {
  return new Promise(resolve => {
    $http.get('teaching/v1/queryPunishConf').then(res => resolve(res));
  });
}

export default {
  setup() {
    const { proxy } = getCurrentInstance();
    const config = ref({});

    const getConfig = () => {
      queryPunishConf().then(res => {
        config.value = res;
      });
    };
    getConfig();

    const computNumber = (num = 0) => {
      if (num.toString().length > 4) {
        return num.toFixed(2);
      }
      return num;
    };

    const goToMyLooking = () => {
      proxy.$root.$router.replace({ path: '/my_looking' });
    };

    return {
      config,
      computNumber,
      goToMyLooking
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
  .iconStyle{
    padding: 0.61rem 0 0.16rem;
  }
  .title{
    font-size: 0.42rem;
    color: #000;
    font-weight: bold;
    padding-bottom: 0.32rem;
  }
}
.divider_line{
  height: 0.24rem;
  width: 100%;
  background: #f5f3f5;
}
.bottom_content{
  .notice{
    text-align: center;
    padding-top: 0.4rem;
    .notice_image{
      width: 110px;
      height: 153px;
    }
    .notice_title{
      color: #666;
      font-size: 32px;
    }
  }
}
.block {
  padding: 0.16rem 0.24rem;
  font-size: 26px;
}
.text_sub{
  color: #666;
}
.text_main{
  color: #3DB871;
}
.text_normal{
  color: #000;
}
.replaceUrl{
  margin-top: 200px;
  text-decoration: underline;
  color: #3DB871;
  font-size: 36px;
  text-align: center;
}
</style>
