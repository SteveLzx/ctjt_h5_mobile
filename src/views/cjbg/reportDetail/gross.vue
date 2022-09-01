<template>
  <div>
    <div :class="isFail?'content':'content_fail'">
      <div class="content_top" v-if="isFail">
        <div class="gross_title">
          <img class="title_top" src="../../../assets/images/cjbg/gross_title_tp.svg" alt="">
          <span class="title_text">恭喜您成功进阶
            <div class="group_number">
              <div v-for="(item, index) in upgrade" :key="index">
                <transition name="number" appear>
                  <div v-if="index===upgrade.length-1" class="number_text">{{index + 1}}</div>
                </transition>
              </div>
            </div>

          级！</span>
          <img class="title_bottom" src="../../../assets/images/cjbg/gross_title_bt.svg" alt="">
        </div>
        <div class="staging">
          <div v-for="(item,index) in upgrade" :key="index">
            <transition name="listR" appear>
              <div v-if="index===upgrade.length-1" class="staging_line_one">
                <div class="staging_item">{{getDate(item)}}</div>
                <div class="staging_item">{{item.preLearnPhaseName}}进阶成功!</div>
              </div>
            </transition>
            <transition name="listL" appear>
              <div v-if="index===upgrade.length-1" class="staging_line_two">
                <div class="staging_item">{{item.newLearnPhaseName}}</div>
                <div class="staging_item">成功解锁</div>
              </div>
            </transition>
          </div>
        </div>
        <div :style="{'textAlign': 'center'}">
          <!-- <img :style="{'width': '5.5rem'}" src="../../../assets/images/cjbg/gross_progress.png" alt=""> -->
        </div>
      </div>
      <div class="content_fail_top" v-if="!isFail">
        <div class="fail_text">
          您的学习能力超过了{{progressNumber}}%学员，继续努力！
        </div>
      </div>
      <div class="content_bottom">
        <div class="time_box">
          <div class="sum_time" @click="changeShowTime">
            <span>总体练习时长: {{computedLogTime()}}</span>
            <img v-if="showTimeDetail" class="sum_time_icon" src="../../../assets/images/cjbg/btn_up.svg" alt="" srcset="">
            <img v-if="!showTimeDetail" class="sum_time_icon" src="../../../assets/images/cjbg/btn_down.svg" alt="" srcset="">
          </div>
          <div class="show_log">
            <transition name="fade">
              <div v-if="showTimeDetail">
                <div v-for="(item,index) in logListDate" :key="index" :style="{'padding': '0.05rem 0.3rem'}">
                  <div>上车时间：{{item.loginTime || '-'}}</div>
                  <div>下车时间：{{item.loginoutTime || '-'}}</div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <ul class="table" v-if="practiceInfo && practiceInfo.length>0">
          <li class="table_tr table_th">
            <div :style="{width: '35%'}">练习项目</div>
            <div :style="{width: '20%'}">练习次数</div>
            <div :style="{width: '20%'}">满分次数</div>
            <div :style="{width: '25%'}">进度</div>
          </li>
          <li class="table_tr" v-for="(item,index) in practiceInfo" :key="index">
            <div :style="{width: '35%'}">{{item.learnPhaseName}}</div>
            <div :style="{width: '20%'}">{{Number(item.notPassed) + Number(item.passed)}}</div>
            <div :style="{width: '20%'}">{{item.fullMarks}}</div>
            <div :style="{width: '25%'}">{{item.progress}}</div>
          </li>
        </ul>

      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import {
  verifyLogin, setBanBanTitle, banbanCall, getYMDObj, getQueryString
} from '@/assets/js/common';
import { queryLogList, queryPracticeInfo, queryUpgrade } from './api';

export default {
  setup() {
    setBanBanTitle('总体分析');
    const count = ref(0);
    const showTimeDetail = ref(false);
    const isFail = ref(true);
    const changeShowTime = () => {
      showTimeDetail.value = !showTimeDetail.value;
    };
    const upgrade = ref([]);
    const add = () => {
      console.log(111);
      upgrade.value.push(1);
    };

    const logListDate = ref([]);
    const practiceInfo = ref([]);
    const progressNumber = ref(0);
    const queryLogListApi = async () => {
      const query: any = {
        appointId: getQueryString('appointId'),
      };
      const res: any = await queryLogList(query);
      console.log(111, res);
      logListDate.value = res || [];
    };
    const queryPracticeInfoApi = async () => {
      const query: any = {
        appointId: getQueryString('appointId'),
      };
      const res: any = await queryPracticeInfo(query);
      console.log(111, res);
      practiceInfo.value = res || [];
    };

    const queryUpgradeApi = async () => {
      const query: any = {
        appointId: getQueryString('appointId'),
      };
      const res: any = await queryUpgrade(query);
      console.log(111, res);
      const { analysisUpgradeDetail = [], progress = 0 } = res || {};
      if (analysisUpgradeDetail.length > 0) {
        isFail.value = true;
        for (let i = 0; i < analysisUpgradeDetail.length; i += 1) {
          setTimeout(() => {
            upgrade.value.push(analysisUpgradeDetail[i]);
            count.value = (i + 1);
          }, 3500 * i);
        }
      } else {
        isFail.value = false;
        upgrade.value = analysisUpgradeDetail || [];
        count.value = 0;
      }
      progressNumber.value = progress;
    };

    const computedLogTime = () => {
      let time = 0;
      let str = '';
      logListDate.value.forEach((item: any) => {
        if (item && item.loginTime && item.loginoutTime) {
          const getBeginDate = new Date(item.loginTime.toString().replace(/-/g, '/'));
          const getEndDate = new Date(item.loginoutTime.toString().replace(/-/g, '/'));
          time = time + getEndDate.valueOf() - getBeginDate.valueOf();
        }
      });
      const getMinute = Math.floor(time / (1000 * 60));
      const getSeconds = (time / 1000) % 60;
      if (getMinute > 9) {
        str = `${getMinute}分`;
      } else if (getMinute > 0) {
        str = `0${getMinute}分`;
      }
      if (getSeconds > 9) {
        str = `${str}${getSeconds}秒`;
      } else if (getMinute === 0) {
        str = `${str}${getSeconds}秒`;
      } else {
        str = `${str}0${getSeconds}秒`;
      }
      return str;
    };

    // 处理预约时间字段
    const getDate = (item = {}) => {
      const { upgradeTime }: any = item;
      let str = '';
      const upgradeDate: any = getYMDObj(upgradeTime);
      str = `${upgradeDate.hours}:${upgradeDate.min}`;

      return str;
    };

    const init = () => {
      queryLogListApi();
      queryPracticeInfoApi();
      queryUpgradeApi();
    };
    init();
    return {
      count,
      showTimeDetail,
      changeShowTime,
      isFail,
      upgrade,
      add,
      logListDate,
      computedLogTime,
      practiceInfo,
      progressNumber,
      getDate
    };
  }
};

