// pages_znyc/my_looking
<template>
  <div class="my_looking" v-if="!loading">
    <div class="top">
      <div class="header" ref="header">
        <div class="user">
          <div class="avatar"></div>
          <div class="looking_status">
            <p>{{record.userId && (record.userId.length>6 ?  record.userId : record.userId.split("").reverse().join('') )}}</p>
            <p class="desc" v-if="record.penaltyEndDate">不可预约</p>
            <p class="desc" v-else-if="appointRecord.currentAppoints && appointRecord.currentAppoints.length>0">已预约</p>
            <p class="desc" v-else>可预约</p>
            <p class="date" v-if="record.penaltyEndDate">截止到{{getYMD(1,record.penaltyEndDate)}}</p>
          </div>
        </div>

        <div class="reason" v-if="record.penaltyReason" @click="showReason">
          查看原因
          <van-icon name="arrow" />
        </div>
        <div class="reason" v-else @click="showRule">
          规则须知
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="list">
        <div class="list_item">
          <div class="item_value">{{ record.cancalCount || 0}}</div>
          <div class="item_label">累计取消</div>
        </div>
        <div class="line"></div>
        <div class="list_item">
          <div class="item_value">{{appointRecord.lateTimes || 0}}</div>
          <div class="item_label">迟到</div>
        </div>
        <div class="line"></div>
        <div class="list_item">
          <div class="item_value">{{ record.breakAppointCount || 0}}</div>
          <div class="item_label">爽约</div>
        </div>
      </div>
    </div>
    <van-cell-group :style="{marginTop: '0.2rem'}">
      <van-cell title="教学视频" is-link :title-style="{color: '#333'}" @click="goToVideoList">
        <template #icon>
          <div class="btn_icon btn_icon1"></div>
        </template>
      </van-cell>
      <van-cell title="成绩报告" is-link :title-style="{color: '#333'}" @click="goToReportList">
        <template #icon>
          <div class="btn_icon btn_icon2"></div>
        </template>
      </van-cell>
      <van-cell title="我的教练" is-link :title-style="{color: '#333'}" @click="goToCallList">
        <template #icon>
          <div class="btn_icon btn_icon3"></div>
        </template>
      </van-cell>
      <van-cell title="追加预约" v-if="!record.penaltyEndDate" is-link :title-style="{color: '#333'}" @click="goToAppointList">
        <template #icon>
          <div class="btn_icon btn_icon4"></div>
        </template>
      </van-cell>
      <!-- <van-cell title="单元格" is-link /> -->
    </van-cell-group>
    <ul class="tab_box" ref="tab">
      <li :class="{'active': tabFlag === '1'}" @click="tabFlag = '1'">
        当前预约
        <span class="split_right"></span>
        <span class="split_bottom"></span>
      </li>
      <li :class="{'active': tabFlag === '2'}" @click="tabFlag = '2'">
        历史记录查询
        <span class="split_bottom"></span>
      </li>
    </ul>
    <div class="looking_list_box">
      <ul :class="{'active': tabFlag === '1'}" v-show="tabFlag === '1'" class="list1">
        <li v-if="!(appointRecord.currentAppoints && appointRecord.currentAppoints.length>0)" class="no_data">
          <div></div>
          <p>暂无数据~</p>
        </li>
        <li v-for="(appoint, index) in appointRecord.currentAppoints" :key="index">
          <div class="list1_bg">
            <p class="time_status" :style="{
              background: returnAppoint(appoint.learnPhase).background,
              boxShadow: returnAppoint(appoint.learnPhase).boxShadow,
              }">
              <span>{{returnAppoint(appoint.learnPhase).title}}</span>
              <span class="status status1" :style="{background: returnAppoint(appoint.learnPhase).color}">{{filterStatus(appoint.appointStatus)}}</span>
            </p>
            <p class="time_status" :style="{color: '#000'}">
              {{appoint.showAppointDate}}
              {{appoint.timeRange}}
            </p>
            <div class="looking_msg"><i class="iconfont">&#xe649;</i>{{appoint.learnPhaseName}}</div>
            <div class="looking_msg">
              <i class="iconfont">&#xe645;</i>{{appoint.venueName}}
            </div>
            <div class="btn_group">
              <van-button round plain :color="returnAppoint(appoint.learnPhase).color" class="btn_text"
                @click="cancelAppointPopup(appoint)" v-if="!isOvertime(appoint) && appoint.appointStatus == 1">取消预约</van-button>
              <van-button round :color="returnAppoint(appoint.learnPhase).color" class="btn_text" :style="{marginLeft: '0.32rem'}"
                @click="goToAppoint(appoint)" v-if="!isOvertime(appoint) && appoint.appointStatus == 1 && appoint.learnPhase!==1">修改预约</van-button>
            </div>
          </div>
        </li>
      </ul>
      <ul :class="{'active': tabFlag === '2'}" v-show="tabFlag === '2'" class="list2">
        <li v-if="!appointRecord.historyAppointList || appointRecord.historyAppointList.length === 0" class="no_data">
          <div></div>
          <p>暂无数据~</p>
        </li>
        <li v-for="(item, index) in appointRecord.historyAppointList" :key="index">
          <p class="time_status">{{item.showAppointDate}} {{item.timeRange}}
            <span class="status" :class="{'status1': item.appointStatus === 3, 'status2': item.appointStatus === 4 || item.appointStatus === 5 || item.appointStatus === 2}">
              {{filterStatus(item.appointStatus)}}
            </span>
          </p>
          <ul class="icon_list"><li v-for="item in 30" :key="item"></li></ul>
          <div class="looking_msg"><i class="iconfont">&#xe649;</i>{{item.learnPhaseName}}</div>
          <div class="looking_msg"><i class="iconfont">&#xe645;</i>{{item.venueName}}</div>
          <div class="round_bg left"></div>
          <div class="round_bg right"></div>
        </li>
      </ul>
    </div>
  </div>
  <van-overlay :show="ruleVisible">
    <div class="wrapper" @click.stop>
      <div class="block">
        <div class="text_sub">车、场地、教练等学车资源都是有限的。</div>
        <div class="text_sub">部分学员频繁取消预约或者爽约，会导致资源空置，影响其他学员约到想要的时段。</div>
        <div class="text_sub">因此必须对规则进行管控。望广大学员理解。</div>
        <div class="text_normal" :style="{marginTop: '0.4rem'}">规则如下:</div>
        <div class="text_normal">1、预约成功，请尽量准时到达！</div>
        <div class="text_normal">
          2、如果您临时有急事，
          <span class="text_main">请提前{{computNumber(config.cancalUnpunished/60)}}个小时取消预约</span>
          ，大家会理解你的！<span class="text_main">（不惩罚）</span>请提前{{computNumber(config.cancalUnpunished/60)}}个小时取消，可以预留给其他学员规划行程，赶到训练场。
        </div>
        <div class="text_normal">
          3、取消{{computNumber(config.cancalUnpunished/60)}}个小时以内的预约，我们会在“小本本”上记录您浪费练车资源的行为，
          <span class="text_main">累计{{config.cancalCount}}次浪费练车资源</span>
          ，您将受到{{computNumber(config.cancalNoReservation/(60*24))}}天不可约车的
          <span class="text_main">惩罚</span>。
        </div>
        <div class="text_normal">
          4、
          <span class="text_main">爽约</span>
          是最不可取的行为，不仅浪费练车资源，还让教练及同学们担心您的安全。出现爽约行为，您将受到{{computNumber(config.breakAppointNoReservation/(60*24))}}天内不可约车的
          <span class="text_main">惩罚</span>。
        </div>
      </div>
      <van-icon @click="closeRule" color="#fff" size="30" name="close" />
    </div>
  </van-overlay>
  <van-overlay :show="popupFlag">
    <div class="wrapper" @click.stop>
      <div class="block">
        <ul class="msg_list">
          <li>时间: {{selectedAppoint&&selectedAppoint.showAppointDate + ' ' + selectedAppoint&&selectedAppoint.timeRange}}</li>
          <li>项目: {{selectedAppoint&&selectedAppoint.learnPhaseName}}</li>
          <li>场地: {{selectedAppoint&&selectedAppoint.venueName}}</li>
        </ul>
        <div :style="{fontSize: '0.32rem',marginBottom: '0.4rem'}">
          <div class="text_main" :style="{marginBottom: '0.1rem'}">您已取消{{record.cancalCount || 0}}次</div>
          <div class="text_main">取消{{config.cancalCount}}次，禁止约车{{computNumber(config.cancalNoReservation/(60*24))}}天</div>
        </div>
        <div class="btn btn1" @click="cancelAppoint">确认</div>
        <div class="btn btn2" @click="popupFlag = false" style="border: 1px solid #E5E5E5">取消</div>
      </div>
    </div>
  </van-overlay>
  <van-overlay :show="reasonVisible">
    <div class="wrapper" @click.stop>
      <div class="block">
        <div v-if="record.penaltyType==1">
          <div class="text_default" :style="{fontSize: '0.32rem', marginBottom: '0.4rem'}">
            您累计取消预约{{config.cancalCount}}次
            <div class="text_main">达到次数上限，{{computNumber(config.cancalNoReservation/(60*24))}}天内不可预约。</div>
          </div>
          <div :style="{fontSize: '0.32rem',marginBottom: '0.4rem'}">
            <div class="text_sub">温馨提示：</div>
            <div class="text_sub">1、频繁取消预约行为会导致练车资源浪费。</div>
            <div class="text_sub">2、为了保障其他学员享有公平练车的权利，请珍惜预约机会。</div>
          </div>
        </div>
        <div v-if="record.penaltyType==2">
          <div class="text_default" :style="{fontSize: '0.32rem', marginBottom: '0.4rem'}">
            您于{{getYMD(1, record.lastAppointTime)}}爽约
            <div class="text_main">{{computNumber(config.breakAppointNoReservation/(60*24))}}天内不可预约。</div>
          </div>
          <div :style="{fontSize: '0.32rem',marginBottom: '0.4rem'}">
            <div class="text_sub">温馨提示：</div>
            <div class="text_sub">1、如您无法按时练车，建议您及时取消预约。</div>
            <div class="text_sub">2、爽约是对练车资源极大的浪费，为了保障其他学员享受公平练车的权利，请珍惜预约机会。</div>
          </div>
        </div>
      </div>
      <van-icon @click="closeReason" color="#fff" size="30" name="close" />
    </div>
  </van-overlay>
  <div class="my_looking loading" v-if="loading">
    <van-loading class="loading_icon" type="spinner" text-color="#999" color="#999" size="32" vertical>加载中...</van-loading>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue';
