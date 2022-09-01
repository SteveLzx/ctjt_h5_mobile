<template >
  <div class="content">
    <div class="query">
      <div class="query_item">
        <div class="query_title">请选择训练场</div>
        <div class="cell_picker">
          <van-field
            v-model="trainingPlaceId.value.text"
            class="field_style"
            disabled
            clickable
            name="picker"
            placeholder="请选择训练场"
          />
        </div>
      </div>
      <div class="query_item">
        <div class="query_title">选择查询范围</div>
        <div class="cell_picker">
          <van-field
            v-model="time.value.text"
            class="field_style"
            disabled
            clickable
            name="picker"
            placeholder="请选择"
            right-icon="arrow-down"
            @click="handleTimePicker"
          />
          <van-popup v-model:show="time.showPicker" position="bottom">
            <van-picker
              :columns="timeOptions"
              @confirm="onTimeConfirm"
              @cancel="time.showPicker = false"
            />
          </van-popup>
        </div>
        <div class="flex_cell">
          <div class="cell_picker cell_divider">
            <van-field
              v-model="car.value.text"
              class="field_style"
              disabled
              clickable
              name="picker"
              placeholder="请选择"
              right-icon="arrow-down"
              @click="handleCarPicker"
            />
            <van-popup v-model:show="car.showPicker" position="bottom">
              <van-picker
                :columns="carOptions"
                @confirm="onCarConfirm"
                @cancel="car.showPicker = false"
              />
            </van-popup>
          </div>
          <div class="cell_picker">
            <van-field
              v-model="effect.value.text"
              class="field_style"
              disabled
              clickable
              name="picker"
              placeholder="请选择"
              right-icon="arrow-down"
              @click="handleEffectPicker"
            />
            <van-popup v-model:show="effect.showPicker" position="bottom">
              <van-picker
                :columns="effectOptions"
                @confirm="onEffectConfirm"
                @cancel="effect.showPicker = false"
              />
            </van-popup>
          </div>
        </div>
      </div>
      <div class="query_item">
        <div class="query_title">选择排序方式</div>
        <div class="flex_cell">
          <div class="cell_picker cell_divider">
            <van-field
              v-model="sort.value.text"
              class="field_style"
              disabled
              clickable
              name="picker"
              placeholder="请选择"
              right-icon="arrow-down"
              @click="handleSortPicker"
            />
            <van-popup v-model:show="sort.showPicker" position="bottom">
              <van-picker
                :columns="sortOptions"
                @confirm="onSortConfirm"
                @cancel="sort.showPicker = false"
              />
            </van-popup>
          </div>
          <div class="cell_picker" :style="{'width': '2rem'}">
            <van-field
              v-model="order.text"
              class="field_style"
              disabled
              clickable
              name="picker"
              placeholder="请选择"
              input-align="right"
              @click="handleOrderPicker"
            >
              <template #right-icon>
                <i class="iconfont" v-if="order.value === 0">&#xe669;</i>
                <i class="iconfont" v-if="order.value === 1">&#xe66a;</i>
              </template>
            </van-field>

          </div>
        </div>
      </div>
    </div>

    <div class="list_content">
      <van-pull-refresh v-model="list.refreshing" @refresh="onListRefresh">
        <van-list
          v-model:loading="list.loading"
          :finished="list.finished"
          finished-text="没有更多了"
          @load="onListLoad"
        >
          <van-swipe-cell v-for="(item, index) in list.data" :key="index">
            <div class="card_style">
              <div class="flex_item cell_header">
                <div>提交人: {{item.name}}</div>
                <div>提交时间: {{getYMD(1, item.commitTime)}}</div>
              </div>
              <div class="flex_row">
                <div class="flex_column">
                  <div class="main_text">{{ruleType[item.ruleType]}}</div>
                  <div class="sub_text fz24">占用类型</div>
                </div>
                <div class="diviver"></div>
                <div class="flex_column">
                  <div class="main_text">{{item.c1Sum}}</div>
                  <div class="sub_text fz24">C1数量 </div>
                </div>
                <div class="diviver"></div>
                <div class="flex_column">
                  <div class="main_text">{{item.c2Sum}}</div>
                  <div class="sub_text fz24">C2数量 </div>
                </div>
              </div>
              <div class="flex_item top_line">
                <div class="sub_text halfWidth">开始日期: <span class="default_text">{{item.beginTime}}</span></div>
                <div class="sub_text halfWidth">开始时段: <span class="default_text">{{item.beginTimeRange}}</span></div>
              </div>
              <div class="flex_item top_line">
                <div class="sub_text halfWidth">结束日期: <span class="default_text">{{item.endTime}}</span></div>
                <div class="sub_text halfWidth">结束时段: <span class="default_text">{{item.endTimeRange}}</span></div>
              </div>
            </div>
            <template #right v-if="item.occupyType !== 1">
              <div class="right_content">
                <div class="flex_right" @click="editRule(item)">
                  <i class="iconfont edit_icon">&#xe66b;</i>
                  <span class="fz24 mt12">修改</span>
                </div>
                <div class="flex_right" @click="deleteRule(item)">
                  <i class="iconfont delete_icon" >&#xe66f;</i>
                  <span class="fz24 mt12">删除</span>
                </div>
              </div>
            </template>
          </van-swipe-cell>
        </van-list>
      </van-pull-refresh>

    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import {
  verifyLogin, setBanBanTitle, getYMD, getQueryString
} from '@/assets/js/common';
import { getToken } from '@/assets/js/token_cookie';
import {
  CellGroup,
  Cell,
  Field,
  Popup,
  Picker,
  PullRefresh,
  List,
  SwipeCell,
  Button
} from 'vant';
import { queryCarAppointList, queryBookableDate, deleteCarAppoint } from './api';

