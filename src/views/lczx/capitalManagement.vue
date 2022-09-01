<template>
  <div class="content">
    <van-tabs
      v-model:active="active"
      title-active-color="#00CA84"
      color="#00CA84"
      background="#f3f4fb"
      @change="changeTab"
    >
      <van-tab
        :title="tab.title"
        :name="tab.name"
        v-for="tab in tabList"
        :key="tab.name"
      ></van-tab>
    </van-tabs>

    <div class="sub_tab">
      <div
        class="sub_tab_badge"
        v-for="(subtab,index) in tabList[active].children"
        :key="subtab.value"
      >
        <div class="tab_badge" @click="changeSubActive(subtab.value)">
          <van-badge
            :content="badges[subtab.badge]"
            :color="subActive === subtab.value ? '#FE6271' : '#999999'"
            :style="{ color: subActive === subtab.value ? '#00CA84' : '#999999' }"
          >
            <i :class="['iconfont','subicon', subtab.icon]"></i>
            {{ subtab.title }}
          </van-badge>
        </div>
        <div class="divider" v-if="index !== tabList[active].children.length - 1"></div>
      </div>
    </div>

    <van-list
      :style="{marginBottom: subActive == '0' ? '80px': '0'}"
      v-model:loading="list.loading"
      :finished="list.finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-checkbox-group
        v-model="checked"
        ref="checkboxGroup"
        @change="changeChecked"
      >
        <div class="card" v-for="(item, index) in list.data" :key="index">
          <van-checkbox
            v-if="subActive == '0'"
            class="card_checkbox"
            :name="item.userId"
            checked-color="#00CA84"
          ></van-checkbox>
          <van-swipe-cell class="swipe_cell">
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
                  <div v-if="item.sex==='0'" class="default_man"></div>
                  <div v-if="item.sex==='1'" class="default_woman"></div>
                </div>
                <div class="name_message">
                  <div class="name_tag_list">
                    <div>{{item.stuName || item.trueName}}</div>
                    <div>
                      <van-tag v-if="Number(item.practiceTime) >= Number(item.examinareHours) && !item.hasApproval" color="#FFEBEC" text-color="#FE6271" class="tag_style">可约考</van-tag>
                      <div v-if="item.hasApproval" class="test_time">批复时间：{{item.testDate}}</div>
                    </div>

                  </div>
                  <div class="tag_list">
                    <van-tag color="#e5e5e5" text-color="#B0B0B0" class="tag_style">{{item.classCar}}</van-tag>
                    <van-tag color="#e5e5e5" text-color="#B0B0B0" class="tag_style">{{item.deptPointCode}}</van-tag>
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
              <div v-if="subActive==='0'" class="learn">
                <div class="learn_title">
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
              <div v-if="subActive==='1'||subActive==='2'">
                <span class="label_text">提交时间：</span><span class="value_text">{{item.submitTime}}</span>
              </div>
            </div>
          </van-swipe-cell>
        </div>
      </van-checkbox-group>
    </van-list>

    <div class="bottom_submit" v-if="subActive == '0'">
      <van-checkbox
        v-model="allChecked"
        @change="checkAll"
        checked-color="#00CA84"
        >全选</van-checkbox
      >
      <van-button type="success" :style="{ width: '1.8rem' }" @click="submit">提交</van-button>
    </div>
  </div>

  <van-overlay :show="show" @click="show = false">
    <div class="wrapper" @click.stop>
      <div class="block">
        <i class="iconfont success_icon">&#xe674;</i>
        <div>提交成功!</div>
        <div>已提交{{checked.length}}名学员，剩余{{totalVal}}名学员!</div>
      </div>
      <van-button color="#26C589" round :style="{marginTop: '0.5rem',width:'2rem'}" @click="show=false">确定</van-button>
    </div>
  </van-overlay>
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
  Collapse,
  CollapseItem,
  Divider,
  Tab,
  Tabs,
  Badge,
  Checkbox,
  CheckboxGroup,
  SwipeCell,
  NoticeBar,
  List,
  Overlay
} from 'vant';
import {
  verifyLogin, setBanBanTitle, banbanCall, getQueryString
} from '@/assets/js/common';
import { getToken } from '@/assets/js/token_cookie';
import { queryStudentStudyFund, submitFundSupervisionStatus, queryStudyHoursList } from './api';
import { queryBookableDate } from '../znyc/coach/api';

