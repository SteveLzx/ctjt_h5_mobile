<template>
  <div class="pop"></div>
  <div class="popup">
    <div class="header"></div>
    <p class="revise_tit">请确认提交</p>
    <slot></slot>
    <ul class="revise_btns">
      <li @click="$emit('cancel')">取消</li>
      <li @click="$emit('confirm')">{{$attrs.confirmText || '确定'}}</li>
    </ul>
  </div>
</template>
<style lang="less">
.popup{
  position: fixed;
  top: 300px;
  left: 50%;
  margin-left: -300px;
  width: 600px;
  background: #fff;
  border-radius: 8px;
  padding-bottom: 40px;
  z-index: 4;
  overflow: hidden;
  .header{
    background-image: linear-gradient(to right, #84DF93, #3BCB93);
    height: 8px;
  }
  .revise_tit{
    padding: 60px 0 72px;
    line-height: 42px;
    text-align: center;
    color: #000;
    font-size: 42px;
    font-weight: 500;
    span{
      color: #52CD84;
      font-weight: 500;
    }
  }
  .revise_btns{
    overflow: hidden;
    padding: 0 40px;
    li{
      float: left;
      width: 240px;
      line-height: 80px;
      text-align: center;
      border: solid #e5e5e5 2px;
      color: #999;
      font-size: 36px;
      border-radius: 45px;
      &:last-child{
        background: #52CD84;
        color: #fff;
        border: none;
        float: right;
      }
    }
  }
}
</style>
