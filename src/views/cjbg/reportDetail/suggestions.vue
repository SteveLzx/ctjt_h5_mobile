<template>
<div>
  <div class="content">
    <div class="box">
      <div class="message">
        <div class="title">建议预约：</div>
        <div class="item_flex">
          <div>{{resList.learnPhaseName}}</div>
          <div class="btn_style" @click="goToAppoint">立即预约</div>
        </div>
        <div class="main_title">重点关注:</div>
        <div class="title">项目名称：</div>
        <div class="item_value">{{resDate.learnPhaseName}} - {{resDate.itemName}}</div>
        <div class="title">最常犯的错误：</div>
        <div class="item_value">{{resDate.errorContent}}</div>
        <div class="title">错误原因:</div>
        <div class="item_value">
          <div v-for="(text,index) in getSpiltList(resDate.mistakeReason)" :key="index">{{text}}</div>
        </div>
        <div class="title">解决措施:</div>
        <div class="item_value">
          <div v-for="(text,index) in getSpiltList(resDate.solutions)" :key="index">{{text}}</div>
        </div>
        <div v-if="resList.followUpAdviseDetail">
          <ul v-for="(item, index) in resList.followUpAdviseDetail" :key="index">
            <li class="user" v-if="item.questions">
              <div class="user_message">{{item.questions}}</div>
              <div class="user_image"></div>
            </li>
            <li class="coach">
              <div class="coach_image"></div>
              <div>
                <div class="coach_name">资深教练</div>
                <div class="coach_message">
                  <span class="main_text" v-if="item.itemName">{{item.itemName}}:</span>
                  {{item.advise}}
                </div>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</div>

</template>

<script lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue';
import { Button } from 'vant';
import {
  verifyLogin, setBanBanTitle, getYMD, getQueryString
} from '@/assets/js/common';
import { queryFocusData, queryFollowUpAdvise } from './api';

export default {
  setup() {
    setBanBanTitle('名师建议');
    const { proxy } = getCurrentInstance();
    const resDate = ref({});
    const query = reactive({
      trainingPlaceId: getQueryString('trainingPlaceId'),
      userId: getQueryString('userId'),
      appointId: getQueryString('appointId')
    });
    const resList = ref({});

    const goToAppoint = () => {
      proxy.$root.$router.push({
        path: '/appoint_car',
      });
    };

    // 初始化页面
    const init = async () => {
      const res = await queryFocusData(query);
      const list = await queryFollowUpAdvise(query);
      console.log(res, list, 1111);
      resDate.value = res || {};
      resList.value = list || {};
    };
    const getSpiltList = (text = '') => text && text.split('###');

    init();
    return {
      resDate,
      getSpiltList,
      resList,
      goToAppoint
    };
  },
  components: {
    [Button.name]: Button
  }
};

</script>

<style lang="less" scoped>
.content{
  background: #5BC5FF url('../../../assets/images/cjbg/suggestions_bg.png') no-repeat;
  background-size: 100% auto;
  min-height: 100%;
  background-position: bottom;
  .box{
    padding: 1rem 0.5rem 2.5rem;
    // min-height: 12.32rem;
    .message{
      background: rgba(255, 255, 255, 0.8);
      border-radius: 0.1rem;
      padding: 0.44rem 0.4rem;
      .main_title{
        font-size: 32px;
        color: #000;
        line-height: 0.64rem;
        height: 0.32rem;
        font-weight: bold;
      }
      .title{
        font-size: 32px;
        color: #000;
        line-height: 0.64rem;
        height: 0.64rem;
        margin-top: 0.16rem;
      }
      .item_flex{
        display: flex;
        justify-content: space-between;
        color: #3373F6;
        line-height: 0.56rem;
        font-size: 32px;
        align-items: center;
        margin-bottom: 0.3rem;
      }
      .btn_content{
        margin: 0.1rem 0rem 0.3rem;
        text-align: right;

      }
      .btn_style{
        display: inline-block;
        padding: 0rem 0.2rem;
        border: 0.02rem solid #3373F6;
        color: #3373F6;
        border-radius: 0.08rem;
        height: 0.64rem;
        line-height: 0.64rem;
        font-size: 22px;
      }
      .item_value{
        font-size: 26px;
        color: #666;
        line-height: 0.48rem;
        word-break: break-all;
      }
      .btn_list{
        display: flex;
        justify-content: space-between;
        margin: 0.1rem 0rem 0.3rem;
        text-align: center;
      }
      .item_text{
        font-size: 32px;
        color: #3373F6;
        line-height: 0.64rem;
      }
      .user{
        display: flex;
        justify-content: flex-end;
        margin: 0.3rem 0rem;
        .user_message{
          background: #fff;
          position: relative;
          margin-right: 0.3rem;
          padding: 0.2rem;
          font-size: 26px;
          color: #666666;
          border-radius: 0.1rem;
          &::after{
            content: '';
            position: absolute;
            right: -0.1rem;
            top: 0.2rem;
            border-top: 0.1rem solid transparent;
            border-bottom: 0.1rem solid transparent;
            border-left: 0.1rem solid #fff;
          }
        }
        .user_image{
          width: 62px;
          height: 62px;
          min-width: 62px;
          border-radius: 50%;
          display: inline-block;
          background: url('../../../assets/images/sprite.png') no-repeat;
          background-size: 750px auto;
          background-position: -146px -391px;
        }
      }
      .coach{
        display: flex;
        justify-content: flex-start;
        margin: 0.3rem 0rem;
        .coach_message{
          background: #CBECFF;
          position: relative;
          margin-left: 0.3rem;
          padding: 0.2rem;
          font-size: 26px;
          color: #666666;
          border-radius: 0.1rem;
          &::after{
            content: '';
            position: absolute;
            left: -0.1rem;
            top: 0.2rem;
            border-top: 0.1rem solid transparent;
            border-bottom: 0.1rem solid transparent;
            border-right: 0.1rem solid #CBECFF;
          }
          .main_text{
            color: #000;
            font-weight: bold;
          }
        }
        .coach_image{
          width: 62px;
          height: 62px;
          min-width: 62px;
          border-radius: 50%;
          display: inline-block;
          background: url('../../../assets/images/sprite.png') no-repeat;
          background-size: 750px auto;
          background-position: -216px -391px;
        }
        .coach_name{
          padding: 0rem 0.2rem 0.1rem;
          font-size: 24px;
          color: #999;
        }
      }
    }
  }
}
</style>
