<template>
  <div class="toptips">{{text}}</div>
</template>
<script>
export default {
  props: {
    text: {
      default: ''
    }
  }
};
</script>
<style lang="less">
.toptips {
  padding: 20px 40px;
  line-height: 50px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 10px;
  position: fixed;
  z-index: 10;
  min-width: 200px;
  max-width: 80%;
  text-align: center;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s;
  top: 40%;
  word-wrap: break-word;
}
</style>
