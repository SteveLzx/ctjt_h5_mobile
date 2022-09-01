<template>
  <div>
    <ul class="tab_box">
      <li class="tab" :class="{'active': item.title === currentTitle}" v-for="(item, index) in tabList"
      @click="questionList = item.list;currentTitle = item.title"
      :key="index">{{item.title}}</li>
    </ul>
    <ul class="list_box">
      <li class="list" :class="{'active': val.show}" v-for="(val, key) in questionList" :key="key">
        <p class="question" @click="val.show = !val.show">{{val.question}}
          <i class="iconfont" v-show="!val.show">&#xe64c;</i>
          <i class="iconfont" v-show="val.show">&#xe64b;</i>
        </p>
        <div class="answer" :class="{'active': val.show}">
          <p v-html="val.anwser" v-if="typeof val.anwser === 'string'"></p>
          <p v-else v-for="(anwser, key) in val.anwser" :key="key">
            <span v-html="anwser.anwser1"></span>
            <img :src="loadImg(anwser.imgIndex)" class="answer_pic" alt=""/>
          </p>
          <img :src="loadImg(val.imgIndex)" class="answer_pic" alt="" v-if="val.imgIndex"/>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import content from './content';

export default {
  setup() {
    const tabList = ref(content);
    const questionList = ref(content[0].list);
    const currentTitle = ref(content[0].title);

    const loadImg = (imgIndex: number) => {
      if (imgIndex === 1) return require('../../../assets/images/handbook/image1.jpeg');
      if (imgIndex === 2) return require('../../../assets/images/handbook/image2.jpeg');
      if (imgIndex === 3) return require('../../../assets/images/handbook/image3.png');
      if (imgIndex === 4) return require('../../../assets/images/handbook/image4.png');
      if (imgIndex === 5) return require('../../../assets/images/handbook/image5.png');
      if (imgIndex === 6) return require('../../../assets/images/handbook/image6.png');
      if (imgIndex === 7) return require('../../../assets/images/handbook/image7.png');
      if (imgIndex === 8) return require('../../../assets/images/handbook/image8.png');
      if (imgIndex === 9) return require('../../../assets/images/handbook/image9.png');
      if (imgIndex === 10) return require('../../../assets/images/handbook/image10.png');
      if (imgIndex === 11) return require('../../../assets/images/handbook/image11.png');
      if (imgIndex === 12) return require('../../../assets/images/handbook/image12.png');
      if (imgIndex === 13) return require('../../../assets/images/handbook/image13.png');
      if (imgIndex === 14) return require('../../../assets/images/handbook/image14.png');
      return '';
    };
    return {
      tabList,
      questionList,
      currentTitle,
      loadImg
    };
  }
};

</script>

<style lang="less" scoped>
.tab_box{
  width: 100%;
  overflow: scroll;
  white-space: nowrap;
  padding: 0 8px;
  position: fixed;
  top: 0;
  background: #fff;
  z-index: 9;
}
.list_box{
  padding-top: 110px;
}
.tab{
  padding: 32px 16px 45px;
  line-height: 32px;
  font-size: 32px;
  color: #000;
  display: inline-block;
  font-weight: 400;
  &.active{
    color: #3DB871;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      left: 50%;
      margin-left: -16px;
      width: 32px;
      height: 4px;
      background: #3db871;
      bottom: 33px;
    }
  }
}
.list{
  transition: all 0.3s;
  max-height: 100px;
  overflow: hidden;
  &.active{
    max-height: 10000px;
  }
  .question{
    padding: 0 24px;
    line-height: 98px;
    font-size: 28px;
    color: #000;
    border-bottom: solid #d8d8d8 2px;
    .iconfont{
      font-size: 28px;
      color: #999;
      float: right;
    }
  }
  .answer{
    color: #666;
    font-size: 28px;
    line-height: 42px;
    padding: 16px 48px 32px 48px;
    border-bottom: solid #d8d8d8 2px;
    opacity: 0;
    transition: opacity 0.3s;
    &.active{
      opacity: 1;
    }
  }
  .answer_pic{
    width: 100%;
  }
}
</style>
