<template>
<div style="overflow: hidden;height:100%">
  <div class="time_box" @click="showDateTime = true">
    {{currentDay}} {{currentTime}}
    <div class="select_icon">
      <i class="iconfont">&#xe64c;</i>
    </div>
  </div>
  <div class="tab_box">
    <ul class="tab_list">
      <li class="tab" @click="tabTaggle(6)" :class="{'active': tabFlag === 6}">C1学员<p>(已预约{{reserveInfoC1.alreadyAppointNums}}/{{reserveInfoC1.totalRealityAppointNums}}辆)</p></li>
      <li class="tab" @click="tabTaggle(7)" :class="{'active': tabFlag === 7}">C2学员<p>(已预约{{reserveInfoC2.alreadyAppointNums}}/{{reserveInfoC2.totalRealityAppointNums}}辆)</p></li>
    </ul>
  </div>
  <div style="height: calc(100% - 2.26rem);position: relative">
    <div class="data_box list1" :class="{'active': tabFlag === 6}">
      <ul class="table_header">
        <li>姓名</li>
        <li>本次预约</li>
        <li class="table_list"><p>实际学时</p>约考学时</li>
        <li>学习进度</li>
        <li>电话</li>
      </ul>
      <div v-if="reserveDetail.list6.length === 0" class="no_data">
        <div></div>
        <p>暂无数据~</p>
      </div>
      <div class="data_scroll_box" v-if="reserveDetail.list6.length > 0">
        <van-swipe-cell v-for="item in reserveDetail.list6" :key="item.userId" :class="{'mine_style': item.isBelongToCoach}">
          <ul class="table_body">
            <li class="old_box" @click="goToReport(item)">
              {{item.trueName}}
              <div class="old_style" v-if="item.getCar"></div>
              <div class="bind_coach">{{item.bindCoachName&&item.bindCoachName.split('')[0]}}</div>
            </li>
            <li @click="goToReport(item)">{{item.learnPhaseAliasName}}</li>
            <!-- 实际学时>=约考学时或者返回的status===1，则显示标识，
            reserveStatus == 1时直接显示已批复，其他显示可约考 -->
            <li @click="goToReport(item)" :class="{'table_list': Number(item.practiceTime) >= Number(item.examinareHours) || item.reserveStatus == 1 || item.subjectTwoStatus==1}">
              <p :style="{marginTop: Number(item.practiceTime) >= Number(item.examinareHours) || item.reserveStatus == 1 || item.subjectTwoStatus==1 ? '0.34rem 0 0.1rem' : 0}">
                {{item.practiceTime}}/{{item.examinareHours}}
              </p>
              <div class="status active" v-if="item.subjectTwoStatus==1">科二已毕业</div>
              <div class="status" :class="{'active': item.reserveStatus == 1}"
              v-else-if="Number(item.practiceTime) >= Number(item.examinareHours) || item.reserveStatus == 1">
                {{item.reserveStatus == 1 ? getYMD(1, item.examDateTimeStr) : '可约考'}}
              </div>
            </li>
            <li @click="goToReport(item)">{{item.projectAliasName}}</li>
            <li @click="callPhone(item.mobileNo)">
              <i class="iconfont mobile">&#xe65b;</i>
            </li>
          </ul>
          <template #right>
            <div class="del" @click.stop="coachCancelAppoint(item)">取消</div>
          </template>
        </van-swipe-cell>
      </div>
    </div>
    <div class="data_box list2" :class="{'active': tabFlag === 7}">
      <ul class="table_header">
        <li>姓名</li>
        <li>本次预约</li>
        <li class="table_list"><p>实际学时</p>约考学时</li>
        <li>学习进度</li>
        <li>电话</li>
      </ul>
      <div v-if="reserveDetail.list7.length === 0" class="no_data">
        <div></div>
        <p>暂无数据~</p>
      </div>
      <div class="data_scroll_box" v-if="reserveDetail.list7.length > 0">
        <van-swipe-cell v-for="item in reserveDetail.list7" :key="item.userId" :class="{'mine_style': item.isBelongToCoach}">
          <ul class="table_body">
            <li class="old_box" @click="goToReport(item)">
              {{item.trueName}}
              <div class="old_style" v-if="item.getCar"></div>
              <div class="bind_coach">{{item.bindCoachName&&item.bindCoachName.split('')[0]}}</div>
            </li>
            <li @click="goToReport(item)">{{item.learnPhaseAliasName}}</li>
            <!-- 实际学时>=约考学时或者返回的status===1，则显示标识，
            reserveStatus == 1时直接显示已批复，其他显示可约考 -->
            <li @click="goToReport(item)" :class="{'table_list': Number(item.practiceTime) >= Number(item.examinareHours) || item.reserveStatus == 1 || item.subjectTwoStatus==1}">
              <p :style="{marginTop: Number(item.practiceTime) >= Number(item.examinareHours) || item.reserveStatus == 1 || item.subjectTwoStatus==1 ? '0.34rem 0 0.1rem' : 0}">
                {{item.practiceTime}}/{{item.examinareHours}}
              </p>
              <div class="status active" v-if="item.subjectTwoStatus==1">科二已毕业</div>
              <div class="status" :class="{'active': item.reserveStatus == 1}"
              v-else-if="Number(item.practiceTime) >= Number(item.examinareHours) || item.reserveStatus == 1">
                {{item.reserveStatus == 1 ? getYMD(1, item.examDateTimeStr) : '可约考'}}
              </div>
            </li>
            <li @click="goToReport(item)">{{item.projectAliasName}}</li>
            <li @click="callPhone(item.mobileNo)">
              <i class="iconfont mobile">&#xe65b;</i>
            </li>
          </ul>
          <template #right>
            <div class="del" @click.stop="coachCancelAppoint(item)">取消</div>
          </template>
        </van-swipe-cell>
      </div>
    </div>
  </div>
  <transition name="fade">
    <div class="pop" v-if="showDateTime" @click="closeChooseDate"></div>
  </transition>
  <div class="date_box" :class="{'active': showDateTime}">
    <i class="iconfont icon_close" @click="closeChooseDate">&#xe64d;</i>
    <p class="tit">选择日期</p>
    <ul class="calendar_transverse" id="calendarScrollEl">
      <li :class="{'active': currentDayCache === item.yearMonthDay}"
        v-for="item in calendarList" :key="item.day" @click="chooseDate(item)">
        <p class="date">{{item.month > 9 ? item.month : '0' + item.month}}-{{item.day > 9 ? item.day : '0' + item.day}}</p>
        <p class="week">周{{['日', '一', '二', '三', '四', '五', '六'][item.weekday]}}</p>
        <span class="tag" v-if="item.isCan">(可约)</span>
        <div class="split" v-if="currentDayCache !== item.yearMonthDay"></div>
      </li>
    </ul>
    <transition name="fade">
      <ul class="choose_time_box" v-if="transitionFlag">
        <li v-for="item in appointmentInfo" :key="item.timeRange"
        @click="currentTimeCache = item.timeRange"
        :class="{'active': currentTimeCache === item.timeRange}">
          {{item.timeRange}}
        </li>
      </ul>
    </transition>
    <div class="btn" @click="chooseTime(tabFlag)">确认</div>
  </div>
