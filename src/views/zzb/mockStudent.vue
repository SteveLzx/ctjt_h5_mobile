<template>
<div class="content" :style="{paddingTop: '0.48rem'}">
  <van-cell-group inset>
    <van-cell title="我的预约" is-link url="/my_looking" />
    <van-cell title="练习报告" is-link url="/reportList" />
    <van-cell title="练车记录" is-link url="/my_looking?isReplace=0&tabFlag=2" />
    <van-cell title="服务监督" is-link url="/serviceSupervision" />
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
    setBanBanTitle('学员端');
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
