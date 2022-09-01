<template>
  <div>
    <div class="calendar_pop" v-if="show" @click="chooseCalendar">
    </div>
    <div class="calendar_box" :style="{'bottom': show ? 0 : '-100%', 'opacity': show ? 1 : 0}">
      <i class="iconfont" @click="chooseCalendar">&#xe64d;</i>
      <p class="tit">选择日期</p>
      <ul class="week_list">
        <li v-for="item in weekList" :key="item">{{item}}</li>
      </ul>
      <ul>
        <li v-for="(val, key) in calendarData" :key="key">
          <p class="year_month">{{val.year}}年{{val.month}}月</p>
          <ul class="day_box">
            <li class="day" v-for="(item, index) in val.days" :key="index"
            :class="{
              'before': item.before,
              'active': currentDay === item.yearMonthDay
            }" @click="chooseDate(item)"
            >{{item.day}}
              <span class="booking" v-if="item.isFull" :style="{color: currentDay === item.yearMonthDay ? '#fff' : '#FA6400'}">已约满</span>
              <span class="booking" v-else-if="item.isCan">可约</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  watch
} from 'vue';
import $http from '@/assets/js/request';
import { getYearMonthDay } from '@/assets/js/util';
import { getGlobalData } from '@/assets/js/global_data';

function queryAppointadvanceDays(data: any) {
  const url = 'teaching/v1/coach/queryAnalogSurplusNumInfo';
  return new Promise(resolve => {
    $http.get(`${url}/${data.trainingPlaceId}`).then(res => resolve(res));
  });
}

let advanceDays = 0;
const countDay = (year: number, month: number, day?: number, secondDays?: number | undefined) => {
  const dayData = [];
  const days = [];
  let secondDaysCopy = secondDays;
  // 获取当月天数
  const lastDay = getYearMonthDay(new Date(year, month, 0)).day;
  for (let i = 1; i <= lastDay; i += 1) {
    const monthCopy = month > 9 ? month : `0${month}`;
    const dayCopy = i && i < 10 ? `0${i}` : i;
    const yearMonthDay = `${year}-${monthCopy}-${dayCopy}`;
    if (!(day ? day > i : false) && ((secondDaysCopy && secondDaysCopy > 0) || secondDaysCopy === undefined)) {
      const dayObj = {
        before: day ? day > i : false,
        today: day ? day === i : false,
        day: i,
        year,
        month,
        weekday: getYearMonthDay(new Date(year, month - 1, i)).weekday,
        lastDay,
        startEnd: false,
        yearMonthDay,
        isCan: advanceDays && advanceDays > 0 // 是否可预约
      };
      days.push(dayObj);
      if (advanceDays && advanceDays > 0) advanceDays -= 1; // 可预约的天数,从当天开始计算
    }
    if (secondDaysCopy) secondDaysCopy -= 1; // 第二个月需要添加的天数
  }
  // 补齐当天前面的星期
  const todayWeekday = days[0].weekday;
  const todayDay = days[0].day;
  for (let i = 0; i < todayWeekday; i += 1) {
    if (todayDay - i > 1) { // 当天前面的过期时间补齐一行，如果到上个月的时间了就用空补
      days.unshift({
        before: true,
        today: false,
        day: todayDay - i - 1,
        year,
        month,
      });
    } else {
      days.unshift({ empty: true });
    }
  }
  dayData.push({
    year,
    month,
    days
  });
  return dayData;
};

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: () => false
    },
    advanceDays: {
      type: Number,
      default: () => 0
    },
    currentDay: {
      type: String,
      default: () => ''
    },
    todayNull: {
      type: Boolean,
      default: false
    },
    venueId: {
      type: String,
      default: ''
    },
    isCoach: {
      type: Boolean,
      default: false
    },
  },
  setup(props: any, context: any) {
    const {
      chooseCalendar,
      getCalendar,
      chooseDate
    } = context.attrs;
    const {
      year,
      month,
      day
    } = getYearMonthDay(new Date());
    const calendarData = ref([]);
    watch(props, async () => {
      if (advanceDays === props.advanceDays) return;
      // 可约天数变化时重新更新日历显示
      advanceDays = props.advanceDays;
      const learnPhaseInfo: any = getGlobalData('learnPhase') || {};

      const data = {
        trainingPlaceId: props.venueId,
        learnPhase: learnPhaseInfo.learnPhase,
        projectLevel: learnPhaseInfo.projectLevel
      };
      calendarData.value = countDay(year, month, day, undefined);
      // 展示35天，当月不够的用下月来凑数
      const secondDay = (advanceDays > 35 ? advanceDays : 35) - calendarData.value[0].days.length;
      if (secondDay > 0) {
        let monthCopy = month;
        let yearCopy = year;
        if (month === 12) {
          monthCopy = 1;
          yearCopy += 1;
        } else {
          monthCopy += 1;
        }
        calendarData.value = calendarData.value.concat(countDay(yearCopy, monthCopy, 0, secondDay));
      }
      const res = await queryAppointadvanceDays(data);
      // 后台返回每天的预约情况
      const dayList = calendarData.value[0].days.concat(calendarData.value[1] ? calendarData.value[1].days : []);
      dayList.forEach((item: any) => {
        const dayCopy = item;
        (res as any[]).forEach(val => {
          // 当前的可预约=已预约，则显示已约满
          if (val.appointDate === item.yearMonthDay && (val.alreadyAppointNums === val.maxAlreadyAppointNums || val.surplusNum <= 0)) {
            dayCopy.isFull = true;
          }
        });
      });
      // 如果当天已经约满了，则去除当天
      if (props.todayNull) {
        calendarData.value[0].days.forEach((val: any) => {
          const dayCopy = val;
          if (val.today) {
            dayCopy.isCan = false;
            dayCopy.before = true;
          }
        });
      }
      // 将日历传给父元素
      getCalendar(calendarData.value);
    });
    const weekList = ref(['日', '一', '二', '三', '四', '五', '六']);
    return {
      weekList,
      calendarData,
      chooseCalendar,
      chooseDate
    };
  }
});

