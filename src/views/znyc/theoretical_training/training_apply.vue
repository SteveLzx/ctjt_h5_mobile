<template>
  <div class="content" v-if="authFlag && !isSubmit">
    <van-form @submit="onSubmit">
      <van-cell-group>
        <van-field
          v-model="submit.weekDate"
          label="选择开课日期"
          class="field_style"
          label-class="field_label"
          :rules="[{ required: true, message: '请选择' }]"
        >
          <template #input>
            <van-search class="field_search" v-model="showText.weekDateText" left-icon="" readonly right-icon="notes-o"
              @click-input="showWeekPicker = true" placeholder="请选择" />
          </template>
        </van-field>
        <van-popup v-model:show="showWeekPicker" position="bottom">
          <van-picker
            title="选择开课日期"
            :columns="weekColumns"
            @confirm="onWeekConfirm"
            @cancel="showWeekPicker = false"
          />
        </van-popup>

        <van-field
          v-model="submit.startTime"
          label="选择开始时间"
          class="field_style"
          label-class="field_label"
          :rules="[{ required: true, message: '请选择' }]"
        >
          <template #input>
            <van-search class="field_search" v-model="showText.startTime" left-icon="" readonly right-icon="arrow-down"
              @click-input="showStartPicker = true" placeholder="请选择" />
          </template>
        </van-field>
        <van-popup v-model:show="showStartPicker" position="bottom">
          <van-datetime-picker
            type="time"
            @confirm="onStartConfirm"
            @cancel="showStartPicker = false"
            :max-hour="showText.startLimit"
          />
        </van-popup>

        <van-field
          v-model="submit.endTime"
          label="选择结束时间"
          class="field_style"
          label-class="field_label"
          :rules="[{ required: true, message: '请选择' }]"
        >
          <template #input>
            <van-search class="field_search" v-model="showText.endTime" readonly left-icon="" right-icon="arrow-down"
            @click-input="showEndPicker = true" placeholder="请选择" />
          </template>
        </van-field>
        <van-popup v-model:show="showEndPicker" position="bottom">
          <van-datetime-picker
            type="time"
            @confirm="onEndConfirm"
            @cancel="showEndPicker = false"
            :min-hour="showText.endLimit"
          />
        </van-popup>

        <van-field
          label="可预约总数"
          label-class="field_label"
        >
          <template #input>
            <van-stepper class="field_stepper" v-model="submit.totalAppointNums" integer :default-value="0" :min="0" />
          </template>
        </van-field>
      </van-cell-group>

      <van-cell-group class="cell_group_style">
        <van-field
          v-model.number="submit.isOccupy"
          label="是否占用车辆"
          class="field_style"
          label-class="field_label"
          :rules="[{ required: true, message: '请选择' }]"
        >
          <template #input>
            <van-search class="field_search" v-model="showText.isOccupyText" readonly left-icon="" right-icon="arrow-down"
            @click-input="showOccupyPicker = true" placeholder="请选择" />
          </template>
        </van-field>
        <van-popup v-model:show="showOccupyPicker" position="bottom">
          <van-picker
            title="是否占用车辆"
            :columns="occupyColumns"
            :columns-field-names="customFieldName"
            @confirm="onOccupyConfirm"
            @cancel="showOccupyPicker = false"
          />
        </van-popup>

        <van-field
          v-model="submit.startOccupyTime"
          label="占用开始时间"
          class="field_style"
          label-class="field_label"
          v-if="submit.isOccupy"
          :rules="[{ required: submit.isOccupy, message: '请选择' }]"
        >
          <template #input>
            <van-search class="field_search" v-model="showText.startOccupyTime" readonly left-icon="" right-icon="arrow-down"
             @click-input="showStartOccupyPicker = true" placeholder="请选择" />
          </template>
        </van-field>
        <van-popup v-model:show="showStartOccupyPicker" position="bottom">
          <van-datetime-picker
            type="time"
            @confirm="onStartOccupyConfirm"
            @cancel="showStartOccupyPicker = false"
            :max-hour="showText.startOccupyLimit"
          />
        </van-popup>
        <van-field
          v-model="submit.endOccupyTime"
          label="占用结束时间"
          class="field_style"
          label-class="field_label"
          v-if="submit.isOccupy"
          :rules="[{ required: submit.isOccupy, message: '请选择' }]"
        >
          <template #input>
            <van-search class="field_search" v-model="showText.endOccupyTime" readonly left-icon="" right-icon="arrow-down"
            @click-input="showEndOccupyPicker = true" placeholder="请选择" />
          </template>
        </van-field>
        <van-popup v-model:show="showEndOccupyPicker" position="bottom">
          <van-datetime-picker
            type="time"
            @confirm="onEndOccupyConfirm"
            @cancel="showEndOccupyPicker = false"
            :min-hour="showText.endOccupyLimit"
          />
        </van-popup>

        <van-field
          label="C1占用数量"
          label-class="field_label"
          v-if="submit.isOccupy"
        >
          <template #input>
            <van-stepper class="field_stepper" v-model="submit.c1Num" integer :default-value="0" :min="0" />
          </template>
        </van-field>
        <van-field
          label="C2占用数量"
          label-class="field_label"
          v-if="submit.isOccupy"
        >
          <template #input>
            <van-stepper class="field_stepper" v-model="submit.c2Num" integer :default-value="0" :min="0" />
          </template>
        </van-field>
      </van-cell-group>
      <van-button class="submit_btn" size="large" native-type="submit" color="#26C589">提交</van-button>
    </van-form>
  </div>
    <div class="auth_con" v-if="!authFlag && !isSubmit">
    <img src="../../../assets/images/a_c_auth.png" alt="">
    <p>您没有提交申请的权限，请联系片区经理～</p>
  </div>
