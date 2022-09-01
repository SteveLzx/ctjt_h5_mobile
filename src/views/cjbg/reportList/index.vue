<template>
  <div class="content">
    <div class="top_list">
      <div class="top_list_item">
        <div class="top_list_image1"></div>
        <div>预约: {{count.totalCount || 0}}</div>
      </div>
      <div class="top_list_item">
        <div class="top_list_image2"></div>
        <div>迟到: {{count.lateCount || 0}}</div>
      </div>
      <div class="top_list_item">
        <div class="top_list_image3"></div>
        <div>爽约: {{count.bailCount || 0}}</div>
      </div>
    </div>
    <div class="list_content">
      <van-list
        v-model:loading="list.loading"
        :finished="list.finished"
        finished-text="没有更多了"
        @load="onListLoad"
      >
        <div v-for="(item, index) in list.data" :key="index">
          <div v-if="index===0" class="first_item">
            <van-image :src="bgImage"></van-image>
            <div class='first_top_content'>
              <div class="first_top_title">练习报告</div>
              <div class="first_top_time">{{getAppointDate(item)}}</div>
            </div>
            <i class="iconfont success" v-if="item.progress==1">&#xe668;</i>
            <div class="first_bottom_content">
              <div class="first_bottom_left">
                <div class="first_bottom_left_list">
                  <div class="first_bottom_left_item">
                    <i class="iconfont font_style">&#xe649;</i>
                    {{item.learnPhaseName}}
                  </div>
                  <div class="first_bottom_left_item">
                    <i class="iconfont font_style">&#xe645;</i>
                    {{item.placeName}}
                  </div>
                </div>
                <div>常看练习报告的人拿证速度快50%哦！</div>
              </div>
              <van-button class="first_bottom_right" plain type="primary" color="#3373F6" size="small" @click="goToReport(item)">立即查看</van-button>
            </div>
          </div>
          <div v-if="index!==0" class="card">
            <div class='card_top_content'>
              <div class="card_top_title">练习报告</div>
              <div class="card_top_time">{{getAppointDate(item)}}</div>
            </div>
            <div class="card_bottom_content">
              <div class="card_bottom_left_list">
                <div class="card_bottom_left_item">
                  <i class="iconfont font_style">&#xe649;</i>
                  {{item.learnPhaseName}}
                </div>
                <div class="card_bottom_left_item">
                  <i class="iconfont font_style">&#xe645;</i>
                  {{item.placeName}}
                </div>
              </div>
              <div class="card_bottom_right">
                <van-button class="card_bottom_right_btn" plain type="primary" color="#3373F6" size="small" @click="goToReport(item)">立即查看</van-button>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <jump-service v-if="showJump" />
  </div>
</template>

<script lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue';
import { Image, Button, List } from 'vant';
import {
  verifyLogin, setBanBanTitle, banbanCall, getYMDObj, getQueryString
} from '@/assets/js/common';
import { queryLearnReport, queryLearnReportCount } from './api';
import jumpService from '../../xxtz/jumpService.vue';

export default {
  setup() {
    setBanBanTitle('练习报告');
    const bgImage = require('../../../assets/images/cjbg/card.png');
    const { proxy } = getCurrentInstance();
    const showJump = ref(false);
    const list = reactive({
      data: [],
      loading: false,
      finished: false,
    });
    let query = reactive({
      current: 1,
      pageSize: 10,
    });

    const count = ref({});
    const queryLearnReportApi = async (reqData: any) => {
      list.loading = true;
      const res: any = await queryLearnReport(reqData);
      const {
        current = 1,
        data = []
      } = res || {};
      query = {
        ...query,
        current,
      };
      list.data = data && list.data.concat(data);
      list.loading = false;
      if (!data || (data && data.length < query.pageSize)) {
        console.log('finished');
        list.finished = true;
      }
    };
    const queryLearnReportCountApi = async (reqData: any) => {
      const res: any = await queryLearnReportCount({});
      count.value = res || {};
      console.log(111, count);
    };

    verifyLogin().then(async () => {
      query = {
        ...query,
        current: 1
      };
      const res: any = await queryLearnReportApi(query);
      queryLearnReportCountApi({});
      showJump.value = true;
    });

    const getAppointDate = (item = {}) => {
      const { appointDate, appointBeginDate, appointEndDate }: any = item;
      let str = '';
      if (appointDate) {
        str = `${appointDate}`;
      }
      if (appointBeginDate) {
        const beginDate: any = getYMDObj(appointBeginDate);
        str += ` ${beginDate.hours}:${beginDate.min}`;
      }
      if (appointEndDate) {
        const EndDate: any = getYMDObj(appointEndDate);
        str += `-${EndDate.hours}:${EndDate.min}`;
      }
      return str;
    };

    const goToReport = (item: any) => {
      const { trainingPlaceId = '', userId = '', appointId = '' } = item;
      proxy.$root.$router.push({
        path: '/reportDetail/gross',
        query: {
          trainingPlaceId,
          userId,
          appointId
        }
      });
    };
    const onListLoad = () => {
      if (list.data.length > 0) {
        query = {
          ...query,
          current: query.current + 1
        };
        queryLearnReportApi(query);
      }
    };
    return {
      count,
      bgImage,
      list,
      getAppointDate,
      goToReport,
      onListLoad,
      showJump
    };
  },
  components: {
    [Image.name]: Image,
    [Button.name]: Button,
    [List.name]: List,
    jumpService
  }
};

