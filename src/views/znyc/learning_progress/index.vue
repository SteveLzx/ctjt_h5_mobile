// pages_znyc/learning_progress
<template>
  <div class="learning_progress">
    <div class="progress_box">
      <ul class="progress_list">
        <li class="progress" v-for="(item, index) in learnPlan" :key="index" :class="{'active': item.active}">
          <p @click="item.active = !item.active">
            <i class="icon_img" :class="`bg${item.projectLevel}`"></i>{{item.projectName}}
            <span class="status" v-if="item.learnStatus===2">
              已学习
              <i class="iconfont" v-if="!item.active">&#xe64c;</i>
              <i class="iconfont" v-if="item.active">&#xe64b;</i>
            </span>
            <span class="status status2" v-if="item.learnStatus===1">
              正在学习
              <i class="iconfont" v-if="!item.active">&#xe64c;</i>
              <i class="iconfont" v-if="item.active">&#xe64b;</i>
            </span>
            <span class="status status2" v-if="(item.isLock === 0 && learnStatus === 2)">
              可学习
              <i class="iconfont" v-if="!item.active">&#xe64c;</i>
              <i class="iconfont" v-if="item.active">&#xe64b;</i>
            </span>
            <span class="status status3" v-if="(item.learnStatus===0 && learnStatus !== 2) ||  (item.isLock === 1 && learnStatus === 2 && item.learnStatus===0)">未开始</span>
          </p>
          <div class="split"></div>
          <ul class="subject_box">
            <li class="subject" @click="changeLearnPhase(val, item, index)"
            :class="{
              'status1': val.learnStatus===2,
              'status2': val.learnStatus===1 || (learnStatus ==2 && item.isLock == 0 && item.learnPhaseDtoList[0].learnPhase == val.learnPhase),
              'status3': (
                learnStatus !=2 && val.learnStatus===0
              ) || (
                learnStatus ==2 && item.isLock == 1 && val.learnStatus===0
              ) || (
                learnStatus ==2 && item.isLock == 0 && item.learnPhaseDtoList[0].learnPhase != val.learnPhase
              )
            }"
            v-for="(val, index) in item.learnPhaseDtoList" :key="val.learnPhase">
              {{val.learnPhaseName}}
              <span class="current_choose active" v-if="(
                learnStatus !=2 && currentLearnPhase === val.learnPhase && currentLearnPhase !== learnPhase
              ) || (
                learnStatus ==2 && currentLearnPhase === val.learnPhase && val.learnStatus===2
              )">当前选择</span>
              <span class="current_choose" v-if="(learnStatus !=2 && learnPhase == val.learnPhase) || (learnStatus ==2 && item.isLock == 0 && index === 0)">推荐学习</span>
              <i class="iconfont locked" v-if="(
                learnStatus !=2 && val.learnStatus===0
              ) || (
                learnStatus ==2 && item.isLock == 1 && val.learnStatus===0
              ) || (
                learnStatus ==2 && item.isLock == 0 && val.learnStatus===0 && index > 0
              )">&#xe648;</i>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import $http from '@/assets/js/request';
import { verifyLogin, setBanBanTitle } from '@/assets/js/common';
import TopTip from '@/components/TopTip';
import { setGlobalData } from '@/assets/js/global_data';