interface Option {
  text: string|number;
  value: string|number;
}

const timeOptions = [
  {
    text: '不区分时段',
    value: 0
  },
  {
    text: '部分时段',
    value: 1
  },
  {
    text: '全时段',
    value: 2
  }
];

const carOptions = [
  {
    text: '全部',
    value: -1
  },
  {
    text: 'C1+C2',
    value: 0
  },
  {
    text: '只查C1',
    value: 6
  },
  {
    text: '只查C2',
    value: 7
  }
];

const effectOptions = [
  {
    text: '生效中',
    value: 2
  },
  {
    text: '失效',
    value: 0
  },
  {
    text: '待生效',
    value: 1
  }
];

const sortOptions = [
  {
    text: '提交时间',
    value: 1
  },
  {
    text: '生效时间',
    value: 2
  },
  {
    text: '申请人分组',
    value: 3
  }
];

const orderOptions = [
  {
    text: '正序',
    value: 0
  },
  {
    text: '倒序',
    value: 1
  },
];

const ruleType = {
  1: '部分时段',
  2: '全时段'
};
export default {
  setup() {
    setBanBanTitle('车辆占用查询');

    const { proxy } = getCurrentInstance();
    // 初始化下拉选择器
    const trainingPlaceId = reactive({
      value: {
        text: '',
        value: -1
      },
      showPicker: false,
    });

    const time = reactive({
      value: {
        text: '不区分时段',
        value: 0
      },
      showPicker: false,
    });

    const car = reactive({
      value: {
        text: '全部',
        value: -1
      },
      showPicker: false,
    });

    const effect = reactive({
      value: {
        text: '生效中',
        value: 2
      },
      showPicker: false,
    });

    const sort = reactive({
      value: {
        text: '提交时间',
        value: 1
      },
      showPicker: false,
    });

    const order = reactive({
      value: 1,
      text: '倒序',
    });
    // 初始化卡片列表
    const list = reactive({
      data: [],
      loading: false,
      finished: false,
      refreshing: false,
    });

    let query = reactive({
      current: 1,
      driveType: -1,
      pageSize: 10,
      ruleType: 0,
      sortCondition: 1,
      sortType: 1,
      status: 2,
      trainingPlaceId: ''
    });

    const queryApi = async (reqData: any) => {
      list.loading = true;
      const res: any = await queryCarAppointList(reqData);
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

    // 打开下拉选择器弹窗
    const handleTimePicker = () => {
      time.showPicker = true;
    };

    // 下拉选择器确认操作
    const onTimeConfirm = (value: Option) => {
      time.value = { ...value };
      time.showPicker = false;
      query = {
        ...query,
        current: 1,
        ruleType: value.value
      };
      list.data = [];
      list.finished = false;
      queryApi(query);
    };

    // 打开下拉选择器弹窗
    const handleCarPicker = () => {
      car.showPicker = true;
    };

    // 下拉选择器确认操作
    const onCarConfirm = (value: Option) => {
      car.value = { ...value };
      car.showPicker = false;
      query = {
        ...query,
        current: 1,
        driveType: value.value
      };
      list.data = [];
      list.finished = false;
      queryApi(query);
    };

    // 打开下拉选择器弹窗
    const handleEffectPicker = () => {
      effect.showPicker = true;
    };

    // 下拉选择器确认操作
    const onEffectConfirm = (value: Option) => {
      effect.value = { ...value };
      effect.showPicker = false;
      query = {
        ...query,
        current: 1,
        status: value.value
      };
      list.data = [];
      list.finished = false;
      queryApi(query);
    };

    // 打开下拉选择器弹窗
    const handleSortPicker = () => {
      sort.showPicker = true;
    };

    // 下拉选择器确认操作
    const onSortConfirm = (value: Option) => {
      sort.value = { ...value };
      sort.showPicker = false;
      query = {
        ...query,
        current: 1,
        sortCondition: value.value
      };
      list.data = [];
      list.finished = false;
      queryApi(query);
    };

    // 打开下拉选择器弹窗
    const handleOrderPicker = () => {
      if (order.value === 0) {
        order.value = 1;
        order.text = '倒序';
      } else {
        order.value = 0;
        order.text = '正序';
      }

      query = {
        ...query,
        current: 1,
        sortType: order.value
      };
      list.data = [];
      list.finished = false;
      queryApi(query);
    };

    // 下拉刷新
    const onListRefresh = () => {
      query = {
        ...query,
        current: 1,
      };
      list.data = [];
      list.finished = false;
      queryApi(query);
    };

    const onListLoad = () => {
      if (list.data.length > 0) {
        query = {
          ...query,
          current: query.current + 1
        };
        queryApi(query);
      }
    };

    const deleteRule = async (value: any) => {
      console.log('delete');
      await deleteCarAppoint(value);
      query = {
        ...query,
        current: 1,
      };
      list.data = [];
      list.finished = false;
      queryApi(query);
    };

    const editRule = (value: any) => {
      if (value.occupyType !== 1) {
        proxy.$root.$router.push({
          path: '/coach/allocation_car',
          query: {
            batchId: value.batchId,
          }
        });
      }
    };

    const init = async () => {
      const res: any = await queryBookableDate();
      const currentVenue = (res && res[0]) || {};
      trainingPlaceId.value.value = currentVenue.venueId || ''; // 保存场地ID到sendData
      trainingPlaceId.value.text = currentVenue.venueName || ''; // 保存场地ID到sendData
      query = {
        ...query,
        trainingPlaceId: trainingPlaceId.value.value
      };
      console.log('11111', query, trainingPlaceId);
      queryApi(query);
    };

    init();
    return {
      timeOptions,
      carOptions,
      effectOptions,
      sortOptions,
      orderOptions,
      trainingPlaceId,
      time,
      onTimeConfirm,
      handleTimePicker,
      car,
      onCarConfirm,
      handleCarPicker,
      effect,
      onEffectConfirm,
      handleEffectPicker,
      sort,
      onSortConfirm,
      handleSortPicker,
      order,
      handleOrderPicker,
      onListRefresh,
      list,
      onListLoad,
      deleteRule,
      getYMD,
      ruleType,
      editRule
    };
  },
  components: {
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [SwipeCell.name]: SwipeCell,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Button.name]: Button,
  }
};