</script>

<style lang="less" scoped>
.content{
  background: #1661DE url('../../../assets/images/cjbg/gross_bg.png') no-repeat;
  background-size: contain;
  min-height: 100%;
}
.content_fail{
  background: #1661DE url('../../../assets/images/cjbg/gross_fail_bg.png') no-repeat;
  background-size: contain;
  min-height: 100%;
  .content_fail_top{
    height: 7rem;
    .fail_text{
      padding: 3.64rem 0rem 1rem;
      text-align: center;
      color: #fff;
      font-size: 32px;
    }

  }
}
.content_top{
  height: 7rem;
  .gross_title{
    padding-top: 1.3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title_top{
      width: 2rem;
    }
    .title_bottom{
      width: 5.2rem;
    }
    .title_text{
      line-height: 1rem;
      font-size: 46px;
      color: #fff;
      display: flex;

      .group_number{
        position: relative;
        min-width: 60px;
        .number_text{
          position: absolute;
          top: 0px;
          left: 0px;
          min-width: 60px;
          text-align: center;
        }
      }
    }
  }
  .staging{
    width: 80%;
    margin: 0 auto;
    margin: 0.2rem auto 0.2rem;
    color: #fff;
    line-height: 0.6rem;
    font-size: 28px;
    height: 1.4rem;
    .staging_line_one{
      display: flex;
      justify-content: flex-start;
      margin-bottom: 0.15rem;
    }
    .staging_line_two{
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0.15rem;
    }
    .staging_item{
      margin: 0 0.1rem;
      padding: 0 0.25rem;
      background: #1661DE url('../../../assets/images/cjbg/gross_btn.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
.content_bottom{
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: 50px;
  .sum_time{
    padding: 0 0.25rem;
    font-size: 26px;
    line-height: 0.48rem;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 4.3rem;
    background: #1661DE url('../../../assets/images/cjbg/gross_btn_white.png') no-repeat;
    background-size: 100% 100%;
    .sum_time_icon{
      width: 0.28rem;
      margin-left: 0.1rem;
    }
  }
  .table{
    width: calc(100% - 0.6rem);
    padding: 0rem 0.3rem 0.3rem;
    font-size: 24px;
    .table_tr{
      display: flex;
      line-height: 0.66rem;
      margin: 0.08rem 0rem;
      padding: 0rem 0.33rem;
      align-items: center;
      text-align: center;
      justify-content: space-around;
      color: #fff;
      &:nth-child(2n){
        border-radius: 0.33rem;
        background:  linear-gradient(to right, rgba(255,255,255,0.1),rgba(255,255,255,0.2));
      }
    }
    .table_th{
      color: #0AFFF5;
    }
  }
  .show_log{
    font-size: 24px;
    color: #fff;
    line-height: 36px;
    text-align: left;
  }
  .time_box{
    outline: 0.01rem solid #fff;
    margin-top: 0.5rem;
    text-align: center;
  }
}

.listR-enter-active{
  transition: all 1s ease 0.5s;
}
.listR-leave-active {
  transition: all 0.5s ease;
}
.listR-enter-from{
  opacity: 0;
  transform: translateX(-300px);
}
.listR-leave-to {
  opacity: 0;
  transform: translateY(-100px);
}
.listL-enter-active{
  transition: all 1s ease 1s;
}
.listL-leave-active {
  transition: all 0.5s ease;
}
.listL-enter-from {
  opacity: 0;
  transform: translateX(300px);
}
.listL-leave-to {
  opacity: 0;
  transform: translateY(-100px);
}
.fade-enter-active, .fade-leave-active {
  transition: all .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.number-enter-active{
  transition: all 1s ease 0.5s;
}
.number-leave-active {
  transition: all 0.5s ease;
}
.number-enter-from {
  opacity: 0;
  transform: translateY(100px);
}
.number-leave-to {
  opacity: 0;
  transform: translateY(-100px);
}
</style>