</script>

<style lang="less" scoped>
.content{
  background: #f5f3f5 url('../../../assets/images/cjbg/report_list_bg.png') no-repeat;
  background-size: 100% auto;
  min-height: 100%;
  .top_list{
    display: flex;
    justify-content: space-between;
    padding: 1.1rem 1rem 0.6rem;
    color: #fff;
    font-size: 28px;
    .top_list_item{
      display: flex;
      flex-direction: column;
      align-items: center;
      .top_list_image1{
        width: 80px;
        height: 80px;
        background: url('../../../assets/images/icon.png') no-repeat;
        background-size: 750px auto;
        background-position: -35px -29px;
        margin-bottom: 0.1rem;
      }
      .top_list_image2{
        width: 80px;
        height: 80px;
        background: url('../../../assets/images/icon.png') no-repeat;
        background-size: 750px auto;
        background-position: -147px -29px;
        margin-bottom: 0.1rem;
      }
      .top_list_image3{
        width: 80px;
        height: 80px;
        background: url('../../../assets/images/icon.png') no-repeat;
        background-size: 750px auto;
        background-position: -259px -29px;
        margin-bottom: 0.1rem;
      }
    }
  }
  .list_content{
    padding: 0rem 0.25rem 0.5rem;
  }
  .first_item{
    position: relative;
    margin-bottom: 0.1rem;
    .success{
      position: absolute;
      right: 0.7rem;
      top: 0.3rem;
      color: #c01e1e;
      font-size: 120px;
    }
    .first_top_content{
      position: absolute;
      top: 0.6rem;
      left: 1rem;
      .first_top_title{
        font-size: 36px;
        color: #000;
        margin-bottom: 0.05rem;
      }
      .first_top_time{
        font-size: 32px;
        color: #000;
      }
    }
    .first_bottom_content{
      display: flex;
      align-items: center;
      justify-content: space-around;
      position: absolute;
      bottom: 0rem;
      left: 0rem;
      padding-bottom: 0.7rem;
      width: 100%;
      .first_bottom_left{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        font-size: 26px;
        color: #fff;
        margin-left: 0.4rem;
        .first_bottom_left_list{
          display: flex;
          margin-bottom: 0.2rem;
          .first_bottom_left_item{
            min-width: 2.2rem;
            display: flex;
            align-items: center;
          }
        }
      }
      .first_bottom_right{
        border-radius: 0.08rem;
        margin-right: 0.4rem;
        min-width: 1.5rem;
      }
    }
  }
  .card{
    background: #fff;
    border-radius: 0.16rem;
    padding: 0.4rem;
    margin: 0rem 0.04rem  0.2rem;
    .card_top_content{
      .card_top_title{
        font-size: 36px;
        color: #000;
        margin-bottom: 0.05rem;
      }
      .card_top_time{
        font-size: 32px;
        color: #000;
      }
    }
    .card_bottom_content{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.05rem;
      .card_bottom_left_list{
        display: flex;
        font-size: 26px;
        color: #666666;
        .card_bottom_left_item{
          min-width: 2.2rem;
          display: flex;
          align-items: center;
        }
      }
      .card_bottom_right{
        min-width: 1.5rem;
        text-align: right;
        .card_bottom_right_btn{
          border-radius: 0.08rem;
          min-width: 1.5rem;
        }
      }
    }
  }
  .font_style{
    font-size: 28px;
    color: #c4daed;
    margin-right: 0.05rem;
  }
}
</style>
