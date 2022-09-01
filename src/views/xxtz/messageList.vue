<template>
  <div >
    <div class="content">
      <div class="query_content">
        <van-cell-group class="cell_picker" inset>
          <div class="filter_style">
            <van-field
              v-model="picker.value.text"
              class="field_style"
              disabled
              clickable
              name="picker"
              placeholder="请选择"
              right-icon="arrow-down"
              @click="handlePicker"
            />

            <van-field
              v-model="dataPicker.value.text"
              class="field_style"
              disabled
              clickable
              name="picker"
              placeholder="请选择"
              right-icon="arrow-down"
              @click="handleDataPicker"
            />
          </div>

        </van-cell-group>

        <van-popup v-model:show="picker.showPicker" position="bottom">
          <van-picker
            :columns="options"
            @confirm="onConfirm"
            @cancel="picker.showPicker = false"
          />
        </van-popup>

        <van-popup v-model:show="dataPicker.showPicker" position="bottom">
          <van-picker
            :columns="dataOptions"
            @confirm="onDataConfirm"
            @cancel="dataPicker.showPicker = false"
          />
        </van-popup>

        <van-cell-group class="cell_tab" :style="{overflow: 'initial'}" inset>
          <div v-for="(tab, index) in tabList" :key="index"
            :class="['tab_style',tab.name === activeTab && 'active_tab' ]"
            @click="handleTab(tab.name)">
              <van-badge :content="tab.num" :show-zero="false" max="99">
                <i :class="['iconfont', tab.icon, 'fz44']"></i>
                <div>{{tab.title}}</div>
              </van-badge>

          </div>
        </van-cell-group>

        <van-divider :style="{ color: '#f3f4fb', borderColor: '#f3f4fb', borderTopWidth: '10px' }"></van-divider>
        <van-cell-group class="cell_tab" inset>
          <div v-for="(tab, index) in statusList" :key="index"
            :class="['tab_style',tab.name === statusTab && 'active_tab' ]"
            @click="handleStatusTab(tab.name)">
            {{tab.title}}
          </div>
          <div :class="['tab_style', vipValue&&'active_vip', 'vip_style' ]" @click="handleVipBtn">
            <i class="iconfont" :style="{'fontSize': '0.26rem'}">&#xe681;</i>
            只看VIP
          </div>
        </van-cell-group>
        <van-divider :style="{ color: '#f3f4fb', borderColor: '#f3f4fb', padding: '0 16px' }"></van-divider>
        <van-cell-group class="car_cell_tab" inset>
          <div v-for="(tab, index) in carList" :key="index"
            :class="['car_tab_style',tab.name === carTab && 'car_active_tab' ]"
            @click="handleCarTab(tab.name)">{{tab.title}}</div>
        </van-cell-group>
      </div>
      <div class="list_content">
        <van-pull-refresh v-model="list.refreshing" @refresh="onListRefresh">
          <van-list
            v-model:loading="list.loading"
            :finished="list.finished"
            finished-text="没有更多了"
            @load="onListLoad"
          >
            <div class="card_style" v-for="(item, index) in list.data" :key="index">
              <div class="cell cell_header">
                <div class="error_time">
                  <span :class="['status', item.level == 1 && 'status1', item.level == 2&&'status2', item.level == 3&&'status3']">{{['紧急', '重要', '常规'][item.level-1]}}</span>
                </div>
                <div :class="['cell_text', item.level == 1 && 'color1', item.level == 2&&'color2', item.level == 3&&'color3']">
                  <div v-if="activeTab == 1 || activeTab == 2" class="time_count">
                    剩余时间：
                    <van-count-down :class="['count_down_style', item.level == 1 && 'color1', item.level == 2&&'color2', item.level == 3&&'color3']" :time="item.remainingEffectiveTime" />

                  </div>
                </div>
                <div class="error_time">{{item.eventName}}</div>
              </div>
              <div class="cell">
                <div class="cell_text divider">
                  {{item.carCode || '-'}}
                </div>
                <div class="cell_text divider center">
                  {{item.libraryName || '-'}}
                </div>
                <div class="cell_text center">
                  {{item.studentName || '-'}}
                </div>
              </div>
              <div class="cell">
                <div class="cell_text">
                  {{transTime(item.eventGeneratedTime)}}  {{item.eventGeneratedReason}}
                </div>
              </div>
              <div class="cell">

                <div class="cell_text">
                  处理建议：{{item.disposeProposal}}
                </div>
              </div>
              <div class="cell">
                <div class="cell_text" v-if="activeTab == 1 || activeTab == 2 || item.receiveName">
                  <span v-if="item.receiveName"> 处理人：{{item.receiveName}}</span>
                </div>
                <div class="error_time" v-if="activeTab == 1 || activeTab == 2">
                  <van-button v-if="activeTab == 1" color="#26C589" size="small" :style="{width: '80px'}" @click="operateEventApi(item, 1)">接单</van-button>
                  <van-button v-if="activeTab == 2" plain color="#26C589" size="small" :style="{width: '80px'}" @click="operateEventApi(item, 2)">确认完成</van-button>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive } from 'vue';
