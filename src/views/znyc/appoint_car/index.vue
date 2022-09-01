// pages_znyc/appoint_car
<template>
  <div>
    <van-notice-bar
      v-if="status == 1 && isPenaltyTime()"
      wrapable
      :scrollable="false"
      background="#F0FFF8"
    >
      <template #left-icon>
        <div class="notice_icon"></div>
      </template>
      <template #default>
        <span class="notice_text">
          {{getPenaltyTime()}}后修改，记录取消次数，当前已取消{{record.cancalCount || 0}}次，
          <span class="notice_main_text">累计{{config.cancalCount}}次将限制约车{{computNumber(config.cancalNoReservation/(60*24))}}日。</span>
          请谨慎选择！
        </span>
      </template>
    </van-notice-bar>
    <van-notice-bar
      v-if="status == 1 && !isPenaltyTime()"
      wrapable
      :scrollable="false"
      background="#F0FFF8"
    >
      <template #left-icon>
        <div class="notice_icon"></div>
      </template>
      <template #default>
        <span class="notice_text">
          {{getPenaltyTime()}}前可随意修改
        </span>
      </template>
    </van-notice-bar>
    <van-notice-bar
      v-if="status == 2"
      wrapable
      :scrollable="false"
      background="#F0FFF8"
    >
      <template #left-icon>
        <div class="notice_icon"></div>
      </template>
      <template #default>
        <span class="notice_text">
          追加预约成功后进阶，导致学习进度改变。系统会自动修改您的预约项目，匹配您当前的学习进度。
        </span>
      </template>
    </van-notice-bar>
    <div class="divider_line" v-if="status == 1 || status == 2"></div>
    <div style="background: #f5f3f5;height:100%" class="cell_group">

      <van-cell-group inset v-if="status == 1">
        <van-cell>
          <template #value>
            {{currentAppoint && currentAppoint.showAppointDate}} {{currentAppoint && currentAppoint.timeRange}}
          </template>
        </van-cell>
        <van-cell>
          <template #value>
            <div class="cell_currentAppoint">
              <div><i class="iconfont cell_icon">&#xe649;</i>{{currentAppoint && currentAppoint.learnPhaseName}}</div>
              <i class="iconfont cell_icon">&#xe65c;</i>
              <div><i class="iconfont cell_icon">&#xe645;</i>{{currentAppoint && currentAppoint.venueName}}</div>
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    <div class="divider_line" v-if="status == 1"></div>
      <ul class="item_list">
        <li v-if="status == 1">
          <div class="notice_text line_notice">
            <div class="line_icon"></div>
            修改预约提交成功后，之前预约记录
            <div class="notice_main_text">自动取消</div>
          </div>
        </li>
        <li @click="toNext(1)">
          学习进度
          <span>
            {{studentLearnInfo.learnPhaseName || '暂无'}}
            <van-icon name="arrow" />
          </span>
        </li>
        <li @click="test = !test">
          训练场
          <span>
            {{ currentVenue.venueName || '暂无'}}
            <i class="iconfont cell_icon" v-if="status == 1 || status == 2">&#xe648;</i>
            <van-icon name="arrow" v-else />
          </span>
        </li>
      </ul>
      <ul class="calendar_transverse" v-if="studentLearnInfo.learnPhaseName" id="calendarScrollEl">
        <li :class="{'active': currentDay === item.yearMonthDay}"
          v-for="item in calendarList" :key="item.day" @click="chooseDate(item)">
          <p class="date">{{item.month > 9 ? item.month : '0' + item.month}}-{{item.day > 9 ? item.day : '0' + item.day}}</p>
          <p class="week">周{{['日', '一', '二', '三', '四', '五', '六'][item.weekday]}}</p>
          <span class="tag" style="color: #FA6400" v-if="item.isFull">(已约满)</span>
          <span class="tag" v-else-if="item.isCan">(可约)</span>
          <div class="split"></div>
        </li>
      </ul>
      <div class="car_list_box" id="scrollEl">
        <transition name="homeapp">
          <ul v-show="transitionFlag">
            <li class="time_list" :style="{'height': currentTime === item.timeRange ? `${1.13*(item.totalAppointNums+1)}rem` : '56px'}"
            v-for="(item, index) in appointmentInfo" :key="index" :id="'list_' + index">
              <div class="time_quantum" @click="toggleList(item, index, $event)" :class="{'active': currentTime === item.timeRange }">
                <div class="icon" :class="{'full': item.totalAppointNums === item.alreadyAppointNums}">
                  <div></div>
                </div>
                {{item.timeRange}}
                <span class="car_status"
                v-if="(item.alreadyAppointNums / item.totalAppointNums) > 0.8 && (item.alreadyAppointNums / item.totalAppointNums) < 1">车位紧张</span>
                <span class="car_status status_full" v-if="item.totalAppointNums === item.alreadyAppointNums">已约满</span>
                <span class="right_text" v-if="currentTime !== item.timeRange">
                  展开 <i class="iconfont">&#xe64c;</i>
                </span>
                <span class="right_text" v-if="currentTime === item.timeRange">
                  收起 <i class="iconfont">&#xe64b;</i>
                </span>
              </div>
              <ul>
                <li class="car_list" v-for="val in item.canAppointNums" :key="val">
                  <i class="iconfont_car active"></i>
                  <div class="btn btn1" @click="countCurrentAppoint">可预约</div>
                </li>
                <li class="car_list" v-for="val in item.dtoList" :key="val.stuId">
                  <i class="iconfont_car"></i>
                  <div class="split"></div>
                  <img class="header_img" :src="val.url" v-if="val.url">
                  <div class="header_img_default" v-else></div>
                  <div class="user_name">{{val.stuId}}</div>
                  <div class="btn btn2" style="border: 1px solid #E5E5E5">已预订</div>
                </li>
              </ul>
            </li>

          </ul>

        </transition>
        <div class="no_data_content" v-if="(!appointmentInfo || appointmentInfo.length < 1)&&!loading">

          <img class="no_data_img" src="../../../assets/images/no_data.png" alt="">
          <div class="no_data_main">
            <div>今日所有可预约时间已过</div>
            <div>新的预约机会将于本日{{currentAppointBigin.slice(0, currentAppointBigin.lastIndexOf(':'))}}开放！</div>
          </div>
          <div class="no_data_line"></div>
          <div class="no_data_sub">
            <div>温馨提示</div>
            <div>为了保障所有学员公平享有预约机会，</div>
            <div>所有工作人员都无法干涉预约结果，完全先到先得，</div>
            <div>祝您预约到满意的练车时间！</div>
          </div>
        </div>
      </div>

      <transition name="fade">
        <div v-if="popupFlagA" style="position: relative; z-index: 3;">
          <div class="pop"></div>
          <div class="popup">
            <p class="tit">请确认预约信息</p>
            <ul class="msg_list">
              <li>时间: {{currentMonthDay}} {{currentTime}}</li>
              <li>项目: {{studentLearnInfo.learnPhaseName}}</li>
              <li>场地: {{currentVenue.venueName}}</li>
            </ul>
            <div class="btn btn1" @click="submit">确认</div>
            <div class="btn btn2" @click="popupFlagA = false" style="border: 1px solid #E5E5E5">取消</div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  computed,
  getCurrentInstance,
  onUnmounted
} from 'vue';
import {
  verifyLogin, setBanBanTitle, banbanCall, getQueryString, getYMDObj
} from '@/assets/js/common';
import { getYearMonthDay } from '@/assets/js/util';
import $http from '@/assets/js/request';
import TopTip from '@/components/TopTip';
import { getGlobalData, setGlobalData } from '@/assets/js/global_data';
import {
  Icon, Overlay, NoticeBar, CellGroup, Cell
} from 'vant';
import MyCalendar from './calendar.vue';

