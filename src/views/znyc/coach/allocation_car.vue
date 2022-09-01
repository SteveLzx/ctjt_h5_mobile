<template>
  <div v-if="authFlag && !isSubmit">
    <div class="allocation_car_wrap">
      <div class="form_list">
        <p class="tit">请选择训练场</p>
        <div class="choose_box">
          <span>{{currentVenue.venueName}}</span>
        </div>
      </div>
      <div class="form_list split">
        <p class="tit">请选择占用规则</p>
        <div class="choose_box" @click="showPickerFn('ruleType')">
          <span>{{pickerValue.ruleType}}</span>
          <i class="iconfont">&#xe64c;</i>
        </div>
      </div>
      <!-- 开始时间都得选 -->
      <div class="form_list split" v-show="sendData.ruleType">
        <p class="tit">请选择{{sendData.ruleType === 1 ? '占用' : '开始'}}日期</p>
        <div class="choose_box" @click="showCalendarFn('beginTime')">
          <span>{{pickerValue.beginTime}}</span>
          <i class="iconfont date">&#xe64a;</i>
        </div>
        <p class="tit">{{sendData.ruleType === 1 ? '占用' : '开始'}}时段</p>
        <div class="choose_box" @click="showPickerFn('beginTimeRange')">
          <span>{{pickerValue.beginTimeRange}}</span>
          <i class="iconfont">&#xe64c;</i>
        </div>
      </div>
        <!-- 所有时间段增加结束时间 -->
      <div v-show="sendData.ruleType === 2" class="bg_box">
        <div class="form_list split">
          <p class="tit">请选择结束日期</p>
          <div class="choose_box" @click="showCalendarFn('endTime')">
            <span>{{pickerValue.endTime}}</span>
            <i class="iconfont date">&#xe64a;</i>
          </div>
          <p class="tit">结束时段</p>
          <div class="choose_box" @click="showPickerFn('endTimeRange')">
            <span>{{pickerValue.endTimeRange}}</span>
            <i class="iconfont">&#xe64c;</i>
          </div>
        </div>
      </div>
      <div v-show="sendData.ruleType !== 0" class="bg_box">
        <div class="form_list split" style="padding-bottom: 0">
          <div class="stepper_box line">
            C1占用
            <span>辆车</span>
            <van-stepper input-width="43" button-size="29"
            v-model.number="sendData.c1Num" :allow-empty="true"
            min="0" max="99" decimal-length="0" :integer="true"/>
          </div>
          <div class="stepper_box">
            C2占用
            <span>辆车</span>
            <van-stepper input-width="43" button-size="29"
            v-model.number="sendData.c2Num" :allow-empty="true"
            min="0" max="99" decimal-length="0" :integer="true"/>
          </div>
        </div>
        <div class="form_list split">
          <p class="tit">占用原因</p>
          <div class="choose_box" @click="showPickerFn('reason')">
            <span>{{pickerValue.reason}}</span>
            <i class="iconfont date">&#xe64c;</i>
          </div>
          <div class="entry_box" v-if="reasonType === 6">
            <input type="text" placeholder="请输入原因" class="reason_input" v-model="sendData.reason" maxlength="99">
          </div>
        </div>
        <div class="a_c_placeholder"></div>
      </div>
    </div>
    <div class="a_c_submit_btn" v-show="sendData.ruleType !== 0" @click="submit">确认提交</div>
    <van-calendar v-model:show="showCalendar"
    @confirm="calendarOnConfirm"
    :min-date="new Date()"
    :max-date="new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)"
    :title="currentCalendar.title"
    color="linear-gradient(to right, #4CCB81, #3DB871)"/>
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker
        :columns="currentPicker.columns"
        :title="currentPicker.title"
        @confirm="pickerOnConfirm"
        @cancel="showPicker = false"
        value-key="value"
      />
    </van-popup>
    <transition name="fade">
      <div v-if="popupFlag">
        <Popup1
        @cancel="popupFlag = false" @confirm="makeSure"
        closeName="popupFlag" confirmText="确认申请">
          <p class="created_by">提交人: {{createdBy}}</p>
        </Popup1>
      </div>
    </transition>
  </div>
    <div class="auth_con" v-if="!authFlag && !isSubmit">
    <img src="../../../assets/images/a_c_auth.png" alt="">
    <p>您没有提交申请的权限，请联系片区经理～</p>
  </div>
  <div class="a_c_submit_success" v-if="isSubmit">
    <i class="iconfont">&#xe65d;</i>
    <p class="tit">申请成功</p>
    <ul class="result">
      <li>{{sendData.ruleType === 1 ? '占用' : '开始'}}日期<span>{{sendData.beginTime}}</span></li>
      <li>{{sendData.ruleType === 1 ? '占用' : '开始'}}时段<span>{{sendData.beginTimeRange}}</span></li>
      <li v-if="sendData.ruleType === 2">结束日期<span>{{sendData.endTime}}</span></li>
      <li v-if="sendData.ruleType === 2">结束时段<span>{{sendData.endTimeRange}}</span></li>
      <li>C1占用车辆<span>{{sendData.c1Num}}辆</span></li>
      <li>C2占用车辆<span>{{sendData.c2Num}}辆</span></li>
      <li>占用原因<span>{{sendData.reason}}</span></li>
      <li>提交人<span>{{createdBy}}</span></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import {
  Calendar,
  Picker,
  Popup,
  Stepper,
  Toast
} from 'vant';
import {
  verifyLogin, setBanBanTitle, getYMD, getQueryString
} from '@/assets/js/common';
import Popup1 from '@/components/popup_1/index.vue';
import { getToken } from '@/assets/js/token_cookie';
import {
  queryBookableDate, getTimeRangeByDate, createAppointRule, queryCarAppoint, updateCarAppoint
} from './api';

