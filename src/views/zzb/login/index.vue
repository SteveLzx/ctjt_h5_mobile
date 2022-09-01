<template>
  <div class="bg_img"></div>
  <div class="form_box">
    <p class="login_tit">手机快捷登录</p>
    <div class="entry_box">
      <input type="tel" placeholder="请输入手机号" maxlength="11"
      v-model="mobile" @input="(event) => inputChange(event, 1)">
    </div>
    <div class="entry_box box_mar">
      <input type="tel" placeholder="请输入验证码" maxlength="6"
      class="code" v-model="code" @input="(event) => inputChange(event, 2)">
      <p class="get_code" :class="{'active': mobileIsTrue && timer === 60}"
      @click="getCode">{{timer !== 60 ? `${timer}秒后重试` : '获取验证码'}}</p>
    </div>
    <div class="next_btn" @click="submit"
    :class="{'disable': !codeIsTrue || !mobileIsTrue}">下一步</div>
  </div>
</template>

<script lang="ts">
import {
  reactive,
  defineComponent,
  toRefs,
  getCurrentInstance,
  onUnmounted
} from 'vue';
import { useRouter } from 'vue-router';
import { mobileReg, codeReg } from '@/assets/js/util';
import { getToken, setToken } from '@/assets/js/token_cookie';

let codeRequestFlag = false;

export default defineComponent({
  beforeCreate() {
    if (getToken()) {
      const router = useRouter();
      router.replace({ path: '/zzb_take_photo' });
    }
    // setToken('23233');
  },
  setup() {
    const { proxy } = getCurrentInstance();
    let timer: number;
    const comData = reactive({
      mobile: '',
      code: '',
      mobileIsTrue: false,
      codeIsTrue: false,
      timer: 60
    });

    // 监听输入框
    const inputChange = (e: InputEvent, key: number) => {
      const { value } = e.target as HTMLInputElement;
      if (key === 1) {
        // 校验手机号码合法性
        comData.mobileIsTrue = mobileReg.exec(value);
      } else {
        // 请求过验证码而且输入的是正确格式
        comData.codeIsTrue = codeRequestFlag && codeReg.exec(value);
      }
    };

    // 获取验证码
    const getCode = async () => {
      if (!comData.mobileIsTrue || comData.timer !== 60) return;
      // const { mobile, code } = comData;
      // const data = { mobile, code };
      // await proxy.$root.$http.post('getCode', data);
      codeRequestFlag = true;
      // 倒计时，一分钟后重新获取验证码
      timer = setInterval(() => {
        comData.timer -= 1;
        if (comData.timer <= 0) {
          comData.timer = 60;
          clearTimeout(timer);
        }
      }, 1000);
    };

    // 提交验证
    const submit = () => {
      // const { codeIsTrue, mobileIsTrue } = comData;
      // if (!codeIsTrue || !mobileIsTrue) return;
      // const { mobile, code } = comData;
      // const data = { mobile, code };
      // await proxy.$root.$http.post('getCode', data);
      proxy.$root.$router.replace({ path: '/zzb_take_photo' });
    };

    onUnmounted(() => {
      clearInterval(timer);
    });
    return {
      ...toRefs(comData),
      inputChange,
      getCode,
      submit
    };
  }
});

</script>

<style lang="less" scoped>
input::-webkit-input-placeholder {
  color: #B6B6B6;
}

.bg_img{
  height: 630px;
  width: 100%;
  background: url('../../../assets/images/login_bg.png') no-repeat;
  background-size: 100% auto;
}
.form_box{
  position: relative;
  top: -180px;
  background: #fff;
  border-radius: 24px;
  margin: 0 40px;
  padding: 44px 40px 100px;
  box-shadow: 0px 12px 24px -8px rgba(175, 222, 242, 0.61);
  .login_tit{
    text-align: center;
    line-height: 40px;
    color: #138efe;
    font-weight: 500;
    font-size: 40px;
    padding-bottom: 50px;
  }
  .entry_box{
    border-bottom: 1px solid #e5e5e5;
    line-height: 80px;
    margin-bottom: 40px;
    &.box_mar{
      margin-bottom: 64px;
    }
    input{
      font-size: 32px;
      color: #000;
      border: none;
      height: 70px;
      width: 100%;
      &.code{
        width: 70%;
      }
    }
  }
  .get_code{
    float: right;
    font-size: 32px;
    color: #B6B6B6;
    &.active{
      color: #138EFE;
    }
  }
  .next_btn{
    line-height: 94px;
    margin: 0 15px;
    border-radius: 46px;
    text-align: center;
    color: #fff;
    font-size: 36px;
    background-image: linear-gradient(to right, #138EFE, #25B4FD);
    &.disable{
      opacity: 0.4;
    }
  }
}
</style>
