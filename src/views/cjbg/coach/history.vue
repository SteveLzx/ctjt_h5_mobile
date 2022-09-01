<template>
  <div class="content">
    <div class="query_content">
      <van-cell-group class="cell_picker" inset>
        <van-field
          v-model="picker.value.text"
          class="field_style"
          disabled
          clickable
          name="picker"
          placeholder="筛选项目"
          right-icon="arrow-down"
          clearable
          clear-trigger="always"
          @click="handlePicker"
          @clear="handlePickerClear"
        />
        <van-popup v-model:show="picker.showPicker" position="bottom">
          <van-picker
            :columns="options"
            @confirm="onConfirm"
            @cancel="picker.showPicker = false"
          />
        </van-popup>
      </van-cell-group>
      <van-cell-group class="cell_time_picker" inset>
        <van-field
          v-model="datetimePicker.value"
          class="field_style"
          disabled
          clickable
          name="datetimePicker"
          placeholder="选择日期"
          clearable
          clear-trigger="always"
          @click="handleDatePicker"
          @clear="handleDatePickerClear"
        >
        <template #right-icon>
          <i class="iconfont tab_style">&#xe64a;</i>
        </template>
        </van-field>
       <van-popup v-model:show="datetimePicker.showPicker" position="bottom">
          <van-datetime-picker
            v-model="datetimePicker.dataValue"
            type="date"
            title="选择日期"
            @confirm="onConfirmDatePicker"
            @cancel="datetimePicker.showPicker = false"
          />
        </van-popup>
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

            <div class="cell">
              <div class="cell_title">练习时间</div>
              <div class="cell_text">{{getloginDate(item)}}</div>
              <div class="late" v-if="item.appointStatusStr">{{item.appointStatusStr}}</div>
            </div>
            <div class="cell">
              <div class="cell_title">预约时间</div>
              <div class="cell_text">{{getAppointDate(item)}}</div>
            </div>
            <div class="cell">
              <div class="cell_title">进阶情况</div>
              <div class="cell_text">{{item.upgradeRecords}}</div>
            </div>
            <div class="cell">
              <div class="cell_title">当前进度</div>
              <div class="cell_text">{{item.nowLearnPhaseName}}</div>
            </div>
            <div class="cell">
              <div class="cell_title">练习项目</div>
              <div class="cell_text">
                {{item.learnPhaseName}}
              </div>
            </div>
            <div class="cell">
              <div class="cell_title">常犯错误</div>
              <div class="cell_text">
                <div v-for="(error, key) in getSpiltList(item.errorContent)" :key="key">{{error}}</div>
              </div>
              <div class="error_time">错误次数: {{item.errorItem}}次</div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
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
  List
} from 'vant';
import {
  verifyLogin, setBanBanTitle, banbanCall, getYMDObj, getQueryString
} from '@/assets/js/common';
import { queryHistory, queryProjectLevel } from './api';

