<template>
  <div class="content">
    <div class="query_content">
      <van-search
        class="cell_search"
        background="#f3f4fb"
        shape="round"
        v-model="filter.stuBaseInfo"
        placeholder="请输入学员姓名、电话、身份证号码"
        @search="querySearch"
        @update:model-value="querySearch"
      />
      <div class="filter_style">
        <van-dropdown-menu class="cell_dropdown" active-color="#00CA84">
          <van-dropdown-item  class="cell_dropdownitem" v-model="filter.queryType" :options="tabList" @change="changeQueryType"  />
          <van-dropdown-item  class="cell_dropdownitem" v-model="filter.stuBelongType" :options="options" @change="changeStuType" />
        </van-dropdown-menu>
        <!-- <div class="cell_filter">
          <div>所有学员</div>
        </div> -->
        <div class="cell_filter">
          <div v-if="filter.orderBy==1" @click="handleOrder(2)">
            正序
            <i class="iconfont icon_style">&#xe669;</i>
          </div>
          <div  v-if="filter.orderBy==2" @click="handleOrder(1)">
            倒序
            <i class="iconfont icon_style">&#xe66a;</i>
          </div>
        </div>
      </div>
      <div class="sum">
        共
        <span class="main_text"> {{sum}} </span>
        名学员
      </div>
    </div>
    <div class="list_content">
      <van-pull-refresh v-model="list.refreshing" @refresh="onListRefresh">
        <van-list
          v-model:loading="list.loading"
          :finished="list.finished"
          finished-text="没有更多了"
          @load="onListLoad"
        >
          <van-swipe-cell v-for="(item, index) in list.data" :key="index">
            <div class="card_style old_box" @click="goToReport(item)">
              <div class="card_top">
                <div class="user">
                  <van-image
                    v-if="item.headUrl"
                    round
                    width="0.8rem"
                    height="0.8rem"
                    :src="item.headUrl"
                  ></van-image>
                  <div v-if="!item.headUrl" class="default_image"></div>
                  <div v-if="item.sex==='0'" class="default_man"></div>
                  <div v-if="item.sex==='1'" class="default_woman"></div>
                  <div class="bind_coach">{{item.bindCoachName && item.bindCoachName.split('')[0]}}</div>
                </div>
                <div class="name_message">
                  <div class="name_tag_list">
                    <div>{{item.stuName || item.trueName}}</div>
                    <van-tag v-if="Number(item.practiceTime) >= Number(item.examinareHours) && !item.hasApproval" color="#FFEBEC" text-color="#FE6271" class="tag_style">可约考</van-tag>
                    <div v-if="item.hasApproval" class="test_time">批复时间：{{item.testDate}}</div>
                  </div>
                  <div class="tag_list">
                    <van-tag color="#e5e5e5" text-color="#B0B0B0" class="tag_style" v-if="item.classCar">{{item.classCar}}</van-tag>
                    <van-tag color="#e5e5e5" text-color="#B0B0B0" class="tag_style" v-if="item.deptPointCode">{{item.deptPointCode}}</van-tag>
                  </div>
                </div>
              </div>
              <div class="info">
                <div class="info_list">
                  <div class="info_content">
                    <div class="info_item" :style="{minWidth: '15%'}">
                      <div class="info_value">
                        {{item.ddz || ' - '}}<span class="unit">天</span>
                      </div>
                      <div class="info_label">等待值</div>
                    </div>
                    <div class="line"></div>
                    <div class="info_item" :style="{minWidth: '20%'}">
                      <div class="info_value">{{item.lastAppointDate || ' - '}}</div>
                      <div class="info_label">上次练车</div>
                    </div>
                    <div class="line"></div>
                    <div class="info_item" :style="{minWidth: '20%'}">
                      <div class="info_value">{{item.practiceTime || '0'}}/{{item.examinareHours || '0'}}</div>
                      <div class="info_label">练习时长/约考时长</div>
                    </div>
                    <div class="line"></div>
                    <div class="info_item" :style="{minWidth: '15%'}">
                      <div class="info_value">
                        {{item.examCount || '0'}}<span class="unit">次</span>
                      </div>
                      <div class="info_label">考试次数</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="learn">
                <div class="learn_title">
                  <!-- <van-icon name="info-o" /> -->
                  学习进度：
                </div>
                <div class="learn_content">
                  <div class="learn_list">
                    <div class="list_item" v-for="(list, i) in item.progress" :key="i">
                      <div :class="['list_box', list.learnPhase==item.learnPhase && 'box_active']"></div>
                      <div :class="[list.learnPhase==item.learnPhase && 'learn_active']">{{list.learnPhaseName}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="old_style" v-if="item.getCar"></div>
            </div>
            <template #right>
              <van-button square color="#f3f4fb" class="right-button" @click="call(item.mobileNo)">
                <div class="call">
                  <i class="iconfont call_icon">&#xe65b;</i>
                  <span class="call_text">电话</span>
                </div>
              </van-button>
            </template>
          </van-swipe-cell>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>

</template>

<script lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue';
import {
  CellGroup,
  Field,
  Popup,
  Picker,
  DatetimePicker,
  Grid,
  GridItem,
  PullRefresh,
  List,
  Search,
  DropdownMenu,
  DropdownItem,
  Progress,
  Tag,
  Icon,
  SwipeCell,
  Button,
  Image
} from 'vant';
import {
  verifyLogin, setBanBanTitle, banbanCall, getYMD, getQueryString
} from '@/assets/js/common';
import { getToken } from '@/assets/js/token_cookie';
import { queryAllStudent } from './api';
import { queryBookableDate } from '../../znyc/coach/api';

const tabList = [{
  text: '默认排序',
  value: 2,
}, {
  text: '等待值',
  value: 1,
}, {
  text: '学习进度',
  value: 3,
}, {
  text: '练车时长',
  value: 4,
}];

const options = [{
  text: '所有学员',
  value: -1
}, {
  text: '我的学员',
  value: 1
}];

interface Option {
  text: string|number;
  value: string|number;
}
export default {
  setup() {
    setBanBanTitle('我的学员');
    const { proxy } = getCurrentInstance();

    const swipeCells = ref([]);
    const filter = reactive({
      orderBy: 1,
      queryType: 2,
      stuBelongType: -1,
      stuBaseInfo: ''
    });
    let query = reactive({
      areaIds: [],
      banbanAccessToken: '',
      empId: '',
      stuBaseInfo: '',
      current: 1,
      orderBy: 1,
      queryType: 2,
      pageSize: 10,
      stuType: 4,
      stuBelongType: -1,
      trainingPlaceId: '',
    });
    const sum = ref(0);
    const list = reactive({
      data: [],
      loading: false,
      finished: false,
      refreshing: false,
    });

    const queryAllStudentApi = async (reqData: any) => {
      list.loading = true;
      const res: any = await queryAllStudent(reqData);
      const {
        current = 1,
        total = 0,
        data = []
      } = res || {};
      query = {
        ...query,
        current,
      };
      sum.value = total;
      list.data = data && list.data.concat(data);
      list.loading = false;
      list.refreshing = false;
      if (!data || (data && data.length < query.pageSize)) {
        list.finished = true;
      }
    };

    const changeQueryType = (value: any) => {
      query = {
        ...query,
        current: 1,
        queryType: value
      };
      list.data = [];
      list.finished = false;
      queryAllStudentApi(query);
    };

    const changeStuType = (value: any) => {
      query = {
        ...query,
        current: 1,
        stuBelongType: value
      };
      list.data = [];
      list.finished = false;
      queryAllStudentApi(query);
    };

    const handleOrder = (value: string|number) => {
      filter.orderBy = value;
      query = {
        ...query,
        current: 1,
        orderBy: value
      };
      list.data = [];
      list.finished = false;
      queryAllStudentApi(query);
    };

    const querySearch = (value: string|number) => {
      query = {
        ...query,
        current: 1,
        stuBaseInfo: value
      };
      list.data = [];
      list.finished = false;
      queryAllStudentApi(query);
    };

    const onListRefresh = () => {
      query = {
        ...query,
        current: 1,
      };
      list.data = [];
      list.finished = false;
      queryAllStudentApi(query);
    };

    const onListLoad = () => {
      if (list.data.length > 0) {
        query = {
          ...query,
          current: query.current + 1
        };
        queryAllStudentApi(query);
      }
    };

    const call = (mobile: string) => {
      banbanCall(mobile);
    };

    const goToReport = (item: any) => {
      const { trainingPlaceId, userId } = item;
      proxy.$root.$router.push({
        path: '/coach/reportDetail/general',
        query: {
          trainingPlaceId,
          userId,
        }
      });
    };
    // 校验登录后查询教练场地信息
    verifyLogin(1).then(async () => {
      const banbanTokenObj = JSON.parse(getToken('banbanTokenObj')) || {};
      const { coachId = '', organId = '', token = '' } = banbanTokenObj;
      queryBookableDate().then((res: any) => {
        query = {
          ...query,
          empId: coachId,
          areaIds: [organId],
          banbanAccessToken: token,
          trainingPlaceId: (res && res[0] && res[0].venueId) || ''
        };

        queryAllStudentApi(query);
      });
    });

    return {
      options,
      filter,
      tabList,
      changeQueryType,
      list,
      onListRefresh,
      onListLoad,
      swipeCells,
      call,
      query,
      changeStuType,
      handleOrder,
      querySearch,
      goToReport,
      sum
    };
  },
  components: {
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [DatetimePicker.name]: DatetimePicker,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Search.name]: Search,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Progress.name]: Progress,
    [Tag.name]: Tag,
    [Icon.name]: Icon,
    [SwipeCell.name]: SwipeCell,
    [Button.name]: Button,
    [Image.name]: Image
  }
};