</div>
</template>

<script lang="ts">
import { ref, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import { getYearMonthDay } from '@/assets/js/util';
import $http from '@/assets/js/request';
import { banbanCall, setBanBanTitle, getYMD } from '@/assets/js/common';
import {
  SwipeCell,
  Toast
} from 'vant';

type ParamsType = {
  [key: string]: string | boolean | number;
}
function queryReserveInfo(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/coach/queryReserveInfo', data).then(res => resolve(res));
  });
}

function queryReserveDetail(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/coach/queryReserveDetail', data).then(res => resolve(res));
  });
}

function queryReserveInfoBytimeRange(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/coach/queryReserveInfoBytimeRange', data).then(res => resolve(res));
  });
}

function coachCancelAppointFn(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/coach/coachCancelAppoint', data).then(res => resolve(res));
  });
}

export default {
  setup() {
    setBanBanTitle('练车信息');
    let { query } = useRoute();
    const currentDay = ref(query.date || getYearMonthDay(new Date()).yearMonthDay);
    const currentTime = ref(query.time);

    // 用于选择日期和时间段时不点击确认
    const currentDayCache = ref(query.date || getYearMonthDay(new Date()).yearMonthDay);
    const currentTimeCache = ref(query.time);
    let trainingPlaceId = query.trainingPlaceId as string || '';
    // 切换C1/C2
    const tabFlag = ref(Number(query.tabFlag));
    // 展开日期时间的筛选
    const showDateTime = ref(false);

    const dateList = sessionStorage.getItem('calendarList');
    const calendarList = ref(dateList ? JSON.parse(dateList) : []);

    // 时间段
    const appointmentInfo = ref([]);
    const { proxy } = getCurrentInstance();

    // 动画开关
    const transitionFlag = ref(false);
    const chooseDate = async (item?: any) => {
      if (item && item.yearMonthDay === currentDayCache.value) return;
      if (item && item.yearMonthDay && !item.isCan) return;
      if (item) currentDayCache.value = item.yearMonthDay;
      const data = {
        appointDate: currentDayCache.value,
        trainingPlaceId
      };
      transitionFlag.value = false; // 入场动画
      appointmentInfo.value = await queryReserveInfo(data);
      // 选择日期后默认第一个
      if (item) currentTimeCache.value = appointmentInfo.value[0].timeRange;
      setTimeout(() => {
        transitionFlag.value = true; // 入场动画
      }, 300);
    };

    const reserveDetail = ref({ list6: [], list7: [] });
    const reserveInfoC1 = ref({});
    const reserveInfoC2 = ref({});
    const chooseTime = async (driveType: number) => {
      const data = {
        appointDate: currentDayCache.value,
        trainingPlaceId,
        timeRange: currentTimeCache.value,
      };
      // 查询当前时间段下的预约情况
      const reserveInfo = await queryReserveInfoBytimeRange(data);
      (reserveInfo as any[]).forEach(info => {
        if (info.driveType === 6) {
          reserveInfoC1.value = info;
        }
        if (info.driveType === 7) {
          reserveInfoC2.value = info;
        }
      });
      // 查询详情
      const data1 = {
        ...data,
        driveType
      };
      reserveDetail.value[`list${driveType}`] = await queryReserveDetail(data1);
      // 点击确认后复制当前选择的日期和时间
      currentDay.value = currentDayCache.value;
      currentTime.value = currentTimeCache.value;
      showDateTime.value = false;
    };

    const init = () => {
      query = useRoute().query;
      currentDay.value = query.date || getYearMonthDay(new Date()).yearMonthDay;
      currentDayCache.value = query.date || getYearMonthDay(new Date()).yearMonthDay;
      currentTime.value = query.time;
      currentTimeCache.value = query.time;
      trainingPlaceId = query.trainingPlaceId as string || '';
      tabFlag.value = Number(query.tabFlag);
      showDateTime.value = false;
      appointmentInfo.value = [];
      transitionFlag.value = false;
      reserveDetail.value = { list6: [], list7: [] };
      reserveInfoC1.value = {};
      reserveInfoC2.value = {};
      chooseDate();
      chooseTime(tabFlag.value);
    };

    const tabTaggle = (key: number) => {
      chooseTime(key);
      tabFlag.value = key;
    };

    const closeChooseDate = () => {
      showDateTime.value = false;
      // 点击关闭未点击确认按钮，还原之前的选择
      currentDayCache.value = currentDay.value;
      currentTimeCache.value = currentTime.value;
    };

    // 拨打电话
    const callPhone = (mobile: string) => {
      banbanCall(mobile);
    };

    const coachCancelAppoint = async (item: any) => {
      const {
        appointDate,
        appointId,
        learnPhase,
        sign,
        timeRange
      } = item;
      const data = {
        appointDate,
        appointId,
        learnPhase,
        sign,
        timeRange,
        venueId: trainingPlaceId
      };
      await coachCancelAppointFn(data);
      Toast('取消成功');
      chooseTime(tabFlag.value);
    };

    const goToReport = (item: any) => {
      proxy.$root.$router.push({
        path: '/coach/reportDetail/general',
        query: {
          trainingPlaceId: item.trainingPlaceId,
          userId: item.userId,
        }
      });
    };

    return {
      tabFlag,
      calendarList,
      showDateTime,
      currentDay,
      currentDayCache,
      currentTime,
      currentTimeCache,
      appointmentInfo,
      chooseDate,
      transitionFlag,
      reserveDetail,
      chooseTime,
      closeChooseDate,
      tabTaggle,
      reserveInfoC1,
      reserveInfoC2,
      callPhone,
      coachCancelAppoint,
      goToReport,
      init,
      getYMD
    };
  },
  components: { [SwipeCell.name]: SwipeCell },
  activated() {
    if (sessionStorage.getItem('fromSubProgress')) {
      sessionStorage.removeItem('fromSubProgress');
      const { proxy } = getCurrentInstance();
      proxy.init();
    }
  }
};
</script>

