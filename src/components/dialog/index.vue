/**
* @author XuZiYu
* @date 2019/7/5
* @time 15:39
*/
<template>
  <div class="dialog-wrap">
    <div class="mask" v-if="value.visible" @click="onWarp" @touchmove.prevent></div>
    <transition name="dialog-transition">
      <div class="dialog-content" v-if="value.visible" :style="dialogStyle">
        <!-- <img v-if="value.close" class="close" src="@/assert/icon_smgb.png" alt="" @click="value.visible = false"> -->
        <h2 v-if="value.title" class="title">{{value.title}}</h2>
        <p v-if="value.content" v-html="value.content"></p>
        <slot name="title"></slot>
        <slot name="content"></slot>
        <div class="btn">
          <van-button class="btn-left" @click.stop="value.leftBtnMethod" v-if="value.leftBtnName">
            {{value.leftBtnName}}
          </van-button>
          <van-button class="btn-right" @click.stop="value.rightBtnMethod" :loading="loading" v-if="value.rightBtnName">
            {{value.rightBtnName}}
          </van-button>
          <van-button class="btn-one" @click.stop="value.oneBtnMethod" :loading="loading" v-if="value.oneBtnName">
            {{value.oneBtnName}}
          </van-button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { Button } from 'vant';

export default {
  name: 'ctl-dialog',
  components: {
    [Button.name]: Button
  },
  props: ['modelValue', 'loading', 'dialogStyle'],
  methods: {
    onWarp() {
      if (typeof this.value.onWarp === 'function') {
        this.value.onWarp();
      }
    }
  },
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:value', value);
      }
    }
  }
};
</script>

<style scoped lang="less">

  .dialog-transition-enter-active, .dialog-transition-leave-active {
    transition: transform .3s;
  }
  .dialog-transition-enter, .dialog-transition-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translate(-50%, -50%) scale(0) !important;
  }

  .dialog-wrap{
    overflow: hidden;
  }

  .mask {
    background: rgba(0, 0, 0, 0.4);
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 9;
  }

  .dialog-content {
    position: fixed;
    display: flex;
    flex-direction: column;
    left: 50%;
    top: 50%;
    z-index: 10;
    width: 70%;
    min-width: 5rem;
    transform: translate(-50%,-50%) scale(1);
    transform-origin: center;
    padding: 20px 0;
    background: #ffffff;
    border-radius: 10px;
    box-sizing: border-box;
    min-height: 2.5rem;
    justify-content: space-around;
    .close{
      position: absolute;
      width: 30px;
      height: 30px;
      top: -45px;
      right: 0;
    }

    h2 {
      font-size: 24px;

      font-weight: 600;
      text-align: center;
      line-height: 1;
      margin: 0;
      color: rgba(51, 51, 51, 1);
    }

    p {
      margin-top: 25px;
      font-size: 15px;

      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      padding: 0 15px;
      text-align: center;
    }

    .btn {
      margin-top: 25px;
      display: flex;
      padding: 0 20px;
      justify-content: space-around;
      align-items: center;
    }

    .btn-left {
      width: 200px;
      height: 60px;
      border-radius: 30px;
      border: 1px solid rgba(153, 153, 153, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 17px;
      line-height: 1;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }

    .btn-right {
      width: 200px;
      height: 60px;
      background: rgba(83, 203, 133, 1);
      border-radius: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      font-size: 17px;
      line-height: 1;
      font-weight: 400;
      padding: 0;
      color: rgba(255, 255, 255, 1);
    }
    .btn-one{
      width: 100%;
      height: 43px;
      background: rgba(83, 203, 133, 1);
      border-radius: 21.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      font-size: 17px;
      line-height: 1;
      font-weight: 400;
      padding: 0;
      color: rgba(255, 255, 255, 1);
    }
    .title{
      font-size: 32px;
      font-weight: 700;
    }
  }
</style>