</script>

<style lang="less" scoped>
.content{
  background: #f3f4fb;
  min-height: 100vh;
  .query_content{
    padding: 0.2rem 0rem 0.2rem;
    position: fixed;
    z-index: 100;
    width: 100%;
    background: #f3f4fb;
    box-shadow: 0px 12px 24px -8px #f3f4fb;

    .filter_style{
      display: flex;
      align-items: center;
      padding: 0 0.24rem 0rem;
      font-size: 26px;
      color: #323233;
      justify-content: space-around;
      .cell_dropdown{
        width: 66%;
        height: 0.6rem;
        line-height: 0.6rem;
        /deep/ .van-dropdown-menu__bar{
          background: #f3f4fb;
          box-shadow: none;
          height: 0.6rem;
        }
        /deep/ .van-dropdown-menu__title{
          font-size: 26px;
        }
        /deep/ .van-cell{
          font-size: 26px;
        }
      }
      .cell_filter{
        width: 33%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 0.6rem;
        line-height: 0.6rem;
      }
    }
    .sum{
      text-align: center;
      font-size: 28px;
      .main_text{
        color: #3FCE9B;
      }
    }
  }
  .list_content{
    padding: 2.6rem 0.24rem 0.24rem;
    .swiper_content{
      display: flex;
    }
    .card_style{
      border-radius: 0.08rem;
      background: #fff;
      font-size: 28px;
      padding: 0.4rem;
      &:not(:last-child){
        margin-bottom: 0.24rem;
      }
      .card_top{
        display: flex;
        margin-bottom: 0.2rem;
        .user{
          position: relative;
          min-width: 1.2rem;
          .default_image{
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: inline-block;
            background: url('../../../assets/images/sprite.png') no-repeat;
            background-size: 560px auto;
            background-position: -20px -218px;
          }
          .default_man{
            position: absolute;
            top: 0px;
            right: 32px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: inline-block;
            background: url('../../../assets/images/sprite.png') no-repeat;
            background-size: 1120px auto;
            background-position: -430px -520px;
          }
          .default_woman{
            position: absolute;
            top: 0px;
            right: 32px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: inline-block;
            background: url('../../../assets/images/sprite.png') no-repeat;
            background-size: 1120px auto;
            background-position: -470px -520px;
          }
          .bind_coach{
            position: absolute;
            left: -20px;
            top: -30px;
            font-size: 20px;
          }
        }
        .name_message{
          width: 100%;
          .name_tag_list{
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.1rem;
            align-items: center;
          }
          .tag_list{
            display: flex;
            justify-content: flex-start;
            margin-bottom: 0.1rem;
            align-items: center;
          }
          .tag_style:not(:last-child){
            margin-right: 0.2rem;
          }
          .test_time{
            color: #999;
            font-size: 24px;
          }
        }

      }
      .info{
        flex: auto;

        .info_list{
          text-align: center;
          .info_content{
            display: flex;
            margin-bottom: 0.2rem;
            justify-content: space-between;
            .info_item{

              .info_value{
                font-size: 24px;
                line-height: 0.25rem;
                height: 0.25rem;
                color: #333333;
                font-weight: bold;
                .unit{
                  font-size: 20px;
                }
              }
              .info_label{
                font-size: 20px;
                color: #999999;
              }
            }
            .line{
              width: 0.01rem;
              background: rgba(151, 151, 151, 0.1);
            }
          }
        }
      }
      .learn{
        display: flex;
        width: 100%;
        margin-top: 0.1rem;
        .learn_title{
          min-width: 1.2rem;
          font-size: 20px;
          color: #666;
        }
        .learn_content{
          flex: auto;
          justify-content: space-between;
          .learn_list{
            display: flex;
            justify-content: space-around;
            font-size: 20px;
            color: #999999;
            align-items: baseline;

            .list_item:not(:last-child){
              text-align: center;
              flex: auto;
              padding: 0rem 0.03rem;
              min-width: 33%;
              .list_box{
                width: 100%;
                background: #e5e5e5;
                height: 0.14rem;
                margin: 0.1rem 0rem;
              }
              .box_active{
                background: #00CA84;
              }
              .learn_active{
                color: #333333;
              }
            }
            .list_item:last-child{
              flex: auto;
              text-align: center;
              padding: 0rem 0.03rem;
              min-width: 33%;
              .list_box{
                width: calc(100% - 0.07rem);
                background: #e5e5e5;
                height: 0.14rem;
                margin: 0.1rem 0.14rem 0.1rem 0rem;
                position: relative;
                &::after{
                  content: '';
                  border-top: 0.14rem solid transparent;
                  border-bottom: 0.14rem solid transparent;
                  border-left: 0.14rem solid #e5e5e5;
                  position: absolute;
                  right: -0.07rem;
                  top: -0.07rem;
                  overflow: hidden;
                }
              }
              .list_box.box_active{
                background: #00CA84;
                &::after{
                  content: '';
                  border-top: 0.14rem solid transparent;
                  border-bottom: 0.14rem solid transparent;
                  border-left: 0.14rem solid #00CA84;
                  position: absolute;
                  right: -0.07rem;
                  top: -0.07rem;
                  overflow: hidden;
                }
              }
              .learn_active{
                color: #333333;
              }
            }
          }

          .progress_style{
            margin: 0.1rem 0rem 0.1rem;
            height: 0.1rem;
            background: #00CA84;
            border-radius: 0.05rem;
            position: relative;
            border-left: 0.1rem solid #eee;
            .progress_line{
              position: absolute;
              background: #eee;
              width: 50%;
              height: 0.1rem;
              left: -0.01rem;
              &::after{
                content: '';
                width: 0.2rem;
                height: 0.2rem;
                background: #00CA84;
                border-radius: 0.1rem;
                position: absolute;
                right: -0.05rem;
                top: -0.05rem;
              }
            }
          }
        }
      }
    }
    .right-button{
      height: 100%;
      color: #484848 ;

      .call{
        display: flex;
        align-items: center;
        flex-direction: column;
        .call_icon{
          font-size: 48px;
          color: #00CA84;
          padding: 0.1rem 0rem;
        }
        .call_text{
          color: #484848;
          font-size: 24px;
        }
      }

    }
    .left-button{
      height: 100%;
    }
  }
  .icon_style{
    font-size: 20px;
  }
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
</style>
