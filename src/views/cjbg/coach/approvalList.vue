<template>
  <div class="content">
    <div class="query_content">
      <van-search
        class="cell_search"
        shape="round"
        v-model="filter.stuBaseInfo"
        placeholder="请输入学员姓名、电话、身份证号码"
        @search="querySearch"
        @update:model-value="querySearch"
      />
      <div class="filter_content" @click="showCalendar = true">
        <div class="date_cell">{{defaultDate[0]}}</div>
        <div style="padding: 0rem 0.2rem">-</div>
        <div class="date_cell">{{defaultDate[1]}}</div>

      </div>
      <div class="filter_content">
        <div @click="showMyPicker = true">
          {{myValue}}
          <i class="iconfont call_icon">&#xe64c;</i>
        </div>
        <div @click="showPicker = true">
          {{carValue}}
          <i class="iconfont call_icon">&#xe64c;</i>
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
            <div class="card_style">
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
                  <div v-if="item.sex=='0'" class="default_man"></div>
                  <div v-if="item.sex=='1'" class="default_woman"></div>
                  <div class="bind_coach">{{item.bindCoachName && item.bindCoachName.split('')[0]}}</div>
                </div>
                <div class="name_message">
                  <div class="name_tag_list">
                    <div>{{item.stuName || item.trueName}}</div>
                    <van-tag color="#e5e5e5" text-color="#B0B0B0" plain class="tag_style" v-if="item.modelCar">{{item.modelCar}}</van-tag>
                    <van-tag color="#2588D9" text-color="#2588D9" plain class="tag_style">{{item.bzkTypeName}}</van-tag>
                  </div>
                  <div class="label_text">
                    <i class="iconfont call_icon">&#xe67f;</i>
                    考试时间：<span class="value_text">{{item.testDate}} {{item.testTime}}</span>
                  </div>
                  <div class="label_text">
                    <i class="iconfont call_icon">&#xe67e;</i>
                    {{item.testSite}}
                  </div>
                </div>
                <div class="call">
                  <i class="iconfont call_icon">&#xe65b;</i>
                </div>
              </div>

            </div>
          </van-swipe-cell>
        </van-list>
      </van-pull-refresh>
    </div>
    <van-calendar color="#00CA84" v-model:show="showCalendar" type="range" :min-date="minDate" :max-date="maxDate" @confirm="onDateConfirm" />
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker
        :columns="pickerColumns"
        @confirm="onCarConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
    <van-popup v-model:show="showMyPicker" position="bottom">
      <van-picker
        :columns="myColumns"
        @confirm="onMyConfirm"
        @cancel="showMyPicker = false"
      />
    </van-popup>
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
  Image,
  Calendar,

} from 'vant';
import {
  verifyLogin, setBanBanTitle, banbanCall, getYMD, getQueryString, getYMDObj
} from '@/assets/js/common';
import { getToken } from '@/assets/js/token_cookie';
import { getStudentsApproval } from './api';
import { queryBookableDate } from '../../znyc/coach/api';

