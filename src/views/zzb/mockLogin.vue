<template>
<div class="content">
  <van-form :style="{paddingTop: '1.5rem'}" @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="name"
        name="name"
        label="用户名"
        placeholder="用户名"
        clickable
        right-icon="arrow"
        @click-right-icon="openName"
      />
      <van-field
        v-model="password"
        name="password"
        label="密码"
        placeholder="密码"
        clickable
        right-icon="arrow"
        @click-right-icon="openPassword"
      />
      <van-field name="checked" label="是否教练">
        <template #input>
          <van-switch v-model="checked" size="20" />
        </template>
      </van-field>
    </van-cell-group>
    <div :style="{margin: '1.5rem 0.32rem'}">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</div>

<van-popup v-model:show="namePop" position="bottom">
  <van-picker
    :columns="checked? coachList:studentList"
    :columns-field-names="{ text: 'name'}"
    @confirm="onNameConfirm"
    @cancel="namePop = false"
  >
    <template #option="option">
      {{option.name}} {{option.value}}
    </template>
  </van-picker>
</van-popup>

<van-popup v-model:show="passwordPop" position="bottom">
  <van-picker
    :columns="passwordList"
    @confirm="onPasswordConfirm"
    @cancel="passwordPop = false"
  >
  </van-picker>
</van-popup>
</template>

<script lang="ts">
import {
  ref, reactive, getCurrentInstance,
  onUnmounted
} from 'vue';
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
  Picker,
  Field,
  Form,
  Switch,
  Popup,
} from 'vant';
import {
  verifyLogin, setBanBanTitle, banbanCall, getQueryString
} from '@/assets/js/common';
import $http from '@/assets/js/request';
import { setToken, getToken, removeToken } from '@/assets/js/token_cookie';
import TopTip from '@/components/TopTip';

export default {
  setup() {
    setBanBanTitle('登录');
    const { proxy } = getCurrentInstance();
    const name = ref('');
    const password = ref('');
    const checked = ref(false);

    const namePop = ref(false);
    const coachList = ref([
      { name: '欧阳教练', value: '13798869648' },
      { name: '陈教练', value: '13534252456' },
      { name: '谭教练2', value: '18182046188' },
      { name: '智能教练', value: '13788887777' },
      { name: '杜思思', value: '16675391066' },
      { name: '何建', value: '13410705777' },
      { name: '李教练', value: '18516222693' }
    ]);

    const studentList = ref([
      { name: '唐美芳', value: '13530588568' },
      { name: '曾海燕', value: '13713814897' },
      { name: '郭俊鑫', value: '15989332148' },
      { name: '刘雪莲', value: '17620468983' },
      { name: '陈静', value: '17722569446' },
      { name: '陈凯', value: '18676764732' },
      { name: '林小婷', value: '18820972509' },

    ]);
    const passwordPop = ref(false);
    const passwordList = ref(['123456', 'abc123456', '12345678']);
    const openPassword = () => {
      passwordPop.value = true;
      console.log(11111, 111);
    };

    const onPasswordConfirm = (value: any) => {
      console.log(value);
      password.value = value;
      passwordPop.value = false;
    };

    const openName = () => {
      namePop.value = true;
      console.log(11111, 111);
    };

    const onNameConfirm = (value: any) => {
      console.log(value);
      name.value = value.value;
      namePop.value = false;
    };

    const onSubmit = (values: any) => {
      console.log('submit', values);
      removeToken();
      removeToken('banbanTokenObj');
      removeToken('loginName');
      removeToken('loginMobile');

      let url = '';
      let query;
      let env = 'prod';
      if (process.env.NODE_ENV === 'development' || document.domain.includes('localhost')) {
        env = 'dev';
      }
      // 测试环境
      if (process.env.NODE_ENV === 'test_env' || document.domain.includes('localhost')) {
        env = 'test';
      }
      if (checked.value) {
        url = 'teaching/v1/unitTesting/banbanCoachLogin';
        query = {
          password: password.value,
          userName: name.value,
          env
        };
      } else {
        url = 'teaching/v1/unitTesting/banbanStudentLogin';
        query = {
          account: name.value,
          password: password.value,
          loginType: 'student',
          env
        };
      }
      $http.post(url, query)
        .then((res: any) => {
          if (res.code === '200' || res.code === 1) {
            if (checked.value) {
              setToken(JSON.stringify(res.result || {}), 'banbanTokenObj');

              proxy.$root.$router.push({
                path: '/mockCoach',
              });
            } else {
              setToken(JSON.stringify({
                token: res.result && res.result['ctl-token']
              }), 'banbanTokenObj');
              proxy.$root.$router.push({
                path: '/mockStudent',
              });
            }
          } else {
            TopTip(res.message);
          }
        }).catch((err) => {
          console.log(222, err);
        });
    };

    return {
      name,
      password,
      checked,
      onSubmit,
      openPassword,
      openName,
      coachList,
      studentList,
      namePop,
      onNameConfirm,
      passwordPop,
      onPasswordConfirm,
      passwordList
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
    [Field.name]: Field,
    [Form.name]: Form,
    [Switch.name]: Switch,
    [Popup.name]: Popup,
    [Picker.name]: Picker
  }
};
</script>

<style lang="less" scoped>
  .content{
    min-height: 100%;
    background: #f3f4fb;

  }

</style>