import {
  verifyLogin, setBanBanTitle, getYMD, getQueryString
} from '@/assets/js/common';
import $http from '@/assets/js/request';
import TopTip from '@/components/TopTip';
import {
  Icon, Overlay, Loading, Cell, CellGroup, Button
} from 'vant';

function queryAppointRecord() {
  return new Promise(resolve => {
    $http.post('teaching/v1/queryAppointRecord').then(res => resolve(res));
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

export default {
  setup() {
    setBanBanTitle('预约学车记录');
    const { proxy } = getCurrentInstance();

    // 切换tab

    // 动态计算列表可滚动区域
    const header = ref(null);
    const tab = ref(null);
    const listHeight = ref(0);

    // 弹窗控制
    const popupFlag = ref(false);

    const ruleVisible = ref(false);
    const reasonVisible = ref(false);

    const isReplace = ref(getQueryString('isReplace') || '1');
    const tabFlag = ref(getQueryString('tabFlag') || '1');
    const loading = ref(true);

    // 查询预约信息
    const appointRecord = ref({});
    const config = ref({});
    const record = ref({});
    const selectedAppoint = ref({});

    // 查看原因
    const showReason = () => {
      reasonVisible.value = true;
    };

    const filterStatus = (status = 1): string => {
      if (status === 1) return '已预约';
      if (status === 2) return '已取消';
      if (status === 3) return '已守约';
      if (status === 4) return '迟到';
      if (status === 5) return '爽约';
      return '';
    };

    const showRule = () => {
      console.log(11111);
      ruleVisible.value = true;
    };

    const closeRule = () => {
      ruleVisible.value = false;
    };
    const closeReason = () => {
      reasonVisible.value = false;
    };
    const computNumber = (num = 0) => {
      if (num.toString().length > 4) {
        return num.toFixed(2);
      }
      return num;
    };

    const goToCallList = () => {
      const { trainingPlaceId = '', venueName = '' } = record.value;
      proxy.$root.$router.push({
        path: '/student/callList',
        query: {
          venueId: trainingPlaceId,
          venueName: '康达尔训练场'
        }
      });
    };

    const goToReportList = () => {
      proxy.$root.$router.push({
        path: '/reportList',
      });
    };

    const goToAppoint = (appoint: any) => {
      if (appoint.learnPhase === 0) {
        proxy.$root.$router.push({
          path: '/appointSimulator',
          query: {
            appointDate: appoint.appointDate
          }
        });
      } else if (appoint.learnPhase === 1) {
        proxy.$root.$router.push({
          path: '/training_appoint',
          query: {
            appointDate: appoint.appointDate
          }
        });
      } else {
        proxy.$root.$router.push({
          path: '/appoint_car',
          query: {
            appointDate: appoint.appointDate
          }
        });
      }
    };

    const goToVideoList = () => {
      console.log(111333);
      proxy.$root.$router.push({
        path: '/student/videoList',
      });
    };

    const isOvertime = (appoint: any) => {
      if (appoint.appointBeginDate) {
        console.log('isOvertime', new Date(appoint.appointBeginDate) < new Date());
        return (new Date(appoint.appointBeginDate.toString().replace(/-/g, '/'))).valueOf() < (new Date()).valueOf();
      }
      return false;
    };

    const cancelAppointPopup = (appoint: any) => {
      console.log('appoint', appoint);
      selectedAppoint.value = appoint;
      popupFlag.value = true;
    };

    const goToAppointSimulator = () => {
      proxy.$root.$router.push({
        path: '/appointSimulator',
      });
    };

    const goToAppointList = () => {
      proxy.$root.$router.replace({
        path: '/appointList',
      });
    };
    const getRecord = () => {
      queryAppointRecord().then(async (res: any) => {
        appointRecord.value = res;
        record.value = await queryUserPenaltyRecord();
        if (!(res.currentAppoints && res.currentAppoints.length > 0) && isReplace.value === '1' && !record.value.penaltyReason && res.analogAppointSwitch) {
          proxy.$root.$router.replace({
            path: '/appointList',
          });
        }
        if (!(res.currentAppoints && res.currentAppoints.length > 0) && isReplace.value === '1' && !record.value.penaltyReason && !res.analogAppointSwitch) {
          proxy.$root.$router.replace({
            path: '/appoint_car',
            query: {
              status: 0
            }
          });
        }
        // 解决跳转页面时出现的短暂停留
        setTimeout(() => {
          loading.value = false;
        }, 100);
      });
    };

    const getConfig = () => {
      queryPunishConf().then(res => {
        config.value = res;
      });
    };

    // 取消预约
    const cancelAppoint = () => {
      let url = '';
      if (selectedAppoint.value.learnPhase > 1) {
        url = 'teaching/v1/cancelAppoint';
      } else if (selectedAppoint.value.learnPhase === 1) {
        url = 'teaching/theory/cancelTheoryAppoint';
      } else {
        url = 'teaching/v1/analogCancelAppoint';
      }
      $http.post(url, { ...selectedAppoint.value }).then(() => {
        TopTip('取消成功');
        popupFlag.value = false;
        getRecord();
      });
    };

    const returnAppoint = (learnPhase: any): any => {
      if (learnPhase === 0) {
        return {
          background: 'linear-gradient(to top, #09A1F6, #357EF9)',
          boxShadow: '0px 4px 8px 2px rgba(53, 126, 249, 0.3)',
          color: '#357EF9',
          title: '模拟机预约'

        };
      }
      if (learnPhase === 1) {
        return {
          background: 'linear-gradient(to top, #FFB660, #FFA031)',
          boxShadow: '0px 4px 8px 2px rgba(255, 182, 96, 0.3)',
          color: '#FE8A01',
          title: '理论课预约'

        };
      }
      return {
        background: 'linear-gradient(to top, #65E49A, #46C77D)',
        boxShadow: '0px 4px 8px 2px rgba(61, 184, 113, 0.3)',
        color: '#3DB871',
        title: '实车预约'
      };
    };
    // const getUserRecord = () => {
    //   queryUserPenaltyRecord().then((res: any) => {
    //     record.value = res;
    //   });
    // };
    // 校验登录
    verifyLogin().then(async () => {
      getRecord();
      getConfig();
      // getUserRecord();
    });

    return {
      tabFlag,
      header,
      tab,
      listHeight,
      popupFlag,
      appointRecord,
      showReason,
      cancelAppoint,
      filterStatus,
      showRule,
      ruleVisible,
      closeRule,
      reasonVisible,
      closeReason,
      config,
      computNumber,
      getYMD,
      record,
      goToCallList,
      goToReportList,
      goToAppoint,
      isOvertime,
      goToVideoList,
      loading,
      cancelAppointPopup,
      selectedAppoint,
      goToAppointSimulator,
      goToAppointList,
      returnAppoint
    };
  },
  components: {
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button
  }
};

</script>

<style lang="less" scoped>
.my_looking{
  min-height: 100%;
  background: #F4F4F4;
  overflow-x: hidden;
  .top{
    background: #fff;
    .header{
      padding: 32px 0 32px 24px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .user{
        display: flex;
        align-items: center;
        .avatar{
          float: left;
          width: 110px;
          height: 110px;
          border-radius: 50%;
          margin-right: 32px;
          background: url('../../../assets/images/sprite.png') no-repeat;
          background-size: 750px auto;
          background-position: -24px -286px;
        }
        .looking_status{
          float: left;
        }
        .desc{
          line-height: 50px;
          font-size: 36px;
          color: #000;
          font-weight: 500;
          padding-top: 10px;
        }
        .date{
          margin-top: 8px;
          font-size: 26px;
          color: #666;
        }
      }

      .reason{
        float: right;
        text-align: center;
        line-height: 40px;
        height: 40px;
        background: #fe8a01;
        color: #fff;
        font-size: 24px;
        border-top-left-radius: 18px;
        border-bottom-left-radius: 18px;
        margin-top: 19px;
        padding-left: 20px;
      }
    }
    .list{
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding:0 0.24rem 0.24rem;
      .list_item{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 33%;
        .item_label{
          color: #999;
          font-size: 26px;
        }
        .item_value{
          color: #000;
          font-size: 32px;
          font-weight: bold;
        }
      }
      .line{
        width: 0.01rem;
        height: 0.7rem;
        background: rgba(151, 151, 151, 0.1);
      }
    }
  }

}
.tab_box{
  display: flex;
  background: #fff;
  margin-top: 0.2rem;
  li{
    flex: 1;
    font-size: 32px;
    text-align: center;
    line-height: 106px;
    color: #666;
    position: relative;
    .split_right{
      width: 1px;
      height: 36px;
      position: absolute;
      right: 0;
      top: 50%;
      margin-top: -18px;
      background: #999;
    }
    &.active{
      color: #3DB871;
      .split_bottom{
      width: 36px;
      height: 4px;
      background: #3DB871;
      position: absolute;
      left: 50%;
      margin-left: -18px;
      top: 81px;
    }
    }
  }
}
.looking_list_box{
  position: relative;
  > ul{
    margin-top: 20px;
    padding: 0 24px;
    transition: all 0.5s;
    position: absolute;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    width: calc(100% - 48px);
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
  > ul.list1 > li{
    border-radius: 8px;
    padding-bottom: 24px;
    position: relative;
    margin-bottom: 32px;
  }
  > ul.list2 > li{
    background: #fff;
    border-radius: 8px;
    padding-bottom: 24px;
    position: relative;
    margin-bottom: 32px;
  }
  .list1_bg{
    background: #fff;
    padding-bottom: 0.24rem;
    position: relative;
    margin-bottom: 0.32rem;
    border-radius: 8px;
    overflow: hidden;
    .list1_bg_icon{
      position: absolute;
      bottom: 12px;
      right: 0px;
      color: #4CCB81;
      font-size: 100px;
    }
    .btn_group{
      text-align: right;
      margin: 0 0.24rem;
      .btn_text{
        width: 2.1rem;
        height: 70px;
      }
    }
  }
  .list1_btn{
      display: flex;
      flex-wrap: wrap;
      .btn_content{
        width: 25%;
        margin-bottom: 24px;
        .btn_icon{
          width: 60px;
          height: 54px;
          margin: 0 auto;
          background: url('../../../assets/images/icon1.png') no-repeat;
          background-size: 750px auto;
        }
        .btn_text{
          text-align: center;
          margin: 12px 0px 24px;
          font-size: 26px;
        }
        .btn_icon1{
          background-position: -68px -48px;
        }
        .btn_icon2{
          background-position: -255px -48px;
        }
        .btn_icon3{
          background-position: -440px -48px;
        }
        .btn_icon4{
          background-position: -630px -48px;
        }
        .btn_icon5{
          background-position: -68px -145px;
        }
        .btn_icon6{
          background-position: -255px -145px;
        }
        .btn_icon7{
          background-position: -210px -235px;
        }
        .btn_icon8{
          background-position: -300px -235px;
        }
      }
    }
  > ul > li.no_data{
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
  .round_bg{
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #f4f4f4;
    position: absolute;
    top: 76px;
    &.left{
      left: -12px;
    }
    &.right{
      right: -12px;
    }
  }
  .list2 .time_status{
    font-size: 32px;
    color: #333;
    line-height: 32px;
    padding: 24px 32px;
    .status{
      float: right;
      &.status1{
        color: #3DB871;
      }
      &.status2{
        color: #FA6400;
      }
    }
  }
  .list1 .time_status{
    font-size: 32px;
    color: #fff;
    line-height: 32px;
    padding: 40px 0px 40px 24px;
    .status{
      float: right;
      color: #fff;
      padding: 4px 24px 4px 50px;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;

      &.status1{
        background: #3DB871;
      }
      &.status2{
        background: #FA6400;
      }
    }
  }
  .icon_list{
    height: 16px;
    overflow: hidden;
    margin-bottom: 24px;
    li{
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #E5FAE7;
      float: left;
      margin-right: 15px;
      &:first-child{
        margin-left: 32px;
      }
    }
  }
  .list2 .looking_msg{
    font-size: 26px;
    color: #666;
    line-height: 36px;
    margin-bottom: 16px;
    padding-left: 32px;
    .iconfont{
      color: #3DB871;
      font-size: 36px;
      margin-right: 20px;
      position: relative;
      top: 4px;
    }

  }

  .list1 .looking_msg{
    font-size: 26px;
    color: #000;
    line-height: 36px;
    margin-bottom: 16px;
    padding-left: 32px;
    .iconfont{
      color: #000;
      font-size: 36px;
      margin-right: 20px;
      position: relative;
      top: 4px;
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
}

.msg_list{
  padding-bottom: 40px ;
  li{
    margin-top: 20px;
    line-height: 32px;
    color: #000;
    font-size: 32px;
  }
}
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
.warn{
  width: 457px;
  padding: 0 0 40px 40px;
  line-height: 48px;
  color: #3DB871;
  font-size: 38px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.wrapper {
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
.loading{
  display: flex;
  align-items:center;
  justify-content: space-around;
  .loading_icon{
    display: flex;
    align-items:center;
    justify-content: center;
  }
}
.video_icon{
  width: 40px;
  height: 40px;
  margin: 0 auto;
  background: url('../../../assets/images/icon1.png') no-repeat;
  background-size: 500px auto;
  background-position: -45px -28px;
  margin-right: 0.16rem;
}
.btn_icon{
  width: 40px;
  height: 40px;
  margin: 0 auto;
  background: url('../../../assets/images/icon1.png') no-repeat;
  background-size: 500px auto;
  margin-right: 0.16rem;
}

.btn_icon1{
  background-position: -45px -28px;
}
.btn_icon2{
  background-position: -170px -28px;
}
.btn_icon3{
  background-position: -294px -28px;
}
.btn_icon4{
  background-position: -420px -28px;
}
.btn_icon5{
  background-position: -45px -97px;
}
.btn_icon6{
  background-position: -170px -97px;
}
.btn_icon7{
  background-position: -140px -157px;
}
.btn_icon8{
  background-position: -200px -157px;
}
</style>