<style lang="less" scoped>
.time_box{
  padding: 0 24px;
  line-height: 100px;
  color: #000;
  text-align: center;
  font-size: 36px;
  font-weight: 500;
  .select_icon{
    display: inline-block;
    width: 30px;
    height: 30px;
    background: #DEFFF0;
    border-radius: 50%;
    margin-left: 4px;
    text-align: center;
    line-height: 25px;
    position: relative;
    top: -4px;
    .iconfont{
      color: #3DB871;
      font-size: 18px;
    }
  }
}
.tab_box{
  background: #F5F3F5;
  padding-top: 12px;
  .tab_list{
    display: flex;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background: #fff;
    .tab{
      flex: 1;
      text-align: center;
      color: #000;
      font-size: 36px;
      line-height: 36px;
      padding: 20px 0 26px;
      font-weight: 500;
      p{
        margin-top: 8px;
        line-height: 24px;
        font-size: 24px;
        font-weight: 400;
      }
      &.active{
        color: #3DB871;
        position: relative;
        &::before{
          content: '';
          width: 72px;
          height: 8px;
          background: #3db871;
          position: absolute;
          bottom: 0;
          left: 50%;
          margin-left: -36px;
        }
      }
    }
  }
}
.table_header{
  display: flex;
  background: #F1F1F1;
  li{
    flex: 1;
    color: #666;
    font-size: 28px;
    height: 114px;
    align-items: center;
    display: flex;
    justify-content: center;
  }
  .table_list{
    display: inline-block;
    text-align: center;
    line-height: 28px;
    p{
      margin: 22px 0 20px;
    }
  }
}
.del{
    line-height: 140px;
    text-align: center;
    width: 140px;
    background: #FE8A01;
    color: #fff;
    font-weight: 500;
  }
