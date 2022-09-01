// pages_zzb/take_photo
<template>
  <div class="bg_box" v-if="!isUploaded">
    <ul class="rules">
      <li>
        <div class="icon_pic"></div>
        <p class="rule">避免强光和逆光</p>
      </li>
      <li>
        <div class="icon_pic"></div>
        <p class="rule">确保录入正脸</p>
      </li>
      <li>
        <div class="icon_pic"></div>
        <p class="rule">取下帽子、口罩、墨镜</p>
      </li>
    </ul>
    <div class="photo_btn">
      <input type="file" class="hidden" capture="user" accept="image/*" @change="onFileChange"/>
      拍照
    </div>
  </div>
  <div class="take_success" v-else-if="isUploaded && !isSuccess">
    <div class="icon_success"></div>
    <p class="success_tip">人脸识别设置失败</p>
    <div class="photo_btn go_back" @click="isSuccess = false">
      <input type="file" class="hidden" capture="user" accept="image/*"/>
      重新拍照
    </div>
  </div>
  <div class="take_success" v-else>
    <div class="icon_success"></div>
    <p class="success_tip">人脸识别设置成功</p>
    <div class="photo_btn go_back" @click="isSuccess = false">返回</div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { compressImg } from '@/assets/js/util';

export default {
  setup() {
    const isSuccess = ref(false);
    const isUploaded = ref(false);

    const onFileChange = async (e: Event) => {
      const file = ((e.target as HTMLInputElement).files as FileList)[0];
      console.log(file.size);
      const data = await compressImg(file);
      console.log(data);
    };
    return {
      isSuccess,
      isUploaded,
      onFileChange
    };
  }
};

</script>

<style lang="less" scoped>
.bg_box{
  width: 100%;
  height: 100%;
  background: rgba(240,240,242,1);
}
.rules{
  padding: 73px 40px 0;
  li{
    padding: 56px 0 56px 50px;
    border-bottom: solid #e5e5e5 1px;
    display: flex;
    &:last-child{
      border: none;
    }
    .icon_pic{
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background: #e5e5e5;
      margin-right: 32px;
    }
    .rule{
      line-height: 180px;
      color: #666;
      font-size: 34px;
      font-weight: 500;
    }
  }
}
.photo_btn{
  line-height: 94px;
  margin: 40px auto 0;
  width: 590px;
  border-radius: 46px;
  text-align: center;
  color: #fff;
  font-size: 36px;
  background-image: linear-gradient(to right, #138EFE, #25B4FD);
  position: relative;
  .hidden{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    opacity: 0;
  }
}
.take_success{
  padding-top: 157px;
  text-align: center;
  .icon_success{
    width: 570px;
    height: 380px;
    margin: 0 auto;
  }
  .success_tip{
    line-height: 59px;
    margin-top: 19px;
    color: #000;
    font-size: 42px;
    font-weight: 500;
  }
  .go_back{
    margin-top: 377px;
  }
}

</style>