</template>

<script lang="ts">
import {
  ref, reactive, defineComponent, getCurrentInstance
} from 'vue';
import {
  Calendar,
  Picker,
  Popup,
  Stepper,
  CellGroup,
  Field,
  Search,
  Toast,
  DatetimePicker,
  Button,
  Form
} from 'vant';
import {
  verifyLogin, setBanBanTitle, getYMD, getQueryString
} from '@/assets/js/common';
import { getToken } from '@/assets/js/token_cookie';
import { addTheoryTime, queryTheoryAppointConfig, updateTheoryTime } from './api';

export default defineComponent({
  setup() {
    setBanBanTitle('理论课申请');
    const { proxy } = getCurrentInstance();
    // 登录后没有姓名则无权提交
    const authFlag = ref(true);
    const showText = reactive({
      weekDateText: '',
      startTime: '',
      endLimit: 1,
      endTime: '',
      startLimit: 22,
      isOccupyText: '',
      startOccupyTime: '',
      endOccupyLimit: 1,
      endOccupyTime: '',
      startOccupyLimit: 22,
    });

    const submit = reactive({
      weekDate: null,
      startTime: '',
      endTime: '',
      isOccupy: null,
      startOccupyTime: '',
      endOccupyTime: '',
      c1Num: 0,
      c2Num: 0,
      totalAppointNums: 0
    });

    const weekColumns = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日']);
    const showWeekPicker = ref(false);
    const onWeekConfirm = (value: string, index: number) => {
      showText.weekDateText = value;
      submit.weekDate = index + 1;
      showWeekPicker.value = false;
    };

    const showStartPicker = ref(false);
    const onStartConfirm = (value: string) => {
      showText.startTime = value;
      const [endLimit] = value.split(':');
      showText.endLimit = Number(endLimit) + 1;
      submit.startTime = `${value}`;

      showStartPicker.value = false;
    };

    const showEndPicker = ref(false);
    const onEndConfirm = (value: string) => {
      console.log(2222);
      showText.endTime = value;
      const [startLimit] = value.split(':');
      showText.startLimit = Number(startLimit) - 1;
      submit.endTime = `${value}`;

      showEndPicker.value = false;
    };

    const customFieldName = {
      text: 'label',
    };
    const occupyColumns = ref([
      { label: '否', value: 0 },
      { label: '是', value: 1 }
    ]);
    const showOccupyPicker = ref(false);
    const onOccupyConfirm = (value: any, index: number) => {
      showText.isOccupyText = value.label;
      submit.isOccupy = value.value;
      submit.startOccupyTime = '';
      submit.endOccupyTime = '';
      submit.c1Num = 0;
      submit.c2Num = 0;
      showText.startOccupyTime = '';
      showText.endOccupyLimit = 1;
      showText.endOccupyTime = '';
      showText.startOccupyLimit = 22;
      showOccupyPicker.value = false;
    };

    const showStartOccupyPicker = ref(false);
    const onStartOccupyConfirm = (value: string) => {
      showText.startOccupyTime = value;
      const [endOccupyLimit] = value.split(':');
      showText.endOccupyLimit = Number(endOccupyLimit) + 1;
      submit.startOccupyTime = `${value}`;

      showStartOccupyPicker.value = false;
    };

    const showEndOccupyPicker = ref(false);
    const onEndOccupyConfirm = (value: string) => {
      console.log(2222);
      showText.endOccupyTime = value;
      const [startOccupyLimit] = value.split(':');
      showText.startOccupyLimit = Number(startOccupyLimit) - 1;
      submit.endOccupyTime = `${value}`;

      showEndOccupyPicker.value = false;
    };

    const transTime = (str: string) => {
      const strList = str.split(':');
      const [hour = '', min = ''] = strList;
      return `${hour}:${min}`;
    };

    // 校验登录后查询教练场地信息
    verifyLogin(1).then(async () => {
      if (!getToken('loginName')) { // 登录后没有姓名则无权限
        authFlag.value = false;
        return;
      }
      if (getQueryString('id')) {
        const query = { id: getQueryString('id') || '' };
        const res: any = await queryTheoryAppointConfig(query);
        const {
          c1Num, c2Num, endOccupyTime = '', endTime = '', isOccupy, startOccupyTime = '', startTime = '', totalAppointNums, weekDate
        } = res;

        showText.weekDateText = weekColumns.value[weekDate - 1];
        showText.startTime = transTime(startTime);
        showText.endTime = transTime(endTime);
        showText.isOccupyText = isOccupy ? '是' : '否';
        showText.startOccupyTime = transTime(startOccupyTime);
        showText.endOccupyTime = transTime(endOccupyTime);

        submit.weekDate = weekDate;
        submit.startTime = startTime;
        submit.endTime = endTime;
        submit.isOccupy = isOccupy;
        submit.startOccupyTime = startOccupyTime;
        submit.endOccupyTime = endOccupyTime;
        submit.c1Num = c1Num;
        submit.c2Num = c2Num;
        submit.totalAppointNums = totalAppointNums;
      }
    });

    const onSubmit = async (values: any) => {
      console.log(1111, values);
      if (submit.isOccupy && (submit.c1Num + submit.c2Num < 0)) {
        Toast('车辆占用数量不能小于0');
        return;
      }
      if (getQueryString('id')) {
        await updateTheoryTime({
          ...submit,
          id: getQueryString('id')
        });
      } else {
        await addTheoryTime(submit);
      }
      Toast({
        type: 'success',
        message: '新增成功',
        onClose: () => {
          proxy.$root.$router.back();
        }
      });
    };
    return {
      authFlag,
      showText,
      submit,
      weekColumns,
      showWeekPicker,
      onWeekConfirm,
      showStartPicker,
      onStartConfirm,
      showEndPicker,
      onEndConfirm,
      occupyColumns,
      showOccupyPicker,
      onOccupyConfirm,
      onSubmit,
      showStartOccupyPicker,
      onStartOccupyConfirm,
      showEndOccupyPicker,
      onEndOccupyConfirm,
      customFieldName
    };
  },
  components: {
    [Calendar.name]: Calendar,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Stepper.name]: Stepper,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Search.name]: Search,
    [DatetimePicker.name]: DatetimePicker,
    [Button.name]: Button,
    [Form.name]: Form
  }
});

</script>

<style lang="less" scoped>
.content{
  min-height: calc(100% - 1.74rem);
  background: #f3f4fb;
  padding: 0.24rem 0rem 1.5rem;
  /deep/ .van-field__label{
    font-size: 32px;
    color: #000;
  }
}
.cell_group_style{
  margin-top: 20px;
}
.field_style{
  display: flex;
  flex-direction: column;
  .field_search{
    flex-grow: 1;
    padding: 0.2rem 0;
    color: #000;
  }
}

.field_stepper{
  width: 100%;
  text-align: right;
}

.submit_btn{
  position: fixed;
  bottom: 0;
  left: 0;
}
.auth_con{
  height: 100%;
  background: #F4F4F4;
  text-align: center;
  img{
    width: 240px;
    height: auto;
    padding-top: 360px;
  }
  p{
    line-height: 40px;
    color: #666;
    font-size: 28px;
    margin-top: 44px;
  }
}
</style>
