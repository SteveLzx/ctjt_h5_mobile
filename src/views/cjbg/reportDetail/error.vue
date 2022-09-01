<template>
<div>
  <div class="content">
    <div class="box">
      <div class="message">
        <div class="title">错误最多的项目:</div>
        <div class="item_flex item_color">
          <div>{{data.learnPhaseName}} - {{data.itemName}}</div>
          <div>{{data.errorTotal || '0'}}次</div>
        </div>
        <div class="btn_content">
          <!-- <div class="btn_style">查看左倒库终极教学视频</div> -->
        </div>
        <div class="title">本次预约最常犯的错误:</div>
        <div class="item_flex">
          <div>{{data.errorContent}}</div>
          <div>{{data.errorCount || '0'}}次</div>
        </div>
        <div class="title">错误原因:</div>
        <div class="item_value">
          <div v-for="(text,index) in getSpiltList(data.mistakeReason)" :key="index">{{text}}</div>
        </div>
        <div class="title">解决措施:</div>
        <div class="item_value">
          <div v-for="(text,index) in getSpiltList(data.solutions)" :key="index">{{text}}</div>
        </div>
        <div class="btn_list">
          <!-- <div class="btn_style" :style="{width: '40%'}">查看相关点位视频</div> -->
          <div class="btn_style" :style="{minWidth: '40%'}" @click="goToMoreError">查看本次练习所有错误</div>
        </div>
        <!-- <div class="title">教练评价:</div>
        <div class="item_text">你进步很快，但是下次不要迟到了哦！</div> -->
      </div>
    </div>
  </div>
</div>

</template>

<script lang="ts">
import { ref, getCurrentInstance, } from 'vue';
import { Button } from 'vant';
import {
  verifyLogin, setBanBanTitle, getYMD, getQueryString
} from '@/assets/js/common';
import { queryMistakeAnalysis } from './api';

export default {
  setup() {
    setBanBanTitle('错误解析');
    const { proxy } = getCurrentInstance();

    const data = ref({});
    // 查询下拉选项
    const queryProjectLevelApi = async () => {
      const query: any = {
        trainingPlaceId: getQueryString('trainingPlaceId'),
        userId: getQueryString('userId'),
        appointId: getQueryString('appointId'),
      };
      const res: any = await queryMistakeAnalysis(query);
      console.log(111, res);
      data.value = res || {};
    };

    const init = () => {
      queryProjectLevelApi();
    };
    init();

    const goToMoreError = () => {
      proxy.$root.$router.push({
        path: '/moreError',
        query: {
          trainingPlaceId: getQueryString('trainingPlaceId'),
          userId: getQueryString('userId'),
          appointId: getQueryString('appointId'),
        }
      });
    };
    const getSpiltList = (text = '') => text && text.split('###');

    return {
      goToMoreError,
      getSpiltList,
      data
    };
  },
  components: {
    [Button.name]: Button
  }
};

</script>

<style lang="less" scoped>
.content{
  background: #5BC5FF url('../../../assets/images/cjbg/error_bg.png') no-repeat;
  background-size: 100% auto;
  min-height: 100%;
  background-position: bottom;
  .box{
    padding: 1rem 0.5rem;
    // min-height: 12.32rem;
    .message{
      background: rgba(255, 255, 255, 0.8);
      border-radius: 0.1rem;
      padding: 0.44rem 0.4rem 0.64rem;
      .title{
        font-size: 32px;
        color: #000;
        line-height: 0.64rem;
        height: 0.64rem;
        margin-top: 0.16rem;
      }
      .item_flex{
        display: flex;
        justify-content: space-between;
        line-height: 0.56rem;
        font-size: 32px;
      }
      .item_color{
        color: #3373F6;

      }
      .btn_content{
        margin: 0.1rem 0rem 0.3rem;
        text-align: right;

      }
      .btn_style{
        display: inline-block;
        padding: 0rem 0.2rem;
        border: 0.02rem solid #3373F6;
        color: #3373F6;
        border-radius: 0.08rem;
        height: 0.64rem;
        line-height: 0.64rem;
        font-size: 22px;
      }
      .item_value{
        font-size: 26px;
        color: #666;
        line-height: 0.42rem;
        word-break: break-all;
      }
      .btn_list{
        display: flex;
        justify-content: flex-end;
        margin: 0.2rem 0rem 0.3rem;
        text-align: center;
      }
      .item_text{
        font-size: 32px;
        color: #3373F6;
        line-height: 0.36rem;
      }
    }
  }
}
</style>
