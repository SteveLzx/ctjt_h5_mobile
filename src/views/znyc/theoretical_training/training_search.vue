<template >
<div class="content">
  <div v-if="result.length > 0">
    <div class="box" v-for="(item, index) in result" :key="index">
      <div class="top_list" @click="goToApply(item)">
        <div>类型{{index + 1}}</div>
        <div class="top_sub">理论课<van-icon class="ml_20" name="arrow" /></div>
      </div>
      <div class="middle_list">
        <i class="iconfont icon_style">&#xe73d;</i>
        <div class="ml_20">{{weekColumns[item.weekDate - 1]}}</div>
        <div class="ml_20">{{transTime(item.startTime)}}-{{transTime(item.endTime)}}</div>
      </div>
      <div class="middle_list">
        <div class="dot"></div>
        <div class="ml_20">{{item.isOccupy == 0 ? '不占用':'占用车辆'}}</div>
        <div class="ml_20" v-if="item.isOccupy != 0">{{transTime(item.startOccupyTime)}}-{{transTime(item.endOccupyTime)}}</div>
      </div>
      <div class="middle_list" v-if="item.isOccupy != 0">
        <i class="iconfont icon_style">&#xe728;</i>
        <div class="ml_20">C1占用</div>
        <div class="ml_20">{{item.c1Num}}辆</div>
      </div>
      <div class="middle_list" v-if="item.isOccupy != 0">
        <i class="iconfont icon_style">&#xe728;</i>
        <div class="ml_20">C2占用</div>
        <div class="ml_20">{{item.c2Num}}辆</div>
      </div>
      <div class="bottom_list">
        <van-button class="submit_btn" plain color="#26C589" @click="deleteApply(item)">删除</van-button>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="no_data">
      <div></div>
      <p>暂无数据~</p>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  verifyLogin, setBanBanTitle, getYMD, getQueryString
} from '@/assets/js/common';
import { getToken } from '@/assets/js/token_cookie';
import {
  Button,
  Toast,
  Icon
} from 'vant';
import { queryTheoryTimes, deleteTheoryTime } from './api';

export default {
  setup() {
    setBanBanTitle('理论课查询');
    const { proxy } = getCurrentInstance();
    const result = ref([]);
    const weekColumns = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日']);

    const goToApply = (item: any) => {
      proxy.$root.$router.push({
        path: '/coach/training_apply',
        query: {
          id: item.id
        }
      });
    };

    const query = async () => {
      const res: any = await queryTheoryTimes();
      result.value = res || [];
    };
    const deleteApply = async (item: any) => {
      await deleteTheoryTime(item);
      query();
      Toast({
        type: 'success',
        message: '删除成功',
      });
    };
    const transTime = (str: string) => {
      const strList = str.split(':');
      const [hour = '', min = ''] = strList;
      return `${hour}:${min}`;
    };
    // 校验登录后查询教练场地信息
    verifyLogin(1).then(async () => {
      query();
    });

    return {
      goToApply,
      result,
      weekColumns,
      transTime,
      deleteApply
    };
  },
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon,

  }
};

</script>

<style lang="less" scoped>
  .content{
    min-height: calc(100% - 0.48rem);
    background: #f3f4fb;
    padding: 0.24rem 0.36rem;
  }
  .box{
    padding: 0.2rem;
    border-radius: 0.08rem;
    background: #fff;
    margin-bottom: 0.2rem;
    .top_list{
      display: flex;
      justify-content: space-between;
      font-size: 32px;
      border-bottom: 1px solid #E5E5E5;
      height: 80px;
      line-height: 80px;
      .top_sub{
        color: #999999;
      }
    }
    .middle_list{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 32px;
      line-height: 60px;
      height: 60px;
      .ml_20{
        margin-left: 20px;
      }
    }
    .bottom_list{
      display: flex;
      justify-content: end;
      .submit_btn{
        text-align: right;
        width: 200px;
      }
    }
  }
  .icon_style{
    font-size: 28px;
    color: #999999;
  }
  .dot{
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background: #26C589;
    margin-left: 4px;
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
</style>
