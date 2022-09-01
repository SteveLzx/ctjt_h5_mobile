<template>
  <div class="content">
    <van-notice-bar
      wrapable
      :scrollable="false"
      background="#F0FFF8"
    >
      <template #left-icon>
        <div class="notice_icon"></div>
      </template>
      <template #default>
        <span class="notice_text">
          智能教练发现您上次练习有如下问题
        </span>
      </template>
    </van-notice-bar>

    <van-radio-group v-for="(item, index) in resDate" :key="index" class="radio_group_style" checked-color="#3DB871" v-model="item.evaluateType">
      <van-cell-group inset>
        <van-cell class="radio_title" :title="`${index+1}. ${item.eventGenerateTime} ${item.evaluateTitle} ${item.evaluateType}`">
        </van-cell>
        <van-cell title="教练协助已解决" clickable @click="item.evaluateType = '1'">
          <template #right-icon>
            <van-radio name="1" />
          </template>
        </van-cell>
        <van-cell title="教练协助未解决" clickable @click="item.evaluateType = '2'">
          <template #right-icon>
            <van-radio name="2" />
          </template>
        </van-cell>
        <van-cell title="教练未参与" clickable @click="item.evaluateType = '3'">
          <template #right-icon>
            <van-radio name="3" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>

    <div class="operate">
      <van-button color="#3DB871" :style="{width: '40%'}" plain size="small" @click="jump">跳过</van-button>
      <van-button color="#3DB871" :style="{width: '40%'}" size="small" @click="submit">提交</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref, reactive, getCurrentInstance, onMounted
} from 'vue';
import {
  Cell,
  Image,
  Button,
  Icon,
  CellGroup,
  Tag,
  NoticeBar,
  RadioGroup,
  Radio
} from 'vant';
import {
  verifyLogin, setBanBanTitle, banbanCall, getQueryString
} from '@/assets/js/common';
import { eventEvaluateList, batchOverEvent } from './api';

export default {
  setup() {
    setBanBanTitle('服务监督');
    const { proxy } = getCurrentInstance();

    // 初始化接口返回数据
    const resDate = ref([]);

    const checked = ref('1');
    // 初始化页面
    const init = async () => {
      const res: any = await eventEvaluateList();
      resDate.value = res || [];
      resDate.value = resDate.value.map((data: any) => ({
        ...data,
        evaluateType: '1'
      }));
      console.log(resDate.value);
    };

    onMounted(() => {
      // 校验登录后查询教练场地信息
      verifyLogin().then(() => {
        init();
      });
    });

    const jump = async () => {
      resDate.value = resDate.value.map((data: any) => ({
        ...data,
        evaluateType: '1'
      }));
      await batchOverEvent(resDate.value);
      proxy.$root.$router.back();
    };
    const submit = async () => {
      await batchOverEvent(resDate.value);
      proxy.$root.$router.back();
    };
    return {
      resDate,
      checked,
      jump,
      submit
    };
  },
  components: {
    [Cell.name]: Cell,
    [Image.name]: Image,
    [Button.name]: Button,
    [Icon.name]: Icon,
    [CellGroup.name]: CellGroup,
    [Tag.name]: Tag,
    [NoticeBar.name]: NoticeBar,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio
  }
};
</script>

<style lang="less" scoped>
  .content{
    min-height: 100%;
    background: #f3f4fb;
    overflow: hidden;
    .radio_group_style{
      margin-top: 0.24rem;
      &:last-child{
        margin-bottom: 1.44rem;
      }
      .radio_title{
        color: #000;
        font-size: 32px;
      }
    }
    .operate{
      position: fixed;
      bottom: 0px;
      left: 0px;
      background: #fff;
      display: flex;
      justify-content: space-around;
      width: 100%;
      height: 1.2rem;
      align-items: center;
    }
  }
.notice_icon{
  width: 35px;
  height: 35px;
  margin: 0 auto;
  background: url('../../assets/images/icon1.png') no-repeat;
  background-size: 750px auto;
  background-position: -435px -145px;
  align-self: flex-start;
  margin: 8px 8px 8px 0px;
}
.notice_text{
  font-size: 24px;
  color: #666;
}
.notice_main_text{
  color: #F96502;
  display: inline;
}
.line_notice{
  background: #F0FFF8;
  line-height: 0.7rem;
  height: 0.7rem;
  margin: 0.15rem 0;
  border-radius: 0.04rem;
  display: flex;
  align-items: center;
}
.line_icon{
  width: 35px;
  height: 35px;
  background: url('../../assets/images/icon1.png') no-repeat;
  background-size: 750px auto;
  background-position: -490px -145px;
  margin: 0px 8px 0px 8px;
}
</style>
