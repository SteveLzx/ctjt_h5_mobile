// pages_znyc/appoint_car
<template>
    <div style="background: #f5f3f5;height:100%">
      <ul class="item_list">
        <li @click="showVenuePicker = true">
          位置
          <span>
            {{currentVenue.placeName || '暂无'}}
            <van-icon name="arrow" color="#9c9c9c" />
          </span>
        </li>
      </ul>
      <ul class="calendar_transverse" id="calendarScrollEl" v-if="calendarList.length > 0">
        <li @click="chooseCalendar" class="left">
          <p><i class="iconfont calendar_icon">&#xe64a;</i></p>
          <i class="iconfont up_icon">&#xe64c;</i>
        </li>
        <li :class="{'active': currentDay === item.yearMonthDay}"
          v-for="item in calendarList" :key="item.day" @click="chooseDate(item)">
          <p class="date">{{item.month > 9 ? item.month : '0' + item.month}}-{{item.day > 9 ? item.day : '0' + item.day}}</p>
          <p class="week">周{{['日', '一', '二', '三', '四', '五', '六'][item.weekday]}}</p>
          <span class="tag" :style="{color: currentDay === item.yearMonthDay ? '#fff' : '#FA6400'}" v-if="item.isFull">(已约满)</span>
          <span class="tag" v-else-if="item.isCan">(可约)</span>
          <div class="split" v-if="currentDay !== item.yearMonthDay"></div>
        </li>
      </ul>
      <div class="car_list_box" id="scrollEl">
        <transition name="homeapp">
          <ul v-show="transitionFlag">
            <li class="time_list" :style="{'height': currentTime === item.timeRange ? `3.92rem` : '56px'}"
            v-for="(item, index) in appointmentInfo" :key="index" :id="'list_' + index">
              <div class="time_quantum" @click="toggleList(item, index)" :class="{'active': currentTime === item.timeRange, 'has_mine': item&&Number(item.coachStuNums) }">
                <i class="iconfont car">&#xe65a;</i>{{item.timeRange}}
                <span class="right_text">
                  <span class="status" v-if="item.totalAlreadyAppointNums === 0 || Number(item.totalAppointNums) > Number(item.totalAlreadyAppointNums)">
                    {{item.totalAlreadyAppointNums}}/{{item.totalAppointNums}}辆
                  </span>
                  <span class="status_full" v-else>已约满</span>
                  <i v-if="currentTime !== item.timeRange" class="iconfont">&#xe64c;</i>
                  <i v-else class="iconfont">&#xe64b;</i>
                </span>
                <span v-if="item&&Number(item.coachStuNums)" class="my_num">{{item.coachStuNums}}名</span>
              </div>
              <ul>
                <li class="car_model" v-for="val in item.list" :key="val.driveType">
                  {{val.driveType === 6 ? 'C1' : 'C2'}}学员
                  <div class="progress_line">
                    <p>已预约{{val.alreadyAppointNums}}/{{val.analogNums}}</p>
                    <div class="split">
                      <div class="percentage" :class="{'full': val.alreadyAppointNums !== 0 && val.analogNums === val.alreadyAppointNums}"
                      :style="{width: val.alreadyAppointNums === 0 ? 0 : (val.alreadyAppointNums/val.analogNums * 100) + '%'}"></div>
                    </div>
                  </div>
                  <div class="btn" @click="toDetail(val.driveType)">查看</div>
                </li>
              </ul>
            </li>
          </ul>
        </transition>
      </div>
      <my-calendar
      :show="showCalendar"
      :getCalendar="getCalendar"
      :chooseCalendar="chooseCalendar"
      :currentDay="currentDay"
      :chooseDate="chooseDate"
      :todayNull="todayNull"
      :venueId="currentVenue.placeId"
      :advanceDays="currentVenue.advanceDays || 0"
      :isCoach="true"
      ></my-calendar>
      <van-popup v-model:show="showVenuePicker" position="bottom">
        <van-picker
          :columns="venueOptions"
           :columns-field-names="customFieldName"
          @confirm="onVenueConfirm"
          @cancel="showVenuePicker = false"
        />
      </van-popup>
    </div>
</template>

<script lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue';
import { verifyLogin, setBanBanTitle } from '@/assets/js/common';
import { getYearMonthDay } from '@/assets/js/util';
import {
  Icon,
  Popup,
  Picker
} from 'vant';
import MyCalendar from './component/calendar.vue';
import { queryAnalogAbleDate, queryAnalogReserveInfo, queryAnalogReserveInfoBytimeRange } from './api';

type CalendarDataType = {
  year: string;
  month: string;
  days: DaysType[];
}
type DaysType = {
  [key: string]: string | boolean | number | any[];
}