import {
  CellGroup,
  Field,
  Popup,
  Picker,
  DatetimePicker,
  Grid,
  GridItem,
  PullRefresh,
  List,
  Divider,
  CountDown,
  Button,
  Badge,
  Dialog
} from 'vant';
import {
  verifyLogin, setBanBanTitle, getYMDObj, getQueryString
} from '@/assets/js/common';
import {
  isIos
} from '@/assets/js/util';
import { getToken } from '@/assets/js/token_cookie';
import {
  queryInfoList, updateWorkStatus, operateEvent, queryWorkStatus, queryCountEventNum
} from './api';
import { queryBookableDate } from '../znyc/coach/api';

// 排序tab列表
const carList = [{
  title: '全部',
  name: 0,
}, {
  title: 'C1',
  name: 6,
}, {
  title: 'C2',
  name: 7,
}];

// 排序tab列表
const statusList = [{
  title: '全部',
  name: 0,
}, {
  title: '紧急',
  name: 1,
}, {
  title: '重要',
  name: 2,
}, {
  title: '常规',
  name: 3,
}];

interface Option {
  text: string|number;
  value: string|number;
}
export default {
  setup() {
    setBanBanTitle('服务工单');

    // 初始化下拉选择器
    const picker = reactive({
      value: {
        text: '上线中',
        value: 1
      },
      showPicker: false,
    });

    const dataPicker = reactive({
      value: {
        text: '全部',
        value: 0
      },
      showPicker: false,
    });
    // 初始化排序tab
    const activeTab = ref(1);
    const statusTab = ref(0);
    const carTab = ref(0);
    const vipValue = ref(0);
    const options = ref([{
      text: '上线中',
      value: 1
    }, {
      text: '已下线',
      value: 0
    }]);

    const dataOptions = ref([{
      text: '全部',
      value: 0
    }, {
      text: '我的',
      value: 1
    }]);
    // 初始化查询选项
    let query = reactive({
      current: 1,
      pageSize: 5,
      driveType: 0,
      isOnlyLookVip: 0,
      level: 0,
      placeId: '',
      type: 1,
      isMe: 0
    });

    // 初始化卡片列表
    const list = reactive({
      data: [],
      loading: false,
      finished: false,
      refreshing: false,
    });

    const trainingPlaceId = ref('');
    // 打开下拉选择器弹窗
    const handlePicker = () => {
      picker.showPicker = true;
    };
    const handleDataPicker = () => {
      dataPicker.showPicker = true;
    };
    // 排序tab列表
    const tabList = reactive([{
      title: '待处理',
      icon: 'icon_e686',
      name: 1,
      num: 0
    }, {
      title: '处理中',
      icon: 'icon_e685',
      name: 2,
      num: 0
    }, {
      title: '待评价',
      icon: 'icon_e682',
      name: 3,
      num: 0
    }, {
      title: '已完成',
      icon: 'icon_e684',
      name: 4,
      num: 0

    }, {
      title: '已过期',
      icon: 'icon_e683',
      name: 0,
      num: 0
    }]);

    const queryCountEventNumApi = async () => {
      const res: any = await queryCountEventNum({
        phaseId: trainingPlaceId.value
      });
      tabList[0].num = Number(res?.pendingNum) || 0;
      tabList[1].num = Number(res?.processingNum) || 0;
      tabList[2].num = Number(res?.waitEvaluateNum) || 0;
      tabList[3].num = Number(res?.finishNum) || 0;
      tabList[4].num = Number(res?.overDueNum) || 0;
    };
    // 调用接口
    const queryInfoListApi = async (reqData: any) => {
      list.loading = true;
      console.log('reqData', reqData);
      const res: any = await queryInfoList(reqData);
      queryCountEventNumApi();
      const {
        current = 1,
        data = []
      } = res || {};
      query = {
        ...query,
        current,
      };
      list.data = list.data.concat(data);
      list.loading = false;
      list.refreshing = false;
      if (!data || (data && data.length < query.pageSize)) {
        list.finished = true;
      }
    };

    // 下拉选择器确认操作
    const onConfirm = (value: Option) => {
      picker.value = { ...value };
      picker.showPicker = false;

      const queryDate = {
        appType: isIos() ? 1 : 2,
        placeId: trainingPlaceId.value,
        status: value.value
      };

      updateWorkStatus(queryDate);
    };
    const onDataConfirm = (value: Option) => {
      dataPicker.value = { ...value };
      dataPicker.showPicker = false;

      query = {
        ...query,
        current: 1,
        isMe: value.value
      };
      list.data = [];
      list.finished = false;
      console.log('query2', query);
      queryInfoListApi(query);
    };

    // 排序tab切换
    const handleTab = (tabName: string|number) => {
      activeTab.value = tabName;
      query = {
        ...query,
        current: 1,
        type: tabName
      };
      list.data = [];
      list.finished = false;
      console.log('query2', query);
      queryInfoListApi(query);
    };

    const handleStatusTab = (tabName: string|number) => {
      statusTab.value = tabName;
      query = {
        ...query,
        current: 1,
        level: tabName
      };
      list.data = [];
      list.finished = false;
      console.log('query3', query);
      queryInfoListApi(query);
    };

    const handleCarTab = (tabName: string|number) => {
      carTab.value = tabName;
      query = {
        ...query,
        current: 1,
        driveType: tabName
      };
      list.data = [];
      list.finished = false;
      console.log('query4', query);

      queryInfoListApi(query);
    };

    const handleVipBtn = () => {
      vipValue.value = Number(!vipValue.value);
      query = {
        ...query,
        current: 1,
        isOnlyLookVip: vipValue.value
      };
      list.data = [];
      list.finished = false;
      console.log('query5', query);

      queryInfoListApi(query);
    };
    // 下拉刷新
    const onListRefresh = () => {
      query = {
        ...query,
        current: 1,
      };
      list.data = [];
      list.finished = false;
      console.log('query6', query);

      queryInfoListApi(query);
    };

    // 滑动分页请求
    const onListLoad = () => {
      if (list.data.length > 0) {
        query = {
          ...query,
          current: query.current + 1
        };
        console.log('query7', query);
        queryInfoListApi(query);
      }
    };

    const operateEventApi = async (item: any, type: number) => {
      Dialog.confirm({
        title: type === 1 ? '请再次确认是否接单？' : '请再次确认是否完成？',
        message: '',
        confirmButtonColor: '#3DB871',
        cancelButtonColor: '#999'
      })
        .then(async () => {
          const { carCode = '', eventCode = '', eventId = 0 } = item;

          const res: any = await operateEvent({
            carCode,
            eventCode,
            eventId,
            trainingPlaceId: trainingPlaceId.value,
            type
          });
          query = {
            ...query,
            current: 1
          };
          list.data = [];
          list.finished = false;
          console.log('query8', query);
          queryInfoListApi(query);
        })
        .catch(() => {
          // on cancel
        });
    };

    const queryWorkStatusApi = async () => {
      const res = await queryWorkStatus({
        placeId: trainingPlaceId.value,
        appType: isIos() ? 1 : 2,
      });
      console.log(1111, res);
      picker.value = {
        text: res ? '上线中' : '已下线',
        value: res ? 1 : 0
      };
    };

    verifyLogin(1).then(() => {
      queryBookableDate().then((res: any) => {
        trainingPlaceId.value = (res && res[0] && res[0].venueId) || '';
        query = {
          ...query,
          placeId: (res && res[0] && res[0].venueId) || ''
        };
        console.log('query1', query);
        queryInfoListApi(query);
        queryWorkStatusApi();
      });
    });

    const getSpiltList = (text = '') => text && text.split('###');

    const transTime = (time = '') => {
      const {
        year,
        month,
        day, hours, min,
      } = getYMDObj(time);
      if (activeTab.value === 1 || activeTab.value === 2) {
        return `${hours}:${min}`;
      }
      return `${year}-${month}-${day} ${hours}:${min}`;
    };
    return {
      picker,
      options,
      onConfirm,
      handlePicker,
      activeTab,
      tabList,
      handleTab,
      list,
      onListRefresh,
      onListLoad,
      getSpiltList,
      carList,
      statusList,
      handleStatusTab,
      statusTab,
      handleCarTab,
      carTab,
      handleVipBtn,
      vipValue,
      operateEventApi,
      transTime,
      dataOptions,
      dataPicker,
      onDataConfirm,
      handleDataPicker
    };
  },
  components: {
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [DatetimePicker.name]: DatetimePicker,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Divider.name]: Divider,
    [CountDown.name]: CountDown,
    [Button.name]: Button,
    [Badge.name]: Badge
  }
};

