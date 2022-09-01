<template>
  <div class="content" v-if="authFlag && !isSubmit">
    <van-form @submit="onSubmit">
      <van-cell-group>
        <van-field
          v-model="submit.waitDays"
          label="理论课预约限制相关的等待值"
          class="field_style"
          label-class="field_label"
          :rules="[{ required: true, message: '请选择' }]"
        >
          <template #input>
            <van-search class="field_search" v-model.number="submit.waitDays" left-icon="" placeholder="请选择" />
          </template>
        </van-field>
      </van-cell-group>

      <van-cell-group class="cell_group_style">
        <van-field
          v-model.number="submit.isRequire"
          label="理论课是否必修"
          class="field_style"
          label-class="field_label"
          :rules="[{ required: true, message: '请选择' }]"
        >
          <template #input>
            <van-search class="field_search" v-model="showText.isRequireText" readonly left-icon="" right-icon="arrow-down"
            @click-input="showRequirePicker = true" placeholder="请选择" />
          </template>
        </van-field>
        <van-popup v-model:show="showRequirePicker" position="bottom">
          <van-picker
            title="理论课是否必修"
            :columns="requireColumns"
            :columns-field-names="customFieldName"
            @confirm="onRequireConfirm"
            @cancel="showRequirePicker = false"
          />
        </van-popup>
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
import { theoryBasicsConfig, queryTheoryBasicsConfig } from './api';

export default defineComponent({
  setup() {
    setBanBanTitle('其他配置');
    const { proxy } = getCurrentInstance();
    // 登录后没有姓名则无权提交
    const authFlag = ref(true);
    const showText = reactive({
      isRequireText: '',
    });

    const submit = reactive({
      isRequire: null,
      waitDays: '',
    });

    const customFieldName = {
      text: 'label',
    };
    const requireColumns = ref([
      { label: '否', value: 0 },
      { label: '是', value: 1 }
    ]);
    const showRequirePicker = ref(false);
    const onRequireConfirm = (value: any, index: number) => {
      showText.isRequireText = value.label;
      submit.isRequire = value.value;
      showRequirePicker.value = false;
    };

    // 校验登录后查询教练场地信息
    verifyLogin(1).then(async () => {
      if (!getToken('loginName')) { // 登录后没有姓名则无权限
        authFlag.value = false;
        return;
      }
      const res: any = await queryTheoryBasicsConfig();
      const { isRequire, waitDays } = res;
      submit.isRequire = isRequire;
      submit.waitDays = waitDays;
      showText.isRequireText = isRequire ? '是' : '否';
    });

    const onSubmit = async (values: any) => {
      await theoryBasicsConfig(submit);
      Toast({
        type: 'success',
        message: '配置成功',
      });
    };
    return {
      authFlag,
      showText,
      submit,
      requireColumns,
      showRequirePicker,
      onRequireConfirm,
      onSubmit,
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
  /deep/ .van-field__label{
    font-size: 32px;
    color: #000;
    width: 100%;
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