export default {
  setup() {
    setBanBanTitle('历史练习');
    // 下拉选择器(筛选项目)初始值
    const picker = reactive({
      value: {},
      showPicker: false,
    });
    // 时间选择器初始值
    const datetimePicker = reactive({
      value: '',
      showPicker: false,
      dataValue: new Date(),
    });

    const options = ref([]);

    // 打开下拉选择器弹窗
    const handlePicker = () => {
      picker.showPicker = true;
    };

    // 打开时间选择器弹窗
    const handleDatePicker = () => {
      datetimePicker.dataValue = datetimePicker.value ? new Date(datetimePicker.value) : new Date();
      datetimePicker.showPicker = true;
    };

    // 处理预约时间字段
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

    // 处理练习时间字段
    const getloginDate = (item = {}) => {
      const { loginTime, loginoutTime }: any = item;
      let str = '';
      if (loginTime) {
        const loginDate: any = getYMDObj(loginTime);
        str = `${loginDate.year}-${loginDate.month}-${loginDate.day} ${loginDate.hours}:${loginDate.min}`;
      }
      if (loginoutTime) {
        const loginoutDate: any = getYMDObj(loginoutTime);
        str += `-${loginoutDate.hours}:${loginoutDate.min}`;
      }
      return str;
    };

    // 调用接口所需字段初始值
    let query = reactive({
      current: 1,
      appointDate: '',
      pageSize: 10,
      projectLevel: -1,
      trainingPlaceId: getQueryString('trainingPlaceId'),
      userId: getQueryString('userId')
    });

    // 下拉上拉卡片初始值
    const list = reactive({
      data: [],
      loading: false,
      finished: false,
      refreshing: false,
    });

    // 查询接口
    const queryHistoryApi = async (reqData: any) => {
      list.loading = true;
      const res: any = await queryHistory(reqData);
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

    // 查询下拉选项
    const queryProjectLevelApi = async () => {
      const queryLevel: any = {
        userId: getQueryString('userId')
      };
      const res: any = await queryProjectLevel(queryLevel);
      options.value = res.map((item: any) => ({
        ...item,
        text: item.projectName,
        value: item.projectLevel
      }));
    };

    // 下拉刷新
    const onListRefresh = () => {
      query = {
        ...query,
        current: 1,
      };
      list.data = [];
      list.finished = false;
      queryHistoryApi(query);
    };

    // 选择器确认操作
    const onConfirm = (value: any) => {
      picker.value = { ...value };
      picker.showPicker = false;
      query = {
        ...query,
        current: 1,
        projectLevel: value.value
      };
      list.data = [];
      list.finished = false;
      queryHistoryApi(query);
    };

    // 清除下拉选择数据
    const handlePickerClear = () => {
      query = {
        ...query,
        current: 1,
        projectLevel: -1
      };
      list.data = [];
      list.finished = false;
      queryHistoryApi(query);
    };

    // 时间选择器确认操作
    const onConfirmDatePicker = (value: Date) => {
      const valueDate = getYMDObj(value);
      datetimePicker.value = `${valueDate.year}-${valueDate.month}-${valueDate.day}`;
      datetimePicker.showPicker = false;
      query = {
        ...query,
        current: 1,
        appointDate: `${valueDate.year}-${valueDate.month}-${valueDate.day}`
      };
      list.data = [];
      list.finished = false;
      queryHistoryApi(query);
    };

    const handleDatePickerClear = () => {
      query = {
        ...query,
        current: 1,
        appointDate: ''
      };
      list.data = [];
      list.finished = false;
      queryHistoryApi(query);
    };
    // 滑动加载
    const onListLoad = () => {
      query = {
        ...query,
        current: query.current + 1
      };
      queryHistoryApi(query);
    };

    // 初始化
    const init = async () => {
      queryHistoryApi(query);
      queryProjectLevelApi();
    };

    init();

    const getSpiltList = (text = '') => text && text.split('###');

    return {
      picker,
      datetimePicker,
      options,
      onConfirm,
      handlePicker,
      handleDatePicker,
      onConfirmDatePicker,
      list,
      getAppointDate,
      getloginDate,
      onListRefresh,
      onListLoad,
      handlePickerClear,
      handleDatePickerClear,
      getSpiltList
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
  }
};

</script>

<style lang="less" scoped>
.content{
  background: #f3f4fb;
  .query_content{
    padding: 0.48rem 0rem 0.4rem;
    background: #fff;
    position: fixed;
    width: 100%;
    z-index: 100;
    box-shadow: 0px 12px 24px -8px #eee;
    .cell_picker{
      margin-bottom: 0.32rem;
    }
    .field_style{
      background: #F6F6F6;
      /deep/ .van-field__control:disabled{
        color: #000;
        -webkit-text-fill-color: #000;
      }
      .iconfont{
        font-size: 26px;
      }
    }
  }
  .list_content{
    padding: 3.24rem 0.24rem 0.24rem;
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
        .cell_title{
          width: 20%;
          min-width: 20%;
          background: #EEFFF6;
          text-align: center;
          padding: 0.26rem 0.16rem;
        }
        .cell_text{
          padding: 0.26rem 0.16rem;
          flex: auto;
          word-break: break-all;
        }
        .late{
          color: #3DB871;
          border-left: 1px solid #e5e5e5;
          padding: 0.26rem 0.16rem;
          white-space: nowrap;
        }
        .error_time{
          color: #3DB871;
          border-left: 1px solid #e5e5e5;
          padding: 0.26rem 0.16rem;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
