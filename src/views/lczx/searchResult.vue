<template>
  <div class="content">
    <div class="cell_content">
      <van-cell-group class="cell_group" inset>
        <van-cell >
          <template #value>
            <div>
              {{name}}
            </div>
            <div>
              身份证号：{{number}}
            </div>

            <div class="mian_title first_main" v-if="step ==2">
              <span>科二已审核学时</span>
              <van-tag color="#FFEBEC" text-color="#FE6271" v-if="Number(value1*60) + Number(value2) >= time1">已刷满</van-tag>
            </div>

            <div class="time_result" v-if="step ==2">
              <van-search v-model="value1" show-action left-icon="" input-align="center" :clearable="false" :formatter="formatter"  @focus="value1=''" >
                <template #action>
                  <div>时</div>
                </template>
              </van-search>
              <van-search v-model="value2" show-action left-icon="" input-align="center" :clearable="false" :formatter="formatter" @focus="value2=''">
                <template #action>
                  <div>分</div>
                </template>
              </van-search>
            </div>

            <div class="mian_title ">
              <span>科三已审核学时</span>
              <van-tag color="#FFEBEC" text-color="#FE6271" v-if="Number(value3*60) + Number(value4) >= time2">已刷满</van-tag>
            </div>

            <div class="time_result">
              <van-search v-model="value3" show-action left-icon="" input-align="center" :clearable="false" :formatter="formatter" @focus="value3=''" >
                <template #action>
                  <div>时</div>
                </template>
              </van-search>
              <van-search v-model="value4" show-action left-icon="" input-align="center" :clearable="false" :formatter="formatter" @focus="value4=''">
                <template #action>
                  <div>分</div>
                </template>
              </van-search>
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <div class="fixed_bottom" :style="{marginTop: step ==2 ? '3rem' : '5.4rem'}">
      <div class="main_btn_group">
        <van-button class="main_btn" plain color="#26C589" @click="cancel">取消</van-button>
        <van-button class="main_btn" color="#26C589" @click="submit">保存</van-button>
      </div>
      <div class="report_url">
        <span class="report_text" @click="goToReport">查看学习报告</span>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue';
import {
  Cell,
  Image,
  Button,
  Icon,
  CellGroup,
  Tag,
  Search,
  Dialog
} from 'vant';
import {
  verifyLogin, setBanBanTitle, banbanCall, getQueryString
} from '@/assets/js/common';
import {
  queryPlaceDuty, queryCarTime, submitUpdateCarTime, queryNeedStudyTimeConf
} from './api';

export default {
  setup() {
    setBanBanTitle('查询结果');
    const { proxy } = getCurrentInstance();

    const value1 = ref('0');
    const value2 = ref('0');
    const value3 = ref('0');
    const value4 = ref('0');
    const name = ref('');
    const number = ref('');
    const step = ref(getQueryString('step'));
    const time1 = ref(0);
    const time2 = ref(0);
    // 初始化页面
    const init = async () => {
      const res: any = await queryCarTime({
        userId: getQueryString('userId') || ''
      });
      const {
        secondCarTime = '', thirdCarTime = '', trueName = '', idNo = ''
      } = res || {};
      console.log(secondCarTime, thirdCarTime, trueName, idNo);
      value1.value = Math.floor(secondCarTime / 60) || '0';
      value2.value = secondCarTime % 60 || '0';
      value3.value = Math.floor(thirdCarTime / 60) || '0';
      value4.value = thirdCarTime % 60 || '0';
      name.value = trueName;
      number.value = idNo;
    };

    const queryTimeConf = async () => {
      const res: any = await queryNeedStudyTimeConf({
        trainingPlaceId: getQueryString('trainingPlaceId') || '',
      });
      const { secondNeedStudyTime, thirdNeedStudyTime } = res || {};
      time1.value = secondNeedStudyTime;
      time2.value = thirdNeedStudyTime;
    };
    // 校验登录后查询教练场地信息
    verifyLogin(1).then(async () => {
      init();
      queryTimeConf();
    });

    const formatter = (str: string) => str.replace(/[^\d]/g, '');

    const cancel = () => {
      proxy.$root.$router.back();
    };

    const goToReport = () => {
      proxy.$root.$router.push({
        path: '/coach/reportDetail/general',
        query: {
          trainingPlaceId: getQueryString('trainingPlaceId'),
          userId: getQueryString('userId'),
        }
      });
    };

    const submit = () => {
      Dialog.confirm({
        title: '是否更新审核学时？',
        message: '',
      }).then(async () => {
        await submitUpdateCarTime({
          userId: getQueryString('userId') || '',
          secondCarTime: step.value === '2' ? Number(value1.value * 60) + Number(value2.value) : -1,
          thirdCarTime: Number(value3.value * 60) + Number(value4.value)
        });
        proxy.$root.$router.back();
      });
    };

    return {
      formatter,
      value1,
      value2,
      value3,
      value4,
      name,
      number,
      cancel,
      goToReport,
      submit,
      step,
      time1,
      time2
    };
  },
  components: {
    [Cell.name]: Cell,
    [Image.name]: Image,
    [Button.name]: Button,
    [Icon.name]: Icon,
    [CellGroup.name]: CellGroup,
    [Tag.name]: Tag,
    [Search.name]: Search
  }
};
</script>

<style lang="less" scoped>
  .content{
    min-height: 100%;
    background: #f3f4fb;
    .cell_content{
      padding-top: 40px;

    }
    .cell_group{
      margin: 0px 32px;
      padding: 32px 0;
    }
    .time_result{
      display: flex;
    }
    .report_url{
      text-align: center;
      margin-top: 108px;
      .report_text{
        color: #26C589;
        text-decoration: underline;
      }
    }
    .mian_title{
      margin-top: 64px;
      display: flex;
      justify-content: space-between;
    }
    .first_main{
      margin-top: 84px;
      display: flex;
      justify-content: space-between;
    }
    .main_btn_group{
      margin: 170px 45px 0px;
      display: flex;
      justify-content: space-between;
      .main_btn{
        width: 40%;
      }
    }
  }
  .fixed_bottom{

    width: 100%;
    padding-bottom: 1rem;
  }
</style>