const pickerList: any = {
  ruleType: {
    columns: [
      {
        key: 1,
        value: '部分时段'
      }, {
        key: 2,
        value: '全时段'
      }
    ],
    title: '占用规则'
  },
  beginTime: {
    title: '开始日期'
  },
  endTime: {
    title: '结束日期'
  },
  beginTimeRange: {
    columns: [],
    title: '开始时段'
  },
  endTimeRange: {
    columns: [],
    title: '结束时段'
  },
  reason: {
    columns: [
      {
        key: 2,
        value: '考前培训'
      }, {
        key: 3,
        value: '车辆维修、养护'
      }, {
        key: 4,
        value: '参观'
      }, {
        key: 5,
        value: '开会'
      }, {
        key: 6,
        value: '其他'
      }
    ],
    title: '占用规则'
  },
};

export default defineComponent({
  setup() {
    setBanBanTitle('配置车辆');
    // 需要提交的数据
    const sendData = ref({
      ruleType: 0,
      beginTime: '',
      beginTimeRange: '',
      c1Num: 0,
      c2Num: 0,
      endTime: '',
      endTimeRange: '',
      reason: '',
      trainingPlaceId: ''
    });

    // 下拉展示的字段
    const pickerValue = ref({
      ruleType: '请选择',
      beginTime: '请选择',
      endTime: '请选择',
      beginTimeRange: '请选择',
      endTimeRange: '请选择',
      reason: '请选择'
    });

    // 确认提交提示
    const popupFlag = ref(false);
    // 提交人html
    const createdBy = ref('');
    // 提交后回显
    const isSubmit = ref(false);

    // 登录后没有姓名则无权提交
    const authFlag = ref(true);
    // 当前训练场
    const currentVenue = ref({});

    const getRuleType = (type: number) => {
      let label = '请选择';
      pickerList.ruleType.columns.forEach((el: any) => {
        if (el.key === type) {
          label = el.value;
        }
      });
      return label;
    };
    const getReason = (type: number) => {
      let label = '请选择';
      pickerList.reason.columns.forEach((el: any) => {
        if (el.key === type) {
          label = el.value;
        }
      });
      return label;
    };
    const isOther = (reason: string) => {
      const filterList = pickerList.reason.columns.filter((el: any) => el.value === reason);
      return filterList.length === 0;
    };
    // 占用原因类型
    const reasonType = ref(0);
    // 校验登录后查询教练场地信息
    verifyLogin(1).then(async () => {
      if (!getToken('loginName')) { // 登录后没有姓名则无权限
        authFlag.value = false;
        return;
      }
      const res: any = await queryBookableDate();
      currentVenue.value = (res && res[0]) || {};
      sendData.value.trainingPlaceId = currentVenue.value.venueId || ''; // 保存场地ID到sendData
      sendData.value.createdBy = getToken('loginMobile') || '';
      createdBy.value = getToken('loginName');
      const batchId = getQueryString('batchId');
      if (batchId) {
        const appoint: any = await queryCarAppoint({
          batchId
        });
        console.log('appoint', appoint);

        const {
          trainingPlaceId,
          ruleType,
          reason,
          endTimeRange,
          beginTime,
          beginTimeRange,
          c1Num,
          c2Num,
          endTime,
        } = appoint || {};

        sendData.value = {
          ...sendData.value,
          beginTime,
          beginTimeRange,
          c1Num,
          c2Num,
          endTime,
          endTimeRange,
          reason,
          ruleType,
          trainingPlaceId,
        };
        pickerValue.value = {
          ...pickerValue.value,
          ruleType: getRuleType(ruleType),
          beginTime,
          endTime,
          beginTimeRange,
          endTimeRange,
          reason
        };
        console.log('isOther', isOther(reason));
        if (isOther(reason)) {
          reasonType.value = 6;
          pickerValue.value.reason = '其他';
        }
      }
    });

    // 选择日期
    const showCalendar = ref(false);
    // 当前日历选择
    const currentCalendar = ref({});
    // 触发选择日期
    const showCalendarFn = (key: string) => {
      currentCalendar.value = {
        title: (pickerList as any)[key].title, // 下拉标题
        key, // 日期标识
      };
      showCalendar.value = true;
    };
    // 选择日期确认回调
    const calendarOnConfirm = async (e: any) => {
      const date = getYMD(1, e);
      const { key } = currentCalendar.value;
      sendData.value[key] = date; // 为sendData赋值
      pickerValue.value[key] = date; // 为pickerValue赋值
      showCalendar.value = false;
      // 获取当前日期下时间段列表
      const timeRangeList = await getTimeRangeByDate({
        appointDate: date,
        trainingPlaceId: currentVenue.value.venueId
      });
      const list: any[] = [];
      (timeRangeList as []).forEach((item: any) => {
        list.push({
          key: item.timeId,
          value: item.timeRange
        });
      });
      pickerList[`${key}Range`].columns = list;
      pickerValue.value[`${key}Range`] = '请选择'; // 重新选择日期后时段重置
      sendData.value[`${key}Range`] = ''; // 重新选择日期后时段重置
    };

    // 选择下拉
    const showPicker = ref(false);
    // 当前下拉
    const currentPicker = ref({});
    // 触发下拉
    const showPickerFn = (key: string) => {
      currentPicker.value = {
        title: (pickerList as any)[key].title, // 下拉标题
        key, // 下拉标识
        columns: (pickerList as any)[key].columns // 下拉列表
      };
      if (key.indexOf('Range') > -1 && (!currentPicker.value.columns || currentPicker.value.columns.length === 0)) {
        Toast('请先选择日期');
        return;
      }
      showPicker.value = true;
    };

    // 选择下拉确认回调
    const pickerOnConfirm = (e: any) => {
      const { key } = currentPicker.value;
      sendData.value[key] = key !== 'ruleType' ? e.value : e.key; // 赋值
      pickerValue.value[key] = e.value; // 赋值
      showPicker.value = false;
      if (key === 'reason') {
        reasonType.value = e.key;
        if (e.key === 6) sendData.value[key] = '';
      }
    };

    const submit = async () => {
      const {
        ruleType,
        beginTime,
        beginTimeRange,
        c1Num,
        c2Num,
        endTime,
        endTimeRange,
        reason
      } = sendData.value;
      if (!beginTime) {
        Toast(`请选择${ruleType === 1 ? '占用' : '开始'}日期`);
        return;
      }
      if (!beginTimeRange) {
        Toast(`请选择${ruleType === 1 ? '占用' : '开始'}时段`);
        return;
      }
      if (ruleType === 2) { // 所有时间段
        if (!endTime) {
          Toast('请选择结束日期');
          return;
        }
        if (!endTimeRange) {
          Toast('请选择结束时段');
          return;
        }
      }
      // 判断结束时间是否早于开始时间
      if (new Date(`${beginTime} ${beginTimeRange.split('-')[0]}`) >= new Date(`${endTime} ${endTimeRange.split('-')[1]}`)) {
        Toast('结束时段不得早于开始时段');
        return;
      }
      if (!c1Num && !c2Num) {
        Toast('请输入占用车辆数量');
        return;
      }
      if (!reason) {
        Toast(reasonType.value === 6 ? '请输入占用原因' : '请选择占用原因');
        return;
      }
      popupFlag.value = true;
    };

    // 提交确认
    const makeSure = async () => {
      const batchId = getQueryString('batchId');
      if (batchId) {
        await updateCarAppoint({
          batchId,
          occupyType: reasonType.value,
          ...sendData.value
        });
        isSubmit.value = true;
      } else {
        await createAppointRule({
          occupyType: reasonType.value,
          ...sendData.value,
        });
        isSubmit.value = true;
      }
    };

    return {
      authFlag,
      showCalendar,
      showPicker,
      calendarOnConfirm,
      pickerOnConfirm,
      showPickerFn,
      showCalendarFn,
      currentPicker,
      currentCalendar,
      currentVenue,
      sendData,
      pickerValue,
      reasonType,
      submit,
      popupFlag,
      createdBy,
      makeSure,
      isSubmit
    };
  },
  components: {
    [Calendar.name]: Calendar,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Stepper.name]: Stepper,
    Popup1
  }
});

