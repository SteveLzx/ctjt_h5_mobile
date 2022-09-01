<template>
  <div class="content">
    <van-cell-group>
      <van-cell title="当前进度" :value="progress" size="large" />
      <van-cell title="场地选择" :value="field.value" :value-class="{'no_data': !field.placeId}" size="large"  @click="cascaderShow = true" />
      <div class="flex_date" v-if="field.placeId && dateList.length > 0">
        <van-tabs class="tabs_content" v-model:active="active" swipeable :ellipsis="false" color="transparent" @click="changeTab">
          <van-tab v-for="(item, index) in dateList" :key="index" :name="getYMD(1, item.date)" >
            <template #title>
              <div class="tab_content">
                <div>{{transDate(item.date)}}</div>
                <div>周{{transWeek(item.date)}}</div>
                <div v-if="!!item.full" class="can_appoint">（预约）</div>
              </div>

            </template>
          </van-tab>
        </van-tabs>
      </div>
    </van-cell-group>
    <div class="collapse_content" v-if="field.placeId  && dateList.length > 0">
      <van-collapse v-for="(item, index) in appointList" :key="index" class="collapse" v-model="activeNames" accordion>
        <van-collapse-item :name="index" :value="activeNames === index? '收起': '展开'" >
          <template #title>
            <div>
              <i class="iconfont" v-if="item.alreadyAppointNums>=item.totalAppointNums" :style="{color: '#999999'}" >&#xe646;</i>
              <i class="iconfont" v-else :style="{color: '#3DB871'}">&#xe646;</i>
               {{item.timeRange}}

              <van-tag v-if="item.alreadyAppointNums>=item.totalAppointNums" plain color="#999999">已约满</van-tag>

            </div>
          </template>
          <div class="button_group">
            <van-button
              plain
              :color="i >= item.alreadyAppointNums? '#3DB871': '#999999'"
              :disabled="i < item.alreadyAppointNums"
              size="small"
              class="button_style"
              v-for="(val, i) in item.totalAppointNums"
              :key="i"
              @click="appointCar(item)"
            >
            {{i >= item.alreadyAppointNums? '可预约': '已预订'}}
            </van-button>
          </div>
        </van-collapse-item>
      </van-collapse>

    </div>
    <div v-if="!(appointList&& appointList.length>0) || (dateList && dateList.length === 0)" class="no_data">
      <div></div>
      <p>暂无数据~</p>
    </div>
    <van-calendar v-model:show="show" :max-date="maxDate" :min-date="minDate" color="#3DB871" @confirm="onConfirmCalendar" />
    <van-popup v-model:show="cascaderShow" round position="bottom">
      <van-cascader
        v-model="field.placeId"
        title="请选择场地"
        :options="placeList"
        :field-names="fieldNames"
        active-color="#3DB871"
        @close="cascaderShow = false"
        @finish="onFinish"
      />
    </van-popup>
  </div>

</template>

<script lang="ts">
import {
  ref,
  computed,
  getCurrentInstance,
  reactive,
  onUnmounted
} from 'vue';
import {
  CellGroup, Cell, Tabs, Tab, Icon, Calendar, Collapse, CollapseItem, Button, Popup, Cascader, Tag, Toast
} from 'vant';
import {
  verifyLogin, setBanBanTitle, banbanCall, getQueryString, getYMDObj, getYMD
} from '@/assets/js/common';
import {
  analogPlaceList, analogPlaceAdvanceDaysInfo, queryStudentProgress, analogAppointmentInfo, analogAppoint
} from './api';