export default {
  setup() {
    setBanBanTitle('预约进度');
    const { proxy } = getCurrentInstance();
    const showCalendar = ref(false); // 控制日历展开
    const calendarList = ref([]); // 日历

    const showVenuePicker = ref(false);
    const venueOptions = ref([]);
    const customFieldName = ref({
      text: 'placeName',
    });
    // 控制日历展开和关闭
    const chooseCalendar = () => {
      showCalendar.value = !showCalendar.value;
    };
    // 接收日历传递过来的日历列表
    const getCalendar = (calendar: CalendarDataType[]) => {
      let list: DaysType[] = [];
      calendar.forEach(item => {
        list = list.concat(item.days);
      });
      calendarList.value = list.filter(item => !item.before && item.isCan);
    };
    // 选中的日期，默认是今天
    const currentDay = ref(getYearMonthDay(new Date()).yearMonthDay);
    // 当前场地
    const currentVenue = ref({ advanceDays: 0 });
    // 当前训练场的预约时段信息
    const appointmentInfo = ref([]);
    // 当前选中的时间段
    const currentTime = ref('');
    // 当天预约已结束
    const todayNull = ref(false);
    // 动画开关
    const transitionFlag = ref(false);
    const count = ref(0);
    const queryByTimeRange = async (item: DaysType = {}) => {
      // 查询当前时间段下的预约情况
      const sendData = {
        appointDate: currentDay.value,
        placeId: currentVenue.value.placeId,
        timeRange: currentTime.value
      };
      const modelList = await queryAnalogReserveInfoBytimeRange(sendData);
      const copyItem = item;
      copyItem.list = modelList as any[];
    };
    // 展开收起预约列表
    const toggleList = async (item: DaysType = {}, index: number, key?: number) => {
      currentTime.value = currentTime.value !== item.timeRange ? item.timeRange : '';
      if (key) currentTime.value = item.timeRange; // 选择时间后默认展开第一个
      if (currentTime.value) {
        queryByTimeRange(item);
      }
      // 点击的时间段在最上面
      const scrollEl = document.querySelector('#scrollEl');
      (scrollEl as Element).scrollTo({ top: 68.5 * index, behavior: 'smooth' });
    };

    const chooseDate = async (item: DaysType = {}, key?: number) => {
      if (item.yearMonthDay && !item.isCan) return;
      // 关闭弹窗日历
      showCalendar.value = false;
      transitionFlag.value = false; // 入场动画
      const data = {
        appointDate: item.yearMonthDay || currentDay.value,
        placeId: currentVenue.value.placeId
      };
      console.log(data);
      appointmentInfo.value = await queryAnalogReserveInfo(data);
      setTimeout(() => {
        transitionFlag.value = true; // 入场动画
      }, 300);
      // 如果当天已经预约结束，则去除当天，跳转到第二天
      if ((!appointmentInfo.value || appointmentInfo.value.length === 0) && count.value < 1) {
        console.log(count.value);
        todayNull.value = true;
        count.value += 1;
        chooseDate(calendarList.value[1]);
        return;
      }
      count.value = 0;
      // 选中的日期
      currentDay.value = item.yearMonthDay || currentDay.value;
      currentTime.value = '';
      // 默认展开第一个
      // if (!key) setTimeout(() => { toggleList(appointmentInfo.value[0], 0, 1); }, 1);
      // 滚动到最上面
      const scrollEl = document.querySelector('#scrollEl');
      (scrollEl as Element).scrollTop = 0;
      for (let i = 0; i < calendarList.value.length; i += 1) {
        if (calendarList.value[i].yearMonthDay === currentDay.value) {
          const calendarScrollEl = document.querySelector('#calendarScrollEl');
          (calendarScrollEl as Element).scrollTo({ left: 56 * i, behavior: 'smooth' });
          return;
        }
      }
    };

    // 校验登录后查询教练场地信息
    verifyLogin(1).then(async () => {
      const res: any = await queryAnalogAbleDate();
      currentVenue.value = (res && res[0]) || {};
      venueOptions.value = res || [];
      chooseDate();
    });

    // 跳转到明细
    const toDetail = (type: number) => {
      sessionStorage.setItem('calendarList', JSON.stringify(calendarList.value));
      const query = {
        time: currentTime.value,
        date: currentDay.value,
        trainingPlaceId: currentVenue.value.placeId,
        tabFlag: type
      };
      sessionStorage.setItem('fromSubProgress', '1');
      proxy.$root.$router.push({ path: '/coach/simulator_detail', query });
    };

    const onVenueConfirm = (currentValue: any) => {
      currentVenue.value = currentValue || {};
      showVenuePicker.value = false;
      chooseDate();
    };

    return {
      toggleList,
      showCalendar,
      chooseCalendar,
      currentVenue,
      getCalendar,
      calendarList,
      chooseDate,
      currentDay,
      appointmentInfo,
      currentTime,
      todayNull,
      transitionFlag,
      toDetail,
      queryByTimeRange,
      showVenuePicker,
      venueOptions,
      onVenueConfirm,
      customFieldName
    };
  },
  components: {
    MyCalendar,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [Picker.name]: Picker
  },
  activated() {
    const { proxy } = getCurrentInstance();
    if (proxy.currentTime) proxy.chooseDate();
    setBanBanTitle('预约进度');
  }
};

