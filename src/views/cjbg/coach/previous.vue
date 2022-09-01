<template>
  <div class="content">
    <div class="content_top">
      <div class="title">以下为学员最近一次练习报告</div>
      <div class="flex_top">
        <div class="time">练车时间: {{getAppointDate(data)}}</div>
        <div class="late">{{data.appointStatusStr}}</div>
      </div>
      <div class="table_content" v-if="data.lastTrainingUpgradList&&data.lastTrainingUpgradList.length > 0">
        <ul class="table_tr table_th">
          <li class="table_td" v-for="(column, columnIndex) in columns" :key="columnIndex" :style="{width: column.width}">{{column.title}}</li>
        </ul>
        <ul class="table_tr" v-for="(item, index) in data.lastTrainingUpgradList" :key="index">
          <li class="table_td" v-for="(column, columnIndex) in columns" :key="columnIndex" :style="{width: column.width}">
            {{column.renderFun ? column.renderFun(item) : item[column.key]}}
          </li>
        </ul>
      </div>
    </div>
    <div class="content_bottom">
      <div class="item">
        <div class="item_top">
          <div class="item_label">错误描述：</div>
          <div class="item_time_number">错误次数: {{data.errorTotal || '0'}}次</div>
        </div>
        <div class="item_text">{{data.errorContent}}</div>
      </div>
      <div class="item">
        <div class="item_top">
          <div class="item_label">错误原因：</div>
        </div>
        <div class="item_text">
          <div v-for="(text,index) in getSpiltList(data.mistakeReason)" :key="index">{{text}}</div>
        </div>
      </div>
      <div class="item">
        <div class="item_top">
          <div class="item_label">解决措施：</div>
        </div>
        <div class="item_text">
          <div v-for="(text,index) in getSpiltList(data.solutions)" :key="index">{{text}}</div>
        </div>
      </div>
      <van-button class="btn_style" color="#3DB871" @click="goToMoreError">更多错误分析</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, getCurrentInstance, reactive } from 'vue';
import {
  Button,
} from 'vant';
import {
  setBanBanTitle, getQueryString, getYMDObj
} from '@/assets/js/common';
import { queryPrevious } from './api';

export default {
  setup() {
    setBanBanTitle('上次练习');

    const count = ref(0);
    const { proxy } = getCurrentInstance();
    const columns = [{
      title: '练习项目',
      width: '30%',
      key: 'learnPhaseName'
    }, {
      title: '练习次数',
      width: '25%',
      renderFun: (item: any) => {
        const { notPassed = 0, passed = 0 } = item;
        return Number(notPassed || 0) + Number(passed || 0);
      }
    }, {
      title: '合格率',
      width: '20%',
      renderFun: (item: any) => {
        console.log(item);
        const { notPassed = 0, passed = 0 } = item;
        const total = Number(notPassed || 0) + Number(passed || 0);
        if (total <= 0) {
          return '-';
        }
        const percent = Number(passed || 0) / total;
        return `${(percent * 100).toFixed(2)}%`;
      }
    }, {
      title: '进度',
      width: '20%',
      key: 'progress'
    }];

    const data = ref({});
    // 查询下拉选项
    const queryProjectLevelApi = async () => {
      const query: any = {
        trainingPlaceId: getQueryString('trainingPlaceId'),
        userId: getQueryString('userId')
      };
      const res: any = await queryPrevious(query);
      console.log(111, res);
      data.value = res || {};
    };

    const init = () => {
      queryProjectLevelApi();
    };
    init();

    const goToMoreError = () => {
      proxy.$root.$router.push({
        path: '/coach/moreError',
        query: {
          trainingPlaceId: getQueryString('trainingPlaceId'),
          userId: getQueryString('userId')
        }
      });
    };

    const getSpiltList = (text = '') => text && text.split('###');

    // 处理预约时间字段
    const getAppointDate = (item = {}) => {
      const { loginTime, loginoutTime }: any = item;
      let str = '';
      if (loginTime) {
        const beginDate: any = getYMDObj(loginTime);
        str = `${beginDate.year}-${beginDate.month}-${beginDate.day} ${beginDate.hours}:${beginDate.min}`;
      }
      if (loginoutTime) {
        const EndDate: any = getYMDObj(loginoutTime);
        str += `-${EndDate.hours}:${EndDate.min}`;
      }
      return str;
    };

    return {
      count,
      columns,
      goToMoreError,
      data,
      getSpiltList,
      getAppointDate
    };
  },
  components: {
    [Button.name]: Button,
  }
};

</script>

<style lang="less" scoped>
.content{
  .content_top{
    padding: 0.32rem 0.24rem;
    .title{
      font-size: 22px;
      color: #999;
      margin: 0.12rem 0rem;
    }
    .time{
      font-size: 28px;
      color: #363737;

    }
    .flex_top{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 28px;
      margin-bottom: 0.16rem;
    }
    .late{
      color: #3DB871;
    }
    .table_content{
      border: 1px solid #e5e5e5;
      border-radius: 0.08rem;
      font-size: 28px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .table_tr{
        display: flex;
        flex-grow: 1;
        align-items: center;
        text-align: center;
        &:not(:last-child){
          border-bottom: 2px solid #e5e5e5;
        }
        &:not(.table_th){
          .table_td{
            flex: auto;
            height: 0.8rem;
            line-height: 0.8rem;
            &:not(:last-child){
              border-right: 1px solid #e5e5e5;
            }
            &:first-child{
              background: #EEFFF6;
            }
          }
        }
      }
      .table_tr.table_th{
        background: #D4F2E2;
        .table_td{
          flex: auto;
          border: none;
          height: 0.8rem;
          line-height: 0.8rem;
        }
      }

    }
  }
  .content_bottom{
    border-top: 0.24rem solid #eee;
    padding: 0.32rem 0.24rem;
    .item{
      padding: 0.2rem 0rem;
      font-size: 28px;
      .item_top{
        margin-bottom: 0.12rem;
        display: flex;
        justify-content: space-between;
        .item_label{
          color: #000;
        }
        .item_time_number{
          color: #3DB871;
        }
      }
      .item_text{
        color: #666;
      }
    }
    .btn_style{
      margin-top: 0.2rem;
      height: 0.6rem;
      line-height: 0.6rem;
      width: 100%;
      font-size: 28px;
    }
  }
}

</style>