export default {
  setup() {
    setBanBanTitle('预约学车');
    const { proxy } = getCurrentInstance();

    const progress = ref('');
    const field = reactive({
      value: '请选择 >',
      placeId: ''
    });
    const active = ref('');
    const activeNames = ref(0);

    const appointList = ref([]);

    const show = ref(false);
    const cascaderShow = ref(false);
    const fieldNames = {
      text: 'name',
      value: 'id',
      children: 'infos',
    };
    const placeList = ref([]);

    const dateList = ref([]);

    const maxDate = ref(new Date());
    const minDate = ref(new Date());

    const showCalendar = () => {
      show.value = true;
    };

    const appointInfo = async (date: any) => {
      const res = await analogAppointmentInfo({
        placeId: field.placeId,
        appointDate: getYMD(1, date)
      });
      appointList.value = res || [];
      active.value = getYMD(1, date);
    };
    const changeTab = (name: any, title: any) => {
      appointInfo(name);
    };
    const onConfirmCalendar = (value: any) => {
      appointInfo(value);
      show.value = false;
    };

    const getDateList = async (placeId: any) => {
      console.log('placeId', placeId);
      const res: any = await analogPlaceAdvanceDaysInfo({
        placeId,
        appointDate: getQueryString('appointDate') || ''
      });
      dateList.value = res.advanceDates || [];
      if (res.advanceDates && res.advanceDates.length > 0) {
        const maxDateObj = res.advanceDates[res.advanceDates.length - 1] || {};
        const minDateObj = res.advanceDates[0] || {};
        maxDate.value = new Date(maxDateObj.date.toString().replace(/-/g, '/'));
        minDate.value = new Date(minDateObj.date.toString().replace(/-/g, '/'));
        appointInfo(minDateObj.date);
      }
    };

    const getAnalogPlaceList = async () => {
      const res: any = await analogPlaceList();
      console.log('res', res);
      placeList.value = res?.infos || [];
      field.value = '康达尔训练场';
      field.placeId = '549352524109318496';
      getDateList(field.placeId);
    };

    const onFinish = ({ selectedOptions }: any) => {
      cascaderShow.value = false;
      const lastSelected = selectedOptions[selectedOptions.length - 1];
      field.value = lastSelected.name;
      field.placeId = lastSelected.id;
      getDateList(lastSelected.id);
    };

    const getProgress = async () => {
      const studentProgress: any = await queryStudentProgress();
      progress.value = studentProgress?.analogPhaseName || {};
    };

    const transDate = (date: string) => {
      const obj = getYMDObj(date);
      const { month, day } = obj;
      return `${month}-${day}`;
    };

    const transWeek = (date: string) => {
      const dateObj = new Date(date.toString().replace(/-/g, '/'));
      const week = dateObj.getDay();
      return ['日', '一', '二', '三', '四', '五', '六'][week];
    };
    verifyLogin().then(() => {
      getAnalogPlaceList();
      getProgress();
    });

    const appointCar = async (item: any) => {
      const res = await analogAppoint({
        appointDate: active.value,
        placeId: field.placeId,
        placeName: field.value,
        timeRange: item.timeRange
      });
      Toast({
        type: 'success',
        message: '预约成功',
        onClose: () => {
          proxy.$root.$router.replace({
            path: '/my_looking',
          });
        }
      });
    };
    return {
      progress,
      field,
      active,
      changeTab,
      showCalendar,
      onConfirmCalendar,
      show,
      activeNames,
      fieldNames,
      cascaderShow,
      placeList,
      onFinish,
      dateList,
      transDate,
      transWeek,
      maxDate,
      minDate,
      getYMD,
      appointList,
      appointCar
    };
  },
  components: {
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Icon.name]: Icon,
    [Calendar.name]: Calendar,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [Cascader.name]: Cascader,
    [Tag.name]: Tag
  }
};
</script>

<style lang="less" scoped>
  .content{
    background: #f5f3f5;
    min-height: 100%;
    .flex_date{
      display: flex;
      .data_content{
        width: 1.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }
      .tabs_content{
        width: calc(100% - 1.1rem);
        height: 1.2rem;
        /deep/ .van-tab--active{
          background: #F0FFF8;
        }
        /deep/ .van-tab:not(:first-child) ::after{
          content: '';
          position: absolute;
          left: 0;
          width: 0.01rem;
          height: 60%;
          top: 20%;
          background: #E5E5E5;
        }
        /deep/ .van-tabs__wrap{
          height: 1.2rem;
        }
        /deep/ .van-tabs__nav--complete{
          padding: 0px;
        }
        /deep/ .van-tab{
          padding: 0px;
          width: 1.3rem;
          max-width: 1.3rem;
        }
      }
      .tab_content{
        width: 1.3rem;
        text-align: center;
        line-height: 0.28rem;
        font-size: 0.24rem;
        height: 1.2rem;
        padding-top: 0.25rem;
        .can_appoint{
          color: #3DB871;
        }
      }

    }
    .collapse_content{
      padding: 0.2rem;
      .collapse{
        border-radius: 8px;
        &:not(:first-child){
          margin-top: 0.2rem;
        }
        /deep/ .van-collapse-item__title--expanded{
          background: linear-gradient(to bottom, #F0FFF8, #FFFFFF );
        }
      }
      .button_group{
        display: flex;
        flex-wrap: wrap;
        .button_style{
          padding: 10px 20px;
          text-align: center;
          margin: 10px 15px;
        }
      }

    }
    /deep/ .no_data{
      color: #3DB871;
    }
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
