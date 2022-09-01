<template>
  <div class="content">
    <div class="content_top">
      <div class="user">
        <van-image
          v-if="resDate.userLogoUrl"
          round
          width="0.8rem"
          height="0.8rem"
          :src="resDate.userLogoUrl"
        ></van-image>
        <div v-else class="default_image"></div>
        <div class="user_info">
          <div class="user_name">{{resDate.trueName}}</div>
          <div class="user_telephone">
            <span><i class="iconfont" :style="{color: '#3DB871'}">&#xe67c;</i> {{resDate.mobileNo}}</span>
            <span><i class="iconfont" :style="{color: '#3DB871'}">&#xe67d;</i> {{resDate.idNo}}</span>
          </div>
        </div>
      </div>
      <div class="train">
        <div class="train_cell">
          <div class="train_time">{{resDate.practiceTime || 0}}/{{resDate.examinareHours || 0}}</div>
          <div class="train_label">总练习时长/建议约考学时</div>
        </div>
        <div class="status btn_style" :class="{'active': resDate.reserveStatus == 1}"
          v-if="Number(resDate.practiceTime) >= Number(resDate.examinareHours) || resDate.reserveStatus == 1">
            {{resDate.reserveStatus == 1 ? '已批复' : '可约考'}}
        </div>
      </div>
    </div>
    <ul class="info">
      <li class="item">
        <div class="item_label">学车进度</div>
        <div class="item_value">{{resDate.learnPhaseName || '-'}}</div>
      </li>
      <li class="item" v-show="resDate.nowLearnPhaseName">
        <div class="item_label">本次预约</div>
        <div class="item_value">{{resDate.nowLearnPhaseName|| '-'}}</div>
      </li>
      <li class="item">
        <div class="item_label">总预约次数</div>
        <div class="item_value">{{resDate.totalCount || 0}}次</div>
      </li>
      <li class="item">
        <div class="item_label">迟到次数</div>
        <div class="item_value">{{resDate.lateCount || 0}}次</div>
      </li>
      <li class="item_extra">
        <div class="extra_item">
          <div class="item_label">爽约次数</div>
          <div class="item_value">{{resDate.bailCount || 0}}次</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue';
import {
  Cell,
  Image,
  Button,
  Icon
} from 'vant';
import {
  verifyLogin, setBanBanTitle, banbanCall, getQueryString
} from '@/assets/js/common';
import { queryGeneral } from './api';

export default {
  setup() {
    setBanBanTitle('总体概括');
    const { proxy } = getCurrentInstance();

    // 初始化接口返回数据
    const resDate = ref({});
    const video = ref('');
    // 初始化接口查询所需字段
    const query = reactive({
      trainingPlaceId: getQueryString('trainingPlaceId'),
      userId: getQueryString('userId')
    });

    // 初始化页面
    const init = async () => {
      const res = await queryGeneral(query);
      resDate.value = res || {};
    };

    // 校验登录后查询教练场地信息
    verifyLogin(1).then(async () => {
      init();
    });

    return {
      resDate,
      video
    };
  },
  components: {
    [Cell.name]: Cell,
    [Image.name]: Image,
    [Button.name]: Button,
    [Icon.name]: Icon,
  }
};

</script>

<style lang="less" scoped>
.content{
  .content_top{
    margin: 0px 0.32rem;
    height: 3.06rem;
    .user{
      display: flex;
      justify-self: start;
      align-items: center;
      padding: 0.48rem 0rem 0.34rem;
      height: 0.8rem;
      .user_info{
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        margin-left: 0.24rem;
        flex-grow: 1;
        .user_name{
          font-size: 36px;
          color: #000;
        }
        .user_telephone{
          font-size: 26px;
          color: #666;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
      .default_image{
         width: 80px;
        height: 80px;
        border-radius: 50%;
        display: inline-block;
        background: url('../../../assets/images/sprite.png') no-repeat;
        background-size: 560px auto;
        background-position: -20px -218px;
      }
    }
    .train{
      background: #3DB871;
      border-radius: 0.08rem;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 1.14rem;
      padding: 0 0.32rem;
      .train_cell{
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: space-around;
        line-height: 0.28rem;
        height: 0.76rem;
        .train_time{
          font-size:32px;
        }
        .train_label{
          font-size: 22px;
        }
      }
      .btn_style{
        background: #3DB871;
        height: 0.5rem;
        line-height: 0.5rem;
        font-size: 28px;
        padding: 0 0.2rem;
      }
      .status{
        background: #ffeee3;
        border-radius: 18px;
        font-size: 28px;
        color: #FA6400;
        &.active{
          background: #DEFFF0;
          color: #3DB871;
        }
      }

    }
  }
  .info{
    border-top: 0.24rem solid #eee;
    padding: 0 0.32rem;
    display: flex;
    flex-direction: column;
    .item{
      display: flex;
      height: 1rem;
      align-items: center;
      justify-content: space-between;
      font-size: 28px;
      &:not(:first-child){
        border-top: 2px solid #e5e5e5;
      }
      .item_label{
        color: #363737;
        height: 1rem;
        line-height: 1rem;
      }
      .item_value{
        color: #999999;
        height: 1rem;
        line-height: 1rem;
      }
    }
    .item_extra{
      border-top: 2px solid #e5e5e5;
      .extra_item{
        display: flex;
        height: 1rem;
        align-content: center;
        justify-content: space-between;
        line-height: 1rem;
        font-size: 28px;

        .item_label{
          color: #363737;
        }
        .item_value{
          color: #999999;
        }
      }
      .extra_message{
        color: #e02020;
        text-align: right;
      }
    }

  }
}

</style>
