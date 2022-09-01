<template>
<div class="content" :style="{paddingTop: '0.48rem'}">
  <van-cell-group inset>
    <van-cell title="车辆占用" is-link url="/coach/allocation_cell_group" />
    <van-cell title="预约进度" is-link url="/coach/sub_progress" />
    <van-cell title="我的学员" is-link url="/coach/allStudent" />

    <van-cell title="呼叫列表" is-link url="/coach/callList" />
    <van-cell title="学时管理" is-link url="/coach/managementCell" />
    <van-cell title="消息列表" is-link url="/coach/messageList" />
    <van-cell title="批复列表" is-link url="/coach/approvalList" />
    <van-cell title="模拟机进度" is-link url="/coach/simulator_cell_group" />
    <van-cell title="理论课培训" is-link url="/coach/training_cell_group" />
    <van-cell title="理论课学员名单" is-link url="/coach/training_name_list" />
    <van-cell title="理论课签到" is-link url="/coach/training_sign_list" />

    <van-cell title="test" is-link url="/coach/video" />
  </van-cell-group>
</div>

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
  Switch
} from 'vant';
import {
  verifyLogin, setBanBanTitle, banbanCall, getQueryString
} from '@/assets/js/common';
import $http from '@/assets/js/request';
import { setToken, getToken, removeToken } from '@/assets/js/token_cookie';

export default {
  setup() {
    setBanBanTitle('教练端');
    const { proxy } = getCurrentInstance();
    const name = ref('');
    const password = ref('');
    const checked = ref(false);

    const openPassword = () => {
      console.log(11111, 111);
    };

    const openName = () => {
      console.log(11111, 111);
    };

    const onSubmit = (values: any) => {
      console.log('submit', values);
      let url = '';
      let query;
      if (checked.value) {
        url = 'http://app.test.chelizitech.com/api/coach/Login/CheckLogin';
        query = {

          password: password.value,
          hasUrl: true,
          userName: name.value,
        };
      } else {
        url = 'http://app.uat.chetailian.net/api/auth/outer/sysAuth/v1/login.pass';
        query = {
          account: name.value,
          password: password.value,
          loginType: 'student',
          hasUrl: true
        };
      }

      $http.post(url, query)
        .then(res => {
          console.log(1111, res);
        }).catch((err) => {
          console.log(222, err);
          setToken(JSON.stringify(err.result), 'banbanTokenObj');
        });
      console.log(name, password, checked);
    };

    return {
      name,
      password,
      checked,
      onSubmit,
      openPassword,
      openName
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
    [Switch.name]: Switch
  }
};
</script>

<style lang="less" scoped>
  .content{
    min-height: 100%;
    background: #f3f4fb;

  }

</style>