type CalendarDataType = {
  year: string;
  month: string;
  days: DaysType[];
}
type DaysType = {
  [key: string]: string | boolean | number;
}

function queryStudentLearnInfo() {
  return new Promise(resolve => {
    $http.post('teaching/v1/queryStudentLearnInfo').then(res => resolve(res));
  });
}

type ParamsType = {
  [key: string]: string | boolean | number;
}
function queryAppointmentInfo(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/queryAppointmentInfo', data).then(res => resolve(res));
  });
}

function queryPunishConf() {
  return new Promise(resolve => {
    $http.get('teaching/v1/queryPunishConf').then(res => resolve(res));
  });
}

function queryUserPenaltyRecord() {
  return new Promise(resolve => {
    $http.get('teaching/v1/queryUserPenaltyRecord').then(res => resolve(res));
  });
}

function queryAppointadvanceDays(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/queryAppointadvanceDays', data).then(res => resolve(res));
  });
}

// 保存学员当前的学习进度
let studentLearnInfoCody: any = {};
export default {
  setup() {
    setBanBanTitle('预约学车');
    const { proxy } = getCurrentInstance();
    const showCalendar = ref(false); // 控制日历展开
    const popupFlagA = ref(false); // 弹窗1
    const calendarList = ref([]); // 日历
    const loading = ref(true);
    // 控制日历展开和关闭
    const chooseCalendar = () => {
      showCalendar.value = !showCalendar.value;
    };

    // 选中的日期，默认是今天
    const currentDay = ref('');
    const currentMonthDay = computed(() => {
      const [year, month, day] = currentDay.value.split('-');
      return `${month}月${day}日`;
    });
    // 学员信息
    const studentLearnInfo = ref({});
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

    const status = ref(0);
    status.value = 0;
    const currentAppointBigin = ref('');
    // 查询预约信息
    const currentAppoint = ref({});

    // 接收日历传递过来的日历列表
    const getCalendar = async () => {
      const learnPhaseInfo: any = getGlobalData('learnPhase') || {};

      const data = {
        trainingPlaceId: currentVenue.value.venueId,
        learnPhase: learnPhaseInfo.learnPhase,
        projectLevel: learnPhaseInfo.projectLevel,
        appointDate: getQueryString('appointDate') || ''

      };
      const res = await queryAppointadvanceDays(data);
      const calendar: any = res || [];
      calendarList.value = [];
      calendar.forEach((item: any) => {
        const {
          year,
          month,
          day,
          weekday,
          yearMonthDay
        } = getYearMonthDay(new Date(item.appointDate));
        calendarList.value.push({
          year,
          month,
          day,
          weekday,
          yearMonthDay,
          isFull: (item.alreadyAppointNums === item.maxAlreadyAppointNums || item.surplusNum <= 0),
          isCan: item.maxAlreadyAppointNums > item.alreadyAppointNums
        });
      });
      if (calendarList.value[0]) {
        currentDay.value = calendarList.value[0].yearMonthDay;
      }
    };

    const chooseDate = async (item: DaysType = {}, key?: number) => {
      console.log(111);
      // 关闭弹窗日历
      showCalendar.value = false;
      const data = {
        appointDate: item.yearMonthDay || currentDay.value,
        learnPhase: studentLearnInfo.value.learnPhase,
        venueId: currentVenue.value.venueId,
        learnPlan: currentVenue.value.learnPlan,
        projectLevel: studentLearnInfo.value.projectLevel
      };
      console.log(2222, data);
      transitionFlag.value = false; // 入场动画
      setTimeout(() => {
        transitionFlag.value = true; // 入场动画
      }, 500);
      const res: any = await queryAppointmentInfo(data);
      // 如果当天已经预约结束，则去除当天，跳转到第二天
      if (!res || !res.outDtoList || res.outDtoList.length === 0) {
        todayNull.value = true;
        loading.value = false;
        if (calendarList.value[0]) chooseDate(calendarList.value[0]);
        return;
      }
      appointmentInfo.value = res.outDtoList;
      currentAppoint.value = res.currentAppointRecord || {};
      currentAppointBigin.value = res.beginAppointTime || '';
      // 选中的日期
      currentDay.value = item.yearMonthDay || currentDay.value;
      status.value = (res.currentAppointRecord && res.currentAppointRecord.appointStatus) || 0;
      loading.value = false;
      // 默认展开第一个
      if (!key) currentTime.value = appointmentInfo.value[0].timeRange;
      // 滚动到最上面
      const scrollEl = document.querySelector('#scrollEl');
      if (scrollEl && (scrollEl as Element).scrollTop) {
        (scrollEl as Element).scrollTop = 0;
      }
      for (let i = 0; i < calendarList.value.length; i += 1) {
        if (calendarList.value[i].yearMonthDay === currentDay.value) {
          const calendarScrollEl = document.querySelector('#calendarScrollEl');
          (calendarScrollEl as Element).scrollTo({ left: 56 * i, behavior: 'smooth' });
          return;
        }
      }
    };

    // 展开收起预约列表
    const toggleList = (item: DaysType = {}, index: number, $event: any) => {
      currentTime.value = currentTime.value === item.timeRange ? '' : item.timeRange;
      // 点击的时间段在最上面
      const scrollEl = document.querySelector('#scrollEl');
      (scrollEl as Element).scrollTo({ top: 68.5 * index, behavior: 'smooth' });
    };
    const config = ref({});
    const record = ref({});
    const getConfig = () => {
      queryPunishConf().then(res => {
        config.value = res;
      });
    };

    const getRecord = () => {
      queryUserPenaltyRecord().then((res: any) => {
        record.value = res;
        if (res && res.penaltyType) {
          proxy.$root.$router.replace({ path: '/my_looking' });
        }
      });
    };

    const getStudentLearnInfo = async () => {
      const res: any = await queryStudentLearnInfo();
      studentLearnInfo.value = res;
      const { learnPhase, projectLevel } = res;
      studentLearnInfoCody = {
        learnPhase,
        projectLevel
      };
      setGlobalData('learnPhase', studentLearnInfoCody);
      currentVenue.value = (res.venueList && res.venueList[0]) || {};
    };
    // 校验登录后查询学员场地信息
    verifyLogin().then(async () => {
      await getConfig();
      await getRecord();
      await getStudentLearnInfo();
      await getCalendar();
      setTimeout(() => {
        chooseDate(calendarList.value[0]);
        loading.value = false;
      }, 1);
    });

    const visibilitychange = () => {
      if (!document.hidden) {
        chooseDate();
        loading.value = false;
      }
    };
    document.addEventListener('visibilitychange', visibilitychange);
    onUnmounted(() => window.removeEventListener('visibilitychange', visibilitychange));

    // 提交预约信息
    const submit = async () => {
      const { learnPhase, defaultVenue, projectLevel } = studentLearnInfo.value;
      const learnPhaseInfo: any = getGlobalData('learnPhase');
      const data = {
        appointDate: currentDay.value,
        learnPhase: (learnPhaseInfo && learnPhaseInfo.learnPhase) || learnPhase,
        learnPlan: (currentVenue.value.learnPlan) || '',
        venueId: currentVenue.value.venueId,
        venueName: currentVenue.value.venueName,
        timeRange: currentTime.value,
        projectList: getGlobalData('learnList') || [],
        projectLevel: (learnPhaseInfo && learnPhaseInfo.projectLevel) || projectLevel,
      };
      console.log('submitdata', data);
      let success = false;
      try {
        await $http.post('teaching/v1/appointPractice', data);
        success = true;
      } catch (error) {
        console.log(error, 'error');
      }
      console.log(success, 'success');
      if (success) {
        getStudentLearnInfo();
        console.log(111111111);
        proxy.$root.$router.replace({
          path: '/appoint_success',
        });
      }
      popupFlagA.value = false; // 关闭弹窗
      chooseDate({}, 1); // 预约后重新获取一下数据
      loading.value = false;
    };

    // 跳转我的预约
    const toNext = (key: number) => {
      const { defaultVenue } = studentLearnInfo.value;
      if (key === 1) {
        const { learnPlan } = currentVenue.value;
        const { projectLevel, learnPhase } = studentLearnInfoCody;
        const path = '/learning_progress';
        proxy.$root.$router.push({
          path,
          query: {
            learnPlan,
            venueId: currentVenue.value.venueId,
            learnPhase,
            projectLevel,
            currentLearnPhase: studentLearnInfo.value.learnPhase, // 当前选择学习阶段
            learnStatus: studentLearnInfo.value.learnStatus,
            sort: studentLearnInfo.value.sort,
          }
        });
      }
      if (key === 2) proxy.$root.$router.push({ path: '/my_looking' });
    };

    const countCurrentAppoint = () => {
      popupFlagA.value = true;
    };

    const computNumber = (num = 0) => {
      if (num.toString().length > 4) {
        return num.toFixed(2);
      }
      return num;
    };

    const getPenaltyTime = () => {
      if (currentAppoint.value && currentAppoint.value.appointBeginDate && config.value.cancalUnpunished) {
        const penaltyValue = new Date((new Date(currentAppoint.value.appointBeginDate.toString().replace(/-/g, '/'))).valueOf() - (config.value.cancalUnpunished * 60 * 1000));
        const {
          month,
          day,
          hours,
          min,
        } = getYMDObj(penaltyValue);
        return `${month}月${day}日 ${hours}:${min}`;
      }
      return '-';
    };

    const isPenaltyTime = () => {
      if (currentAppoint.value && currentAppoint.value.appointBeginDate && config.value.cancalUnpunished) {
        const penaltyValue = new Date((new Date(currentAppoint.value.appointBeginDate.toString().replace(/-/g, '/'))).valueOf() - (config.value.cancalUnpunished * 60 * 1000));
        return (new Date(penaltyValue.toString().replace(/-/g, '/'))).valueOf() < (new Date()).valueOf();
      }
      return false;
    };

    return {
      toggleList,
      showCalendar,
      chooseCalendar,
      popupFlagA,
      studentLearnInfo,
      currentVenue,
      getCalendar,
      calendarList,
      chooseDate,
      currentDay,
      currentMonthDay,
      appointmentInfo,
      currentTime,
      submit,
      toNext,
      todayNull,
      transitionFlag,
      currentAppoint,
      countCurrentAppoint,
      config,
      computNumber,
      record,
      status,
      getPenaltyTime,
      isPenaltyTime,
      currentAppointBigin,
      loading
    };
  },
  components: {
    [Overlay.name]: Overlay,
    [Icon.name]: Icon,
    [NoticeBar.name]: NoticeBar,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell
  },
  async activated() {
    const { proxy } = getCurrentInstance();
    setBanBanTitle('预约学车');
    const learnPhaseInfo: any = getGlobalData('learnPhase');
    proxy.status = getQueryString('status') || 0;
    proxy.appointmentInfo = [];
    // 如果从学习计划页面选择过学习阶段 && 现在的学习阶段不是所选择的学习阶段
    // 则更改当前的学习阶段，并且请求新的预约列表
    if (proxy.currentVenue.venueId && learnPhaseInfo && learnPhaseInfo.learnPhase && proxy.studentLearnInfo.learnPhase !== learnPhaseInfo.learnPhase) {
      const {
        learnPhase,
        learnPhaseName,
        projectLevel,
        projectName
      } = learnPhaseInfo;
      proxy.studentLearnInfo.learnPhase = learnPhase;
      proxy.studentLearnInfo.learnPhaseName = learnPhaseName;
      proxy.studentLearnInfo.projectLevel = projectLevel;
      proxy.studentLearnInfo.projectName = projectName;
      await proxy.getCalendar();
      proxy.currentDay = (proxy.calendarList[0] && proxy.calendarList[0].yearMonthDay) || '';

      proxy.chooseDate();
    } else if (proxy.currentVenue.venueId) {
      await proxy.getCalendar();
      proxy.currentDay = (proxy.calendarList[0] && proxy.calendarList[0].yearMonthDay) || '';

      proxy.chooseDate();
    }
  }
};