type ParamsType = {
  [key: string]: string | boolean | number;
}
function queryLearnPlan(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/queryLearnPlan', data).then(res => resolve(res));
  });
}
export default {
  setup() {
    setBanBanTitle('学习计划');
    const { proxy } = getCurrentInstance();
    const route = useRoute();
    const { query } = route;
    const learnPlan = ref([]);
    const projectLevel = ref(Number(query.projectLevel));
    const learnPhase = ref(Number(query.learnPhase));
    const currentLearnPhase = ref(Number(query.currentLearnPhase));
    const sort = ref(Number(query.sort));
    const learnStatus = ref(Number(query.learnStatus));

    // 校验登录
    verifyLogin().then(() => {
      queryLearnPlan(query as ParamsType).then(res => {
        const arr: any[] = [];
        let hasActive = false;
        (res as any[]).forEach(item => {
          const itemCopy = item;
          // 自动打开正在学习的
          if (learnStatus.value !== 2 && itemCopy.projectLevel === projectLevel.value) itemCopy.active = true;
          // 大项进阶推荐学习的
          if (learnStatus.value === 2 && item.isLock === 0 && !hasActive) {
            itemCopy.active = true;
            hasActive = true;
          }
          // // 查找当前选择并展开
          // const length = itemCopy.learnPhaseDtoList && itemCopy.learnPhaseDtoList.length;
          // if (length > 0) {
          //   for (let i = 0; i < length; i += 1) {
          //     if (itemCopy.learnPhaseDtoList[i].learnPhase === currentLearnPhase.value) {
          //       itemCopy.active = true;
          //     }
          //   }
          // }
          // 屏蔽理论课培训和仿真模拟机
          if (itemCopy.projectLevel > 1) arr.push(itemCopy);
        });
        learnPlan.value = arr;
      });
    });

    // 更改学习阶段
    const changeLearnPhase = (val: any, item: any, index: any) => {
      if (
        (learnStatus.value !== 2 && val.learnStatus === 0) // 同一大项内，大于当前学习进度的不可选
        || (learnStatus.value === 2 && item.isLock === 1 && val.learnStatus === 0) // 学习完成，大项进阶时，大于下一项排序的锁定项不可选
        || (learnStatus.value === 2 && item.isLock === 0 && index > 0) // 学习完成，大项进阶时，大于下一项排序的锁定项不可选
      ) {
        TopTip('不可选择');
        return;
      }

      // 大项进阶时，选择非锁定项时，需要更改学习计划顺序
      if (learnStatus.value === 2 && item.isLock === 0 && val.learnStatus === 0 && index === 0) {
        let learnList = learnPlan.value.filter((plan: any) => (plan.isLock === 0 && item.sort !== plan.sort));
        learnList = [item, ...learnList];
        console.log(5555, learnList);
        setGlobalData('learnList', learnList);
      }

      const learnPhaseInfo = {
        ...val,
        projectLevel: item.projectLevel,
        projectName: item.projectName
      };
      setGlobalData('learnPhase', learnPhaseInfo);
      console.log('proxy.$root.$router', proxy.$root);
      proxy.$root.$router.back();
    };

    return {
      learnPlan,
      projectLevel,
      learnPhase,
      changeLearnPhase,
      currentLearnPhase,
      sort,
      learnStatus
    };
  }
};

</script>

<style lang="less" scoped>
.learning_progress{
  background: #F5F3F5;
  height: 100%;
  overflow: scroll;
  .progress_box{
    padding: 24px;
  }
  .progress_list{
    flex: 1;
  }
  .progress{
    padding: 0 32px 0 87px;
    background: #fff;
    border-radius: 8px;
    line-height: 110px;
    max-height: 110px;
    overflow: hidden;
    font-size: 34px;
    color: #000;
    font-weight: 500;
    position: relative;
    margin-bottom: 24px;
    border: solid 1px #e5e5e5;
    position: relative;
    transition: max-height 0.3s;
    position: relative;
    .split{
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
      height: 2px;
      background: #e5e5e5;
    }
    &.active{
      max-height: 1000px;
    }
    .status{
      float: right;
      font-size: 22px;
      color: #3db871;
      .iconfont{
        font-size: 26px;
      }
      &.active{
        color: #FE8A01;
      }
      &.status2{
        color: #FE8A01;
      }
      &.status3{
        color: #999;
      }
    }
    .time_line{
      position: absolute;
      height: 102%;
      width: 4px;
      background: #d8d8d8;
      top: 73px;
      left: -38px;
    }
    .icon_img{
      position: absolute;
      top: 30px;
      left: 24px;
      width: 46px;
      height: 46px;
      margin-right: 16px;
      background: url('../../../assets/images/sprite.png') no-repeat;
      background-size: 750px auto;
      &.bg0{
        background-position: -684px -54px;
      }
      &.bg1{
        background-position: -614px -54px;
      }
      &.bg2{
        background-position: -118px -54px;
      }
      &.bg3{
        background-position: -202px -54px;
      }
      &.bg4{
        background-position: -290px -54px;
      }
      &.bg5{
        background-position: -376px -54px;
      }
      &.bg6{
        background-position: -460px -54px;
      }
      &.bg7{
        background-position: -544px -54px;
      }
    }
    &.active{
      border-bottom: solid #E5E5E5 1px;
    }
    .subject_box{
      overflow: hidden;
      .subject{
        padding: 0 10px;
        width: 200px;
        font-size: 26px;
        border-radius: 8px;
        margin-right: 80px;
        margin-top: 32px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        &:last-child{
          margin-bottom: 32px;
        }
        &.status1{
          background: #DEFFF0;
          color: #3DB871;
        }
        &.status2{
          background: #FE8A01;
          color: #fff;
        }
        &.status3{
          background: #F1F1F1;
          color: #666;
        }
        .current_choose{
          line-height: 40px;
          width: 1.2rem;
          text-align: center;
          color: #FE8A01;
          font-size: 22px;
          position: absolute;
          right: -120px;
          top: 0;
          background: url('../../../assets/images/sprite.png') no-repeat;
          background-size: 750px auto;
          background-position: -150px -350px;
          &.active{
            color: #3DB871;
            background-position: -150px -293px;
          }
        }
        .locked{
          font-size: 0.22rem;
          position: absolute;
          right: -0.5rem;
        }
      }
    }
  }
}
</style>