</script>

<style lang="less" scoped>
.content{
  background: #f3f4fb;
  min-height: 100vh;
  .query_content{
    padding: 0.48rem 0rem 0.4rem;
    background: #fff;
    position: fixed;
    z-index: 10;
    width: 100%;
    box-shadow: 0px 12px 24px -8px #eee;
    .cell_picker{
      margin-bottom: 0.32rem;
    }
    .filter_style{
      display: flex;
      justify-content: space-between;
    }
    .field_style{
      background: #F6F6F6;
      width: 47%;
      border-radius: 20px;
      /deep/ .van-field__control:disabled{
        color: #000;
        -webkit-text-fill-color: #000;
      }
    }
    .cell_tab{
      display: flex;
      text-align: center;
      font-size: 28px;
      justify-content: space-between;
      border-radius: initial;
      .tab_style{
        padding: 0.05rem;
      }
      .active_tab{
        color: #3DB871;
      }
    }
    .car_cell_tab{
      display: flex;
      height: 0.54rem;
      line-height: 0.54rem;
      text-align: center;
      font-size: 28px;
      border: 2px solid #999;
      .car_tab_style{
        width: 33.33%;
        &:not(:last-child){
          border-right: 2px solid #999;
        }
      }
      .car_active_tab{
        background: #3DB871;
        color: #fff;
      }
    }
    .vip_style{
      border: 1px solid #999;
      min-width: 180px;
      font-size: 0.28rem;
      border-radius: 0.08rem;
      padding: 0.05rem;
    }
    .active_vip{
      color: #3DB871;
      border: 1px solid #3DB871;
    }
  }
  .list_content{
    padding: 5.84rem 0.24rem 0.24rem;
    .card_style{
      border-radius: 0.08rem;
      background: #fff;
      font-size: 28px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 0.01rem solid #e5e5e5;
      &:not(:last-child){
        margin-bottom: 0.24rem;
      }
      .cell{
        display: flex;
        align-items: stretch;
        &:not(:last-child){
          border-bottom: 2px solid #e5e5e5;
        }
        .cell_text{
          padding: 0.26rem 0.16rem;
          flex: auto;
          word-break: break-all;
        }
        .error_time{
          padding: 0.26rem 0.16rem;
          white-space: nowrap;
        }
        .divider{
          position: relative;
          &::after{
            content: '';
            background: #e5e5e5;
            width: 2px;
            height: 80%;
            position: absolute;
            top: 10%;
            right: 0;
          }
        }
        .center{
          text-align: center;
        }
      }
      .cell_header{
        justify-content: center;
        font-size: 32px;
      }
      .status{
        background: #0f0;
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;
        width: 1.8rem;
        margin-left: -16px;
        padding: 4px 24px 4px 24px;
      }
      .status1{
        background: #FFE4E4;
        color: #E85656;
      }
      .color1{
        color: #E85656;

      }
      .status2{
        background: #FFEEE3;
        color: #FE8A01;
      }
      .color2{
        color: #FE8A01;

      }
      .status3{
        background: #DEFFF0;
        color: #26C589;
      }
      .color3{
        color: #26C589;

      }
      .time_count{
        display: flex;
        align-items: baseline;
      }
      .count_down_style{
        font-size: 32px;
      }
    }
  }
}

.icon_e686:before {
  content: "\e686";
}
.icon_e685:before {
  content: "\e685";
}
.icon_e682:before {
  content: "\e682";
}
.icon_e684:before {
  content: "\e684";
}
.icon_e683:before {
  content: "\e683";
}
.fz44{
  font-size: 44px;
}
</style>