</script>

<style lang="less" scoped>
.calendar_pop{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0,0,0,0.35);
  z-index: 2;
}
.calendar_box{
  background: #fff;
  z-index: 300;
  position: fixed;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  bottom: -100%;
  left: 0;
  right: 0;
  padding-bottom: 88px;
  transition: all 0.3s;
  padding-top: 4px;
  opacity: 0;
  .iconfont{
    font-size: 26px;
    padding: 16px;
    color: #999;
  }
  .tit{
    line-height: 50px;
    color: #999;
    font-size: 36px;
    margin-bottom: 24px;
    text-align: center;
  }
  .week_list{
    display: flex;
    text-align: center;
    background: #f0fff8;
    line-height: 80px;
    color: #000;
    font-size: 28px;
    li{
      flex: 1;
    }
    li:first-child, li:last-child{
      color: #E02020;
    }
  }
}
.year_month{
  line-height: 60px;
  color: #000;
  font-size: 28px;
  padding-left: 37px;
}
.day_box{
  display: flex;
  flex-wrap: wrap;
  .day{
    width: 14.2%;
    text-align: center;
    height: 120px;
    line-height: 90px;
    font-size: 28px;
    color: #000;
    position: relative;
    &.before{
      color: #999;
    }
    .booking{
      position: absolute;
      left: 50%;
      bottom: 25px;
      transform: translateX(-50%);
      color: #3DB871;
      font-size: 22px;
      line-height: 22px;
      width: 100%;
    }
    &.active{
      background: #3DB871;
      color: #fff;
      border-radius: 8px;
      .booking{
        color: #fff;
      }
    }
  }
}
</style>