interface Option {
  text: string|number;
  value: string|number;
}
export default {
  setup() {
    setBanBanTitle('我的学员');
    const { proxy } = getCurrentInstance();
    const filter = reactive({
      stuBaseInfo: ''
    });
    const swipeCells = ref([]);

    const sum = ref(0);
    const list = reactive({
      data: [],
      loading: false,
      finished: false,
      refreshing: false,
    });

    const showCalendar = ref(false);
    const showPicker = ref(false);
    const pickerColumns = ref([{
      text: 'C1 + C2',
      value: -1
    }, {
      text: 'C1',
      value: 6
    }, {
      text: 'C2',
      value: 7
    }]);

    const carValue = ref('C1 + C2');

    const showMyPicker = ref(false);
    const myColumns = ref([{
      text: '所有学员',
      value: -1
    }, {
      text: '我的学员',
      value: 1
    }]);
    const myValue = ref('所有学员');
    const minDate = ref(new Date(new Date().valueOf() - 180 * 24 * 60 * 60 * 1000));
    const maxDate = ref(new Date(new Date().valueOf() + 180 * 24 * 60 * 60 * 1000));
    const { year, month }: any = getYMDObj(new Date());
    const defaultDate = ref([getYMD(1, `${month - 1 > 0 ? year : year - 1}-${month - 1 > 0 ? month - 1 : 12}-26`), getYMD(1, `${year}-${month}-25`)]);
    let query = reactive({
      trainingPlaceId: '',
      driveType: -1,
      current: 1,
      pageSize: 10,
      orderBy: 2,
      banbanAccessToken: '',
      startDate: defaultDate.value[0],
      endDate: defaultDate.value[1],
      stuBelongType: -1
    });
    const getStudentsApprovalApi = async (reqData: any) => {
      console.log(11112233, reqData);
      list.loading = true;
      const res: any = await getStudentsApproval(reqData);
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

    const querySearch = (value: string|number) => {
      query = {
        ...query,
        current: 1,
        stuBaseInfo: value
      };
      console.log(111, value, query);
      list.data = [];
      list.finished = false;
      getStudentsApprovalApi(query);
    };

    const onCarConfirm = (value: any) => {
      carValue.value = value.text;
      query = {
        ...query,
        current: 1,
        driveType: value.value
      };
      list.data = [];
      list.finished = false;
      getStudentsApprovalApi(query);
      showPicker.value = false;
    };

    const onMyConfirm = (value: any) => {
      myValue.value = value.text;
      query = {
        ...query,
        current: 1,
        stuBelongType: value.value
      };
      list.data = [];
      list.finished = false;
      getStudentsApprovalApi(query);
      showMyPicker.value = false;
    };

    const onDateConfirm = (values: any) => {
      const [start, end] = values;
      defaultDate.value = [getYMD(1, start), getYMD(1, end)];
      query = {
        ...query,
        current: 1,
        startDate: getYMD(1, start),
        endDate: getYMD(1, end),
      };
      list.data = [];
      list.finished = false;
      getStudentsApprovalApi(query);
      showCalendar.value = false;
    };
    const onListRefresh = () => {
      query = {
        ...query,
        current: 1,
      };
      list.data = [];
      list.finished = false;
      getStudentsApprovalApi(query);
    };

    const onListLoad = () => {
      if (list.data.length > 0) {
        query = {
          ...query,
          current: query.current + 1
        };
        getStudentsApprovalApi(query);
      }
    };

    const call = (mobile: string) => {
      console.log('mobile', mobile);
      banbanCall(mobile);
    };

    const goToReport = (item: any) => {
      const { trainingPlaceId, userId } = item;
      console.log(111, item);
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
        console.log(111, banbanTokenObj, query);

        getStudentsApprovalApi(query);
      });
    });

    return {
      list,
      onListRefresh,
      onListLoad,
      swipeCells,
      call,
      query,
      filter,
      querySearch,
      goToReport,
      sum,
      showCalendar,
      showPicker,
      pickerColumns,
      minDate,
      maxDate,
      onCarConfirm,
      getYMD,
      defaultDate,
      onDateConfirm,
      carValue,
      myColumns,
      myValue,
      showMyPicker,
      onMyConfirm
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
    [Image.name]: Image,
    [Calendar.name]: Calendar
  }
};

</script>

<style lang="less" scoped>
.content{
  background: #f3f4fb;
  min-height: 100vh;
  .query_content{
    padding: 0.2rem 0rem 0rem;
    position: fixed;
    z-index: 100;
    width: 100%;
    background: #fff;
    box-shadow: 0px 12px 24px -8px #f3f4fb;
    .cell_search{
      /deep/ .van-search__content{
        background: #f3f4fb;
      }
    }
    .filter_content{
      display: flex;
      justify-content: space-around;
      height: 0.7rem;
      align-items: center;
      padding: 0rem 0.32rem;
      color: #666666;
      font-size: 28px;
      .date_cell{
        background: #f3f4fb;
        border-radius: 0.3rem;
        text-align: center;
        height: 0.7rem;
        line-height: 0.7rem;
        flex-grow: 1;
      }
    }
    .sum{
      font-size: 28px;
      text-align: center;
      padding: 0.2rem 0rem;
      background: #f3f4fb;
      .main_text{
        color: #3FCE9B;
      }
    }
  }
  .list_content{
    padding: 3.6rem 0.24rem 0.24rem;
    .swiper_content{
      display: flex;
    }
    .card_style{
      border-radius: 0.08rem;
      background: #fff;
      font-size: 28px;
      padding: 0.4rem;
      margin-bottom: 0.24rem;
      &:not(:last-child){
        margin-bottom: 0.24rem;
      }
      .card_top{
        display: flex;
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
            margin-bottom: 0.1rem;
            align-items: center;
          }
          .tag_style{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-left: 0.2rem;
          }

          .test_time{
            color: #999;
            font-size: 24px;
          }

          .label_text{
            font-size: 24px;
            color: #666;
            .value_text{
              color: #333;
            }
          }
        }

      }

    }

    .call{
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      .call_icon{
        font-size: 48px;
        color: #00CA84;
        padding: 0.1rem 0rem;
      }
    }

  }
  .icon_style{
    font-size: 20px;
  }
}
</style>