</script>

<style lang="less" scoped>
.created_by{
  color: #3DB871;
  font-size: 32px;
  padding-left: 40px;
  padding-bottom: 140px;
}
.bg_box{
  background: #f6f6f6;
}
.allocation_car_wrap{
  padding-top: 24px;
  background: #f6f6f6;
  height: calc(100% - 24px);
}
.allocation_car_wrap .form_list{
  background: #fff;
  padding: 0 32px 32px;
  &.split{
    margin-top: 24px;
  }
  .tit{
    border-top: solid #f6f6f6 2px;
    line-height: 32px;
    font-size: 32px;
    color: #000;
    padding: 34px 0 17px;
    &.tit1{
      padding-bottom: 0;
    }
  }
  .choose_box{
    height: 84px;
    line-height: 84px;
    background: #f6f6f6;
    border-radius: 8px;
    padding: 0 32px;
    .iconfont{
      color: #999;
      font-size: 26px;
      float: right;
      &.date{
        font-size: 30px;
      }
    }
  }
  .entry_box{
    margin: 0 40px 0 0;
    .reason_input{
      height: 84px;
      line-height: 84px;
      border: solid 2px #999;
      border-radius: 8px;
      padding-left: 32px;
      width: 100%;
      font-size: 32px;
      margin-top: 16px;
    }
  }
  .stepper_box{
    padding: 32px 0;
    line-height: 58px;
    &.line{
      border-bottom: solid #E5E5E5 2px;
    }
    .van-stepper{
      float: right;
    }
    span{
      float: right;
      margin-left: 24px;
    }
  }
}
.a_c_submit_btn{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(to right, #4CCB81, #3DB871);
  color: #fff;
  line-height: 98px;
  font-size: 32px;
  text-align: center;
}
.a_c_placeholder{
  height: 130px;
}
.auth_con{
  height: 100%;
  background: #F4F4F4;
  text-align: center;
  img{
    width: 240px;
    height: auto;
    padding-top: 360px;
  }
  p{
    line-height: 40px;
    color: #666;
    font-size: 28px;
    margin-top: 44px;
  }
}
.a_c_submit_success{
  padding: 70px 24px 0;
  text-align: center;
  .iconfont{
    font-size: 80px;
    color: #52CD84;
  }
  .tit{
    margin: 16px 0 32px;
    line-height: 48px;
    font-size: 42px;
    color: #000;
  }
  .result li{
    display: flex;
    line-height: 38px;
    color: #363737;
    text-align: left;
    font-size: 28px;
    padding: 31px 8px;
    border-bottom: solid 2px #E5E5E5;
    span{
      flex: 1;
      text-align: right;
      color: #999;
      margin-left: 20px;
    }
  }
}
</style>
