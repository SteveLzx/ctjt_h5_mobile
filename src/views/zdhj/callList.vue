<template>
  <van-tabs class="tab_style" v-model:active="active"  @change="onClickTab" sticky animated background="#fff" color="#26C589" title-active-color="#26C589">
    <van-tab v-for="(tab) in tabs" :title="tab.title" :key="tab.name" :name="tab.name">
       <van-pull-refresh v-model="list.refreshing" @refresh="onListRefresh">
        <div class="cardContent" v-if="data[active].length > 0">
          <div v-for="(item, index) in data[active]" :key="active + index" class="card">
            <call-card :info="item" :trainingPlaceId="trainingPlaceId"></call-card>
          </div>
        </div>
        <div v-if="data[active].length === 0" class="no_data">
          <div></div>
        <p>暂无数据~</p>
      </div>
      </van-pull-refresh>
    </van-tab>
  </van-tabs>
</template>

<script lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue';
import {
  Image, Button, List, Tab, Tabs, PullRefresh
} from 'vant';
import {
  verifyLogin, setBanBanTitle, banbanCall, getYMDObj, getQueryString
} from '@/assets/js/common';
import content from '../znyc/handbook/content';
import { queryVenueCarCodeInfo } from './api';
import callCard from './component/callCard.vue';

export default {
  setup() {
    setBanBanTitle('呼叫列表');
    const tabs = reactive([
      {
        name: 'C1',
        title: 'C1学员'
      }, {
        name: 'C2',
        title: 'C2学员'
      }
    ]);
    const active = ref('C1');
    const data = reactive({
      C1: [],
      C2: [],
    });
    const list = reactive({
      refreshing: false,
    });
    const trainingPlaceId = ref('');
    const orderFinishApi = async () => {
      const query: any = {
        driveType: active.value === 'C1' ? 6 : 7
      };
      data[active.value] = [];
      const res: any = await queryVenueCarCodeInfo(query);
      console.log(111, res);
      const { carCodeList = [], placeId = '' } = res || {};
      list.refreshing = false;
      data[active.value] = carCodeList;
      trainingPlaceId.value = placeId;
    };

    verifyLogin(1).then(async () => {
      orderFinishApi();
      setInterval(() => {
        orderFinishApi();
      }, 60000);
    });

    const onClickTab = () => {
      orderFinishApi();
    };
    const onListRefresh = () => {
      orderFinishApi();
    };
    return {
      active,
      data,
      tabs,
      onClickTab,
      onListRefresh,
      list,
      trainingPlaceId
    };
  },
  components: {
    [Image.name]: Image,
    [Button.name]: Button,
    [List.name]: List,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [PullRefresh.name]: PullRefresh,
    callCard
  }
};

</script>

<style lang="less" scoped>
  .cardContent{
    background: #f3f4fb;
    min-height: calc(100vh - 1.58rem);
    padding: 0.24rem;
    .card{
      margin-bottom: 0.24rem;
    }
  }
  .tab_style{
    /deep/ .van-tabs__wrap{
      height: 1.1rem;
      box-shadow: 0px 12px 24px -8px #eee;
    }
  }
  .no_data{
    background: transparent;
    div{
      width: 272px;
      height: 262px;
      margin: 116px auto 0;
      background: url('../../assets/images/sprite.png') no-repeat;
      background-size: 750px auto;
      background-position: -440px -164px;
    }
    p{
      text-align: center;
      color: #666;
      margin-top: 24px;
      line-height: 40px;
      font-size: 28px;
    }
  }
</style>