export default {
  setup() {
    setBanBanTitle('资金监管');
    const { proxy } = getCurrentInstance();

    const tabList = ref([
      {
        title: '资金监管科二',
        name: '0',
        children: [{
          value: '0',
          title: '待交',
          icon: 'icon_e672',
          badge: 'first'
        }, {
          value: '1',
          title: '已提交',
          icon: 'icon_e678',
          badge: 'second'

        }, {
          value: '2',
          title: '完成缴纳',
          icon: 'icon_e675',
          badge: 'third'

        }]
      }, {
        title: '资金监管科三',
        name: '1',
        children: [{
          value: '0',
          title: '待交',
          icon: 'icon_e672',
          badge: 'first'

        }, {
          value: '1',
          title: '已提交',
          icon: 'icon_e678',
          badge: 'second'

        }, {
          value: '2',
          title: '完成缴纳',
          icon: 'icon_e675',
          badge: 'third'

        }]
      }
    ]);

    // 初始化接口返回数据
    const active = ref('0');
    const subActive = ref('0');
    const checked = ref([]);
    const allChecked = ref(false);
    const checkboxGroup = ref(null);
    const show = ref(false);
    let query = reactive({
      areaIds: [],
      banbanAccessToken: '',
      empId: '',
      current: 1,
      orderBy: 1,
      queryType: 2,
      pageSize: 10,
      fundSupervision: 0,
      step: 2,
    });

    const list = reactive({
      data: [],
      loading: false,
      finished: false,
    });
    const badges = reactive({
      first: 0,
      second: 0,
      third: 0
    });
    const totalVal = ref(0);
    const queryStudentStudyFundApi = async (reqData: any) => {
      list.loading = true;
      const res: any = await queryStudentStudyFund(reqData);
      const {
        current = 1,
        total = 0,
        data = [],
        first = 0,
        second = 0,
        third = 0
      } = res || {};
      query = {
        ...query,
        current,
      };
      list.data = data && list.data.concat(data);
      list.loading = false;
      list.refreshing = false;
      badges.first = first;
      badges.second = second;
      badges.third = third;
      totalVal.value = total;
      if (!data || (data && data.length < query.pageSize)) {
        list.finished = true;
      }
    };

    // 初始化页面
    const init = async () => {
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

        queryStudentStudyFundApi(query);
      });
    };

    // 校验登录后查询教练场地信息
    verifyLogin(1).then(async () => {
      init();
    });

    const changeSubActive = (num: string) => {
      subActive.value = num;
      query = {
        ...query,
        fundSupervision: num,
        current: 1,
      };
      list.data = [];
      list.finished = false;
      queryStudentStudyFundApi(query);
    };

    const checkAll = (check: boolean) => {
      if (check) {
        checkboxGroup.value.toggleAll(true);
      } else {
        checkboxGroup.value.toggleAll(false);
      }
    };

    const changeChecked = (name: any) => {
      console.log(name);
    };

    const changeTab = (name: string | number, title: string) => {
      tabList.value.forEach((tab: any, index: number) => {
        if (tab.name === name) {
          subActive.value = tabList.value[index].children[0].value;
        }
      });
      checkboxGroup.value.toggleAll(false);

      query = {
        ...query,
        current: 1,
        step: active.value < 1 ? '2' : '3',
        fundSupervision: subActive.value,

      };
      list.data = [];
      list.finished = false;
      queryStudentStudyFundApi(query);
    };

    const onLoad = () => {
      if (list.data.length > 0) {
        query = {
          ...query,
          current: query.current + 1
        };

        queryStudentStudyFundApi(query);
      }
    };

    const submit = async () => {
      if (checked.value.length > 0) {
        await submitFundSupervisionStatus({
          userIds: checked.value,
          step: active.value < 1 ? '2' : '3',
        });
        show.value = true;
        query = {
          ...query,
          current: 1,
        };
        list.data = [];
        list.finished = false;
        queryStudentStudyFundApi(query);
      }
    };

    return {
      active,
      subActive,
      changeSubActive,
      checked,
      allChecked,
      checkboxGroup,
      checkAll,
      changeChecked,
      tabList,
      changeTab,
      list,
      onLoad,
      submit,
      show,
      badges,
      totalVal
    };
  },
  components: {
    [Cell.name]: Cell,
    [Image.name]: Image,
    [Button.name]: Button,
    [Icon.name]: Icon,
    [CellGroup.name]: CellGroup,
    [Tag.name]: Tag,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Divider.name]: Divider,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Badge.name]: Badge,
    [CheckboxGroup.name]: CheckboxGroup,
    [Checkbox.name]: Checkbox,
    [SwipeCell.name]: SwipeCell,
    [NoticeBar.name]: NoticeBar,
    [List.name]: List,
    [Overlay.name]: Overlay
  },

};
</script>

