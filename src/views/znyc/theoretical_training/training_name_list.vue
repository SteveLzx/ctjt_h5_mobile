<template >
<div class="content" v-if="authFlag">
  <van-dropdown-menu active-color="#00CA84">
    <van-dropdown-item v-model="sortParam" :options="option1" @change="query"/>
    <van-dropdown-item v-model="sortType" :options="option2" @change="query"/>
    <van-dropdown-item v-model="appointDate" :options="option3" @change="queryType" />
  </van-dropdown-menu>

  <ul class="table">
    <li>
      <ul class="table_tr table_th">
        <li class="table_td" :style="{width: '20%'}">姓名</li>
        <li class="table_td" :style="{width: '15%'}">等待值</li>
        <li class="table_td" :style="{width: '25%'}">模拟机总时长（小时）</li>
        <li class="table_td" :style="{width: '20%'}">通关时间</li>
        <li class="table_td" :style="{width: '20%'}">预约时间</li>
      </ul>
    </li>
    <li v-for="(item,index) in result" :key="index">
      <ul class="table_tr" :style="{background: item.isOwn === 1 ? '#F0FFF8': 'transparent'}">
        <li class="table_td bind_content" :style="{width: '20%'}">
          {{item.trueName}}
          <div class="bind_coach">{{item.bindCoachName&&item.bindCoachName.split('')[0]}}</div>
        </li>
        <li class="table_td" :style="{width: '15%'}">{{item.waitDays}}</li>
        <li class="table_td" :style="{width: '25%'}">{{item.totalTimes || '-'}}</li>
        <li class="table_td" :style="{width: '20%'}">{{item.passDate ? transDate(item.passDate) : '-'}}</li>
        <li class="table_td" :style="{width: '20%'}">{{item.appointDate ? transDate(item.appointDate) : '-'}}</li>
      </ul>
    </li>
  </ul>
</div>
<div class="auth_con" v-if="!authFlag">
  <img src="../../../assets/images/a_c_auth.png" alt="">
  <p>您没有提交申请的权限，请联系片区经理～</p>
</div>
</template>

<script lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  verifyLogin, setBanBanTitle, getYMDObj, getQueryString
} from '@/assets/js/common';
import { getToken } from '@/assets/js/token_cookie';
import {
  Button,
  Toast,
  Icon,
  DropdownMenu,
  DropdownItem
} from 'vant';
import { queryTheoryWeekAppointDate, queryTheoryStuAppointInfo, queryTheoryNoAppointInfo } from './api';

export default {
  setup() {
    setBanBanTitle('学员名单');
    const { proxy } = getCurrentInstance();

    const sortType = ref(1);
    const sortParam = ref(1);
    const appointDate = ref(0);

    const result = ref([]);
    const option1 = [
      { text: '等待值', value: 0 },
      { text: '通关时间', value: 1 },
      { text: '预约时间', value: 2 },
    ];
    const option2 = [
      { text: '正序', value: 0 },
      { text: '倒序', value: 1 },
    ];

    const option3 = ref([
      { text: '通关未预约', value: 0 },
      { text: '预约未开始', value: 1 },
    ]);

    const query = async () => {
      let res: any = [];
      if (appointDate.value) {
        res = await queryTheoryStuAppointInfo({
          sortParam: sortParam.value,
          sortType: sortType.value
        });
      } else {
        res = await queryTheoryNoAppointInfo({
          sortParam: sortParam.value,
          sortType: sortType.value
        });
      }
      result.value = res || [];
    };

    const queryType = (value: any) => {
      console.log(value);
      if (value === 1) {
        sortParam.value = 2;
      } else {
        sortParam.value = 1;
      }
      query();
    };

    const transDate = (str: any) => {
      const {
        month,
        day,
      } = getYMDObj(str);
      return `${month}月${day}日`;
    };
    // const queryOptions = async () => {
    //   const res: any = await queryTheoryWeekAppointDate();
    //   res.forEach((item: any) => {
    //     option3.value.push({ text: item, value: item });
    //   });
    // };
    // 登录后没有姓名则无权提交
    const authFlag = ref(true);
    // 校验登录后查询教练场地信息
    verifyLogin(1).then(async () => {
      if (!getToken('loginName')) { // 登录后没有姓名则无权限
        authFlag.value = false;
        return;
      }
      // queryOptions();
      query();
    });

    return {

      authFlag,
      sortType,
      sortParam,
      appointDate,
      option1,
      option2,
      option3,
      result,
      query,
      queryType,
      transDate
    };
  },
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem
  }
};

</script>

<style lang="less" scoped>
  .content{
    height: calc(100% - 0.24rem);
    background: #f3f4fb;
    padding: 0rem 0rem 0.24rem;
  }
  .table{
    margin-top: 20px;
    .table_tr{
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 20px 0px;
      text-align: center;
      border-bottom: 1px solid #E5E5E5;
      .table_td{

      }
    }
    .table_th{
      background: #26C589;
      color: #fff;
      font-size: 28px;
    }
  }
  .bind_content{
    position: relative;
    .bind_coach{
      position: absolute;
      right: -0px;
      top: -25px;
      font-size: 20px;
    }
  }
</style>