</script>

<style lang="less" scoped>
.item_list{
  background: #fff;
  li{
    line-height: 100px;
    padding: 0 32px;
    color: #000;
    font-size: 32px;
    font-weight: 400;
    border-bottom: solid 1px #e5e5e5;
    span{
      float: right;
      color: #999;
    }
  }
}
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.calendar_transverse{
  background: #fff;
  height: 122px;
  // overflow-x: scroll;
  overflow: scroll;
  display: flex;
  // width: calc(100% - 112px);
  border-bottom: solid 2px #e5e5e5;
  // padding-left: 112px;
  // position: relative;
  .left{
    z-index: 2;
    background: #fff;
    position: -webkit-sticky;
    position: sticky;
    left: 0;
  }
  li{
    min-width: 112px;
    text-align: center;
    position: relative;
    padding: 19px 0 9px;
    color: #666;
    &.active{
      background: #357EF9;
      color: #fff;
      border-radius: 8px;
      .tag{
        color: #fff;
      }
    }
    .date{
      font-size: 24px;
      line-height: 24px;
    }
    .week{
      font-size: 22px;
      line-height: 26px;
    }
    .tag{
      font-size: 20px;
      line-height: 28px;
      color: #357EF9;
    }
    .split{
      width: 2px;
      height: 64px;
      background: #e5e5e5;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    .calendar_icon{
      font-size: 40px;
      color: #666;
      position: relative;
      top: 6px;
    }
    .up_icon{
      font-size: 40px;
      color: #666;
    }
  }
}
.car_list_box{
  background: #f5f3f5;
  height: calc(100% - 247px);
  padding: 23px 24px 0;
  overflow: scroll;
  .time_list{
    line-height: 112px;
    border-radius: 8px;
    background: #fff;
    color: #000;
    font-size: 34px;
    margin-bottom: 25px;
    transition: height 0.3s ease-in-out;
    height: 112px;
    overflow: hidden;
    .time_quantum{
      overflow: hidden;
      height: 112px;
      position: relative;
      .car{
        font-size: 44px;
        color: #357EF9;
        margin: 0 16px 0 32px;
        position: relative;
        top: 6px;
      }
      .my_num{
        position: absolute;
        left: 0;
        top: 0;
        z-index: 10;
        background: #FE8A01;
        color: #fff;
        font-size: 24px;
        height: 30px;
        line-height: 30px;
        padding: 2px 10px;
        border-bottom-right-radius: 8px;
      }
    }
    > .active{
      background-image: linear-gradient(to bottom, #E7F6FF, #FFFFFF);
    }
    > .has_mine{
      background: #f0fff8;
    }
    .right_text{
      float: right;
      font-size: 28px;
      color: #999;
      margin-right: 32px;
      .status{
        color: #357EF9;
      }
      .status_full{
        font-size: 28px;
        color: #FA6400;
      }
    }
  }
}
.car_model{
  padding: 40px 32px;
  color: #000;
  font-size: 34px;
  display: flex;
  line-height: 60px;
  .progress_line{
    margin-left: 44px;
    p{
      padding-top: 7px;
      font-size: 26px;
      line-height: 26px;
      margin-bottom: 16px;
    }
    .split{
      width: 224px;
      height: 8px;
      border-radius: 8px;
      background: #E5E5E5;
      .percentage{
        width: 50%;
        background: #357EF9;
        height: 100%;
        border-radius: 8px;
        &.full{
          background: #FA6400;
        }
      }
    }
  }
  .btn{
    margin-left: auto;
    width: 140px;
    border-radius: 8px;
    background-image: linear-gradient(to right, #09A1F6, #357EF9);
    color: #fff;
    font-size: 26px;
    text-align: center;
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  transition: opacity 0.5s;
  opacity: 0;
}

/* homeapp */
.homeapp-enter-active, .homeapp-leave-active {
  // animation: moveOut 0.15s;
  transition: opacity 0.5s;
}
.homeapp-enter-from, .homeapp-leave-to {
  // animation: moveIn 0.15s;
  transition: opacity 0.5s;
  opacity: 0;
}
</style>