<style lang="less" scoped>
.content {
  min-height: 100%;
  background: #f3f4fb;
  overflow: hidden;
}
.nav_btn {
  align-self: center;
  width: 70px;
  text-align: center;
}
.nav_left{
  width: 70px;
  height: 70px;
  margin: 0 auto;
  background: url('../../assets/images/icon1.png') no-repeat;
  background-size: 1500px auto;
  background-position: -1115px -285px;
}
.nav_right{
  width: 70px;
  height: 70px;
  margin: 0 auto;
  background: url('../../assets/images/icon1.png') no-repeat;
  background-size: 1500px auto;
  background-position: -1215px -285px;
}
.sub_tab {
  margin: 20px;
  display: flex;
  background: #fff;
  border-radius: 8px;
  justify-content: space-around;
  padding: 30px 0px 20px 0px;
  .divider {
    width: 2px;
    height: 40px;
    background: #f4f4f4;
  }
  .sub_tab_badge {
    min-width: 32%;
    text-align: center;
    font-size: 28px;
    display: flex;
    .tab_badge{
      flex-grow: 1;
    }
  }
}
.card {
  display: flex;
  margin-bottom: 20px;
  .card_checkbox {
    padding-left: 20px;
    min-width: 40px;
  }
  .swipe_cell {
    width: 100%;

    .cell {
      margin: 0px 20px;
      border-radius: 8px;
      overflow: hidden;
      background: #fff;
    }
  }
}
.bottom_submit {
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  width: calc(100% - 40px);
  padding: 20px;
  background: #fff;
}
.card_style {
  border-radius: 0.08rem;
  background: #fff;
  font-size: 28px;
  padding: 0.4rem;
  margin: 0 0.2rem 0.2rem;
  &:not(:last-child) {
    margin-bottom: 0.24rem;
  }
  .card_top {
    display: flex;
    margin-bottom: 0.2rem;
    .user {
      position: relative;
      min-width: 1.2rem;
      .default_image {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: inline-block;
        background: url("../../assets/images/sprite.png") no-repeat;
        background-size: 560px auto;
        background-position: -20px -218px;
      }
      .default_man {
        position: absolute;
        top: 0px;
        right: 32px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: inline-block;
        background: url("../../assets/images/sprite.png") no-repeat;
        background-size: 1120px auto;
        background-position: -430px -520px;
      }
      .default_woman {
        position: absolute;
        top: 0px;
        right: 32px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: inline-block;
        background: url("../../assets/images/sprite.png") no-repeat;
        background-size: 1120px auto;
        background-position: -470px -520px;
      }
    }
    .name_message {
      width: 100%;
      .name_tag_list {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.1rem;
        align-items: center;
      }
      .tag_list {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 0.1rem;
        align-items: center;
      }
      .tag_style:not(:last-child) {
        margin-right: 0.2rem;
      }
      .test_time {
        color: #999;
        font-size: 24px;
      }
    }
  }
  .info {
    flex: auto;

    .info_list {
      text-align: center;
      .info_content {
        display: flex;
        margin-bottom: 0.2rem;
        justify-content: space-between;
        .info_item {
          .info_value {
            font-size: 24px;
            line-height: 0.25rem;
            height: 0.25rem;
            color: #333333;
            font-weight: bold;
            .unit {
              font-size: 20px;
            }
          }
          .info_label {
            font-size: 20px;
            color: #999999;
          }
        }
        .line {
          width: 0.01rem;
          background: rgba(151, 151, 151, 0.1);
        }
      }
    }
  }
  .learn {
    display: flex;
    width: 100%;
    margin-top: 0.1rem;
    .learn_title {
      min-width: 1.2rem;
      font-size: 20px;
      color: #666;
    }
    .learn_content {
      flex: auto;
      justify-content: space-between;
      .learn_list {
        display: flex;
        justify-content: space-around;
        font-size: 20px;
        color: #999999;
        align-items: baseline;

        .list_item:not(:last-child) {
          text-align: center;
          flex: auto;
          padding: 0rem 0.03rem;
          min-width: 33%;
          .list_box {
            width: 100%;
            background: #e5e5e5;
            height: 0.14rem;
            margin: 0.1rem 0rem;
          }
          .box_active {
            background: #00ca84;
          }
          .learn_active {
            color: #333333;
          }
        }
        .list_item:last-child {
          flex: auto;
          text-align: center;
          padding: 0rem 0.03rem;
          min-width: 33%;
          .list_box {
            width: calc(100% - 0.07rem);
            background: #e5e5e5;
            height: 0.14rem;
            margin: 0.1rem 0.14rem 0.1rem 0rem;
            position: relative;
            &::after {
              content: "";
              border-top: 0.14rem solid transparent;
              border-bottom: 0.14rem solid transparent;
              border-left: 0.14rem solid #e5e5e5;
              position: absolute;
              right: -0.07rem;
              top: -0.07rem;
              overflow: hidden;
            }
          }
          .list_box.box_active {
            background: #00ca84;
            &::after {
              content: "";
              border-top: 0.14rem solid transparent;
              border-bottom: 0.14rem solid transparent;
              border-left: 0.14rem solid #00ca84;
              position: absolute;
              right: -0.07rem;
              top: -0.07rem;
              overflow: hidden;
            }
          }
          .learn_active {
            color: #333333;
          }
        }
      }

      .progress_style {
        margin: 0.1rem 0rem 0.1rem;
        height: 0.1rem;
        background: #00ca84;
        border-radius: 0.05rem;
        position: relative;
        border-left: 0.1rem solid #eee;
        .progress_line {
          position: absolute;
          background: #eee;
          width: 50%;
          height: 0.1rem;
          left: -0.01rem;
          &::after {
            content: "";
            width: 0.2rem;
            height: 0.2rem;
            background: #00ca84;
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
.notice_bar{
  margin: 20px;
  background: #fff;
  border-radius: 8px;

  .notice_icon{
    width: 35px;
    height: 35px;
    margin: 0 auto;
    background: url('../../assets/images/icon1.png') no-repeat;
    background-size: 750px auto;
    background-position: -435px -145px;
    align-self: flex-start;
    margin: 8px 8px 8px 0px;
  }
  .notice_text{
    font-size: 24px;
    color: #666;
  }
}
.label_text{
  color: #999999;
  font-size: 24px;

}
.value_text{
  color: #333333;
  font-size: 24px;
}
.cell_list{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  &:not(:last-child){
    margin-bottom: 12px;
  }
  .half_cell{
    min-width: 50%;
  }
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-direction: column;
}

.block {
  padding: 80px;
  min-width: 3rem;
  background-color: #fff;
  border-radius: 8px;
  text-align: center;
}
.success_icon{
  font-size: 80px;
  color: #26C589;
}
.subicon{
  font-size: 28px;
}
.icon_e672:before {
  content: "\e672";
}
.icon_e678:before {
  content: "\e678";
}
.icon_e675:before {
  content: "\e675";
}
.icon_e671:before {
  content: "\e671";
}
.icon_e676:before {
  content: "\e676";
}
.icon_e677:before {
  content: "\e677";
}
</style>