</script>

<style lang="less" scoped>
.item_list{
  background: #fff;
  &::before {
    display: table;
    content: "";
  }
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
.coach_list{
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  &.mar_b{
    margin-bottom: 24px;
  }
  li{
    flex: 1;
    min-width: 40%;
    float: left;
    line-height: 76px;
    color: #666;
    font-size: 26px;
    padding: 0 0 0 24px;
    border-bottom: #E5E5E5 1px solid;
    &:nth-child(even) {
      padding: 0 24px 0 0;
      text-align: right;
    }
    .iconfont{
      font-size: 26px;
      margin-right: 8px;
      color: #3DB871;
    }
  }
  a{
    color: #666;
  }
}
.calendar_transverse{
  background: #fff;
  height: 122px;
  // overflow-x: scroll;
  overflow: scroll;
  display: flex;
  // width: calc(100% - 112px);
  border-bottom: solid 2px #e5e5e5;
  width: 100%;
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
      background: #F0FFF8;
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
      color: #3DB871;
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
  height: calc(100% - 353px);
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
    }
    > .active{
      background-image: linear-gradient(to bottom, #F0FFF8, #FFFFFF);
    }
    .car_status{
      display: inline-block;
      width: 104px;
      line-height: 32px;
      font-size: 22px;
      color: #FA6400;
      border: solid #FA6400 1px;
      text-align: center;
      border-radius: 8px;
      position: relative;
      top: -4px;
      &.status_full{
        color: #999;
        border: solid #999 1px;
      }
    }
    .icon{
      width: 14px;
      height: 14px;
      border: solid 1px #3DB871;
      border-radius: 50%;
      float: left;
      margin-left: 24px;
      margin-top: 48px;
      margin-right: 8px;
      div{
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin: 2px auto;
        background: #3DB871;
      }
      &.full{
        border: solid 1px #999;
        div{
          background: #999;
        }
      }
    }
    .right_text{
      float: right;
      font-size: 26px;
      color: #999;
      margin-right: 32px;
    }
    .car_list{
      height: 112px;
      border-bottom: solid 1px #e5e5e5;
      display: flex;
      align-items: center;
      position: relative;
      &:last-child{
        border: 0;
      }
      .iconfont_car{
        display: inline-block;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: red;
        margin-left: 48px;
        background: url('../../../assets/images/sprite.png') no-repeat;
        background-size: 750px auto;
        background-position: -168px -166px;
        &.active{
          background-position: -48px -166px;
        }
      }
      .btn{
        position: absolute;
        right: 32px;
        border-radius: 8px;
        font-size: 26px;
        height: 60px;
        line-height: 60px;
        width: 140px;
        text-align: center;
      }
      .btn1{
        background-image: linear-gradient(to right, #4CCB81, #3DB871);
        color: #fff;
      }
      .btn2{
        height: 56px;
        line-height: 56px;
        border: solid 1px #999;
        color: #999;
      }
      .split{
        width: 4px;
        height: 56px;
        background: #f1f1f1;
        margin: 0 16px 0 32px;
      }
      .header_img{
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-right: 16px;
      }
      .header_img_default{
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-right: 16px;
        display: inline-block;
        background: url('../../../assets/images/sprite.png') no-repeat;
        background-size: 560px auto;
        background-position: -20px -218px;
      }
      .user_name{
        color: #999;
        font-size: 26px;
        width: 30%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.pop{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 3;
}
.popup{
  position: fixed;
  top: 300px;
  left: 50%;
  margin-left: -300px;
  width: 600px;
  background: #fff;
  border-radius: 8px;
  padding-bottom: 40px;
  z-index: 4;
  overflow: hidden;
  .header{
    background-image: linear-gradient(to right, #84DF93, #3BCB93);
    height: 8px;
  }
  .revise_tit{
    padding: 60px 0 72px;
    line-height: 42px;
    text-align: center;
    color: #000;
    font-size: 42px;
    font-weight: 500;
    span{
      color: #52CD84;
      font-weight: 500;
    }
  }
  .revise_list{
    li{
      font-size: 32px;
      margin-bottom: 24px;
      line-height: 32px;
      padding-left: 40px;
      color: #999;
    }
    &.active {
      margin-top: 64px;
      li{
        color: #000;
      }
    }
  }
  .revise_btns{
    overflow: hidden;
    margin-top: 56px;
    padding: 0 40px;
    li{
      float: left;
      width: 240px;
      line-height: 80px;
      text-align: center;
      border: solid #e5e5e5 2px;
      color: #999;
      font-size: 36px;
      border-radius: 45px;
      &:last-child{
        background: #52CD84;
        color: #fff;
        border: none;
        float: right;
      }
    }
  }
  .tit{
    background-image: linear-gradient(to right, #84DF93, #3BCB93);
    line-height: 80px;
    text-align: center;
    color: #fff;
    font-size: 38px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  .msg_list{
    padding: 0 0 48px 40px;
    li{
      margin-top: 40px;
      line-height: 32px;
      color: #000;
      font-size: 32px;
    }
  }
  .btn{
    margin: 0 40px;
    text-align: center;
    font-size: 36px;
    line-height: 80px;
    border-radius: 45px;
    &.btn1{
      color: #fff;
      background: #52cd84;
      margin-bottom: 24px;
    }
    &.btn2{
      color: #999;
      border: solid 1px #E5E5E5;
    }
  }
  .warn{
    line-height: 320px;
    color: #000;
    font-size: 32px;
    text-align: center;
  }
  .warn1{
    width: 457px;
    padding: 0 0 40px 40px;
    line-height: 48px;
    color: #3DB871;
    font-size: 38px;
  }
  .close_btn{
    position: absolute;
    bottom: -172px;
    font-size: 104px;
    color: #fff;
    left: 50%;
    transform: translateX(-50%);
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
.currentAppoint_box{
  padding: 24px 24px 0;
  background: #fff;
  position: relative;
  .bg_box{
    position: absolute;
    background-image: linear-gradient(to bottom, #FFFFFF, #C1C1C1);
    left: 0;
    right: 0;
    height: 45px;
    bottom: 0;
    z-index: 0;
  }
  .currentAppoint{
    border-top-right-radius: 16px;
    border-top-left-radius: 16px;
    background-image: linear-gradient(to right, #FDAA06, #FF8E04);
    padding: 30px 32px 40px;
    position: relative;
    z-index: 1;
  }
  .date_status{
    line-height: 60px;
    font-size: 32px;
    color: #fff;
    margin-bottom: 24px;
    .cancel_btn{
      float: right;
      width: 160px;
      text-align: center;
      font-size: 26px;
      border: solid 1px #fff;
      border-radius: 8px;
    }
  }
  .time_range{
    line-height: 56px;
    font-size: 56px;
    color: #fff;
    position: relative;
    margin-bottom: 24px;
    .iconfont{
      font-size: 51px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    span{
      float: right;
    }
  }
  .phase_venue{
    line-height: 26px;
    font-size: 26px;
    color: #fff;
    .iconfont{
      font-size: 30px;
      margin-right: 10px;
      &.location{
        font-size: 34px;
        margin-right: 1px;
        position: relative;
        top: 4px;
      }
    }
    span{
      float: right;
    }
  }
}
.top_link{
  display: flex;
  position: fixed;
  line-height: 1rem;
  height: 1rem;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  color: #000;
  background: #fff;
  font-size: 30px;
  z-index: 10;
  .link_item{
    width: 33%;
    text-align: center;
  }
  .line{
    background: rgba(151, 151, 151, 0.1);
    width: 0.01rem;
    height: 0.7rem;
  }
  .top_icon{
    font-size: 30px;
    color: #53CB85;
    margin-right: 0.05rem;
  }
}
.divider_line{
  border-bottom: 0.2rem solid #f5f3f5;
  background: #f5f3f5;
}

.cancel_wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-direction: column;
}

.block {
  width: 75%;
  min-height: 120px;
  background-color: #fff;
  margin-bottom: 0.6rem;
  padding: 0.6rem 0.4rem;
  border-radius: 0.08rem;
  font-size: 26px;
  .btn{
    text-align: center;
    font-size: 36px;
    line-height: 80px;
    border-radius: 45px;
    &.btn2{
      color: #fff;
      background: #52cd84;
    }
    &.btn1{
      color: #999;
      border: solid 1px #E5E5E5;
      margin-bottom: 24px;
    }
  }
}
.text_sub{
  color: #666;
}
.text_main{
  color: #3DB871;
}
.text_normal{
  color: #000;
}

.cancel_msg_list{
  padding-bottom: 40px ;
  li{
    margin-top: 20px;
    line-height: 32px;
    color: #000;
    font-size: 32px;
  }
}
.notice_icon{
  width: 35px;
  height: 35px;
  margin: 0 auto;
  background: url('../../../assets/images/icon1.png') no-repeat;
  background-size: 750px auto;
  background-position: -435px -145px;
  align-self: flex-start;
  margin: 8px 8px 8px 0px;
}
.notice_text{
  font-size: 24px;
  color: #666;
}
.notice_main_text{
  color: #F96502;
  display: inline;
}
.line_notice{
  background: #F0FFF8;
  line-height: 0.7rem;
  height: 0.7rem;
  margin: 0.15rem 0;
  border-radius: 0.04rem;
  display: flex;
  align-items: center;
}
.line_icon{
  width: 35px;
  height: 35px;
  background: url('../../../assets/images/icon1.png') no-repeat;
  background-size: 750px auto;
  background-position: -490px -145px;
  margin: 0px 8px 0px 8px;
}
.cell_currentAppoint{
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28px;
}
.cell_icon{
  font-size: 28px;
  margin: 0px 5px;
}
.no_data_content{
  text-align: center;
  margin: 0.7rem;
  .no_data_img{
    width: 310px;
  }
  .no_data_main{
    color: #000000;
    font-size: 32px;
    line-height: 50px;
  }
  .no_data_line{
    height: 1px;
    background-color: #E5E5E5;
    margin: 0.72rem 0rem;
  }
  .no_data_sub{
    color: #666;
    font-size: 22px;
    line-height: 40px;
  }
}
</style>