</script>

<style lang="less" scoped>
  .content{
    min-height: calc(100% - 0.48rem);
    background: #f3f4fb;

    .query {
      background: #fff;
      padding: 0.24rem 0.36rem;
      /deep/ .van-field__control:disabled{
        color: #666666;
        -webkit-text-fill-color: #666666;
      }
      .query_item:not(:first-child){
        border-top: 1px solid #E5E5E5;
      }
      .query_title{
        font-size: 0.32rem;
        padding: 0.32rem 0 0.12rem;
      }
      .cell_picker{
        padding-bottom: 0.32rem;
        .field_style{
          background: #F6F6F6;
          border-radius: 0.08rem;
        }
      }
      .flex_cell{
        display: flex;
        .cell_divider{
          margin-right: 0.3rem;
        }
      }
    }
    .list_content{
      padding: 0.24rem;
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
        .flex_item{
          display: flex;
          align-items: center;
          justify-content: space-between;
          line-height: 0.92rem;
          height: 0.92rem;
          padding: 0 0.32rem;
        }
        .cell_header{
          background: #D4F2E2;
        }
        .diviver{
          width: 0.01rem;
          min-height: 0.7rem;
          background: #E5E5E5;
        }
        .flex_column{
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 33%;
        }
        .flex_row{
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 1.28rem;
          padding: 0 0.32rem;
        }

        .top_line{
          border-top: 0.01rem solid #E5E5E5;
        }
        .halfWidth{
          width: 47%;
          min-width: 47%;
        }
      }
      .right_content{
        height: 100%;
        display: flex;
        align-items: center;
        min-width: 2.5rem;
        .flex_right{
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 50%;
          min-width: 50%;
        }
      }
    }
    .main_text{
      color: #3DB871;
    }
    .sub_text{
      color: #999999;
    }
    .default_text{
      color: #000;
    }
    .fz24{
      font-size: 24px;
    }
    .mt12{
      margin-top: 0.12rem;
    }
    .edit_icon{
      font-size: 0.48rem;
      color: #00CA84;
    }
    .delete_icon{
      font-size: 0.48rem;
      color: #FE8A01;
    }
  }
</style>