.table_body{
  display: flex;
  li{
    min-width: 20%;
    flex: 1;
    color: #000;
    font-size: 28px;
    height: 140px;
    align-items: center;
    display: flex;
    justify-content: center;
    font-weight: 500;
    border-bottom: #E5E5E5 solid 1px;
  }
  .table_list{
    display: inline-block;
    text-align: center;
    line-height: 28px;
    p{
      margin: 34px 0 10px;
    }
    .status{
      width: 100px;
      line-height: 36px;
      background: #ffeee3;
      border-radius: 18px;
      font-size: 20px;
      color: #FA6400;
      margin: 0 auto;
      &.active{
        width: auto;
        background: #DEFFF0;
        color: #3DB871;
      }
    }
  }
  .mobile{
    font-size: 48px;
    color: #3db871;
  }
}
.data_box{
  height: 100%;
  width: 100%;
  transition: all 0.5s;
  position: absolute;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  &.list1{
    transform: translateX(-100%);
  }
  &.list2{
    transform: translateX(100%);
  }
  &.active{
    transform: translateX(0);
  }
}
.data_scroll_box{
  height: calc(100% - 1.14rem);
  overflow: scroll;
}
.pop{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.35);
  z-index: 1;
}
.date_box{
  position: fixed;
  left: 0;
  right: 0;
  background: #fff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding-top: 16px;
  bottom: -100%;
  z-index: 2;
  transition: all 0.3s;
  &.active{
    bottom: 0;
  }
  .icon_close{
    padding: 16px;
    font-size: 26px;
    color: #999;
  }
  .tit{
    padding: 35px 0 19px 22px;
    line-height: 50px;
    color: #000;
    font-size: 36px;
    font-weight: 500;
  }
  .btn{
    width: 100%;
    line-height: 98px;
    background-image: linear-gradient(to right, #4CCB81, #3DB871);
    color: #fff;
    text-align: center;
    font-size: 32px;
  }
}
.calendar_transverse{
  background: #fff;
  height: 122px;
  overflow: scroll;
  display: flex;
  border-bottom: solid 2px #e5e5e5;
  li{
    min-width: 112px;
    text-align: center;
    position: relative;
    padding: 19px 0 9px;
    color: #666;
    &.active{
      background: #3DB871;
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
  }
}
.choose_time_box{
  padding: 68px 24px 52px;
  max-height: 800px;
  overflow: scroll;
  li{
    width: 340px;
    line-height: 82px;
    float: left;
    text-align: center;
    color: #3db871;
    border: solid 1px #3db871;
    border-radius: 8px;
    margin-bottom: 16px;
    &:nth-child(even){
      float: right;
    }
    &.active{
      background: #3DB871;
      color: #fff;
    }
    &.disable{
      background: #F9F9F9;
      color: #CBCBCB;
      border: none;
    }
  }
}
.no_data{
  background: transparent;
  div{
    width: 272px;
    height: 262px;
    margin: 116px auto 0;
    background: url('../../../assets/images/sprite.png') no-repeat;
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
.mine_style{
  background: #F0FFF8;
}
.old_style{
  width: 70px;
  height: 70px;
  background: #FA6400;
  border-radius: 35px;
  position: absolute;
  left: -35px;
  bottom: -35px;
}
.old_box{
  position: relative;
  overflow: hidden;
}
.bind_coach{
  position: absolute;
  right: -0px;
  top: -0px;
  font-size: 20px;
}
</style>
