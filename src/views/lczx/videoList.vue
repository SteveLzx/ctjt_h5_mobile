<template>
  <div class="content">
    <div>
      <van-cell title="推荐学习项目" class="bg_color">
        <template #icon>
          <i class="iconfont studying_icon">&#xe646;</i>
        </template>
      </van-cell>
      <van-collapse v-model="activeName" accordion v-if="resDate[1]">
        <van-collapse-item v-for="(list) in resDate[1]" :key="list.projectLevel" :title="list.projectVideoName" :name="list.projectLevel">
          <div class="flex_content"  v-if="list.projectLevel == activeName">
            <div v-for="(videoInfo,index) in list.children" :key="index" :style="{width: '48%'}">
              <div :style="{height: '130px'}">
                <van-image
                  :style="{
                    width:'100%',
                    height:'100%'
                  }"
                  v-if="nowVideo !==`video_${list.projectLevel}_${index}`"
                  fit="contain"
                  :src="videoInfo.firstPicture"
                  @click="openVideo(videoInfo)"
                />

              </div>
              {{videoInfo.videoDesc}}
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>

    <van-divider :style="{margin: '0.16rem 0',border: 'none' }"  v-if="resDate[2]" />
    <div v-if="resDate[2]">
      <van-cell title="已学习项目" class="bg_color " >
        <template #icon>
          <i class="iconfont studyed_icon">&#xe646;</i>
        </template>
      </van-cell>
      <van-collapse v-model="activeName" accordion>
        <van-collapse-item v-for="(list) in resDate[2]" :key="list.projectLevel" :title="list.projectVideoName" :name="list.projectLevel">
          <div class="flex_content" v-if="list.projectLevel == activeName">
            <div v-for="(videoInfo,index) in list.children" :key="index" :style="{width: '48%'}">
              <div :style="{height: '130px'}">
                <van-image
                  :style="{
                    width:'100%',
                    height:'100%'
                  }"
                  v-if="nowVideo !==`video_${list.projectLevel}_${index}`"
                  fit="contain"
                  :src="videoInfo.firstPicture"
                  @click="openVideo(videoInfo)"
                />
              </div>
              {{videoInfo.videoDesc}}
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>

    <van-divider :style="{margin: '0.16rem 0',border: 'none' }"  v-if="resDate[0]" />
    <div v-if="resDate[0]">
      <van-cell title="未解锁项目" class="bg_color " >
        <template #icon>
          <i class="iconfont unstudy_icon">&#xe646;</i>
        </template>
      </van-cell>
      <van-collapse v-model="activeName" accordion>
        <van-collapse-item v-for="(list) in resDate[0]" :key="list.projectLevel" :title="list.projectVideoName" :name="list.projectLevel">
          <div class="flex_content"  v-if="list.projectLevel == activeName">
            <div v-for="(videoInfo,index) in list.children" :key="index" :style="{width: '48%'}">
              <div :style="{height: '130px'}">
                <van-image
                  :style="{
                    width:'100%',
                    height:'100%'
                  }"
                  v-if="nowVideo !==`video_${list.projectLevel}_${index}`"
                  fit="contain"
                  :src="videoInfo.firstPicture"
                  @click="openVideo(videoInfo)"
                />
              </div>
              {{videoInfo.videoDesc}}
            </div>
          </div>

        </van-collapse-item>

      </van-collapse>
    </div>

    <div class="prism-player" id="J_prismPlayer"></div>
    <jump-service  v-if="showJump" />
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
  Picker
} from 'vant';
import {
  verifyLogin, setBanBanTitle, banbanCall, getQueryString
} from '@/assets/js/common';
// eslint-disable-next-line import/no-unresolved
import Aliplayer from 'Aliplayer';
import { queryTeachingVideo, queryVideoPlayAuth } from './api';
import jumpService from '../xxtz/jumpService.vue';

export default {
  setup() {
    setBanBanTitle('教学视频');
    const { proxy } = getCurrentInstance();
    const showJump = ref(false);

    // 初始化接口返回数据
    const resDate = ref({});
    const video = ref('');
    const activeName = ref('0');
    const nowVideo = ref('');
    const videos = ref([]);
    const player = ref(null);

    // 初始化页面
    const init = async () => {
      let res: any = await queryTeachingVideo();
      res = res || [];
      const lists: any = [];
      res.forEach((list: any) => {
        const {
          placeName, projectLevel, projectVideoName, learnStatus, videoDesc, firstPicture, videoId
        } = list;
        if (lists[list.learnStatus]) {
          if (lists[list.learnStatus][list.projectLevel]) {
            console.log(1111, lists);
            lists[list.learnStatus][list.projectLevel].children.push({
              videoDesc,
              firstPicture,
              videoId
            });
          } else {
            console.log(11112, lists, lists[list.learnStatus][list.projectLevel]);

            lists[list.learnStatus][list.projectLevel] = {
              placeName,
              projectLevel,
              projectVideoName,
              learnStatus,
              children: [
                {
                  videoDesc,
                  firstPicture,
                  videoId
                }
              ]
            };
          }
        } else {
          console.log(11113, lists);
          lists[list.learnStatus] = {};
          lists[list.learnStatus][list.projectLevel] = {
            placeName,
            projectLevel,
            projectVideoName,
            learnStatus,
            children: [
              {
                videoDesc,
                firstPicture,
                videoId
              }
            ]
          };
          if (list.learnStatus === 1) {
            activeName.value = list.projectLevel;
          }
        }
      });

      console.log(1111, lists);
      resDate.value = lists;
      showJump.value = true;
    };

    // 校验登录后查询教练场地信息
    verifyLogin().then(async () => {
      init();
    });

    const openVideo = async (videoInfo: any) => {
      const playInfo: any = await queryVideoPlayAuth({
        timeOut: 300,
        videoId: videoInfo.videoId
      });

      player.value = new Aliplayer({
        id: 'J_prismPlayer',
        // width: '334px',
        // height: '188px',
        autoplay: true,
        useH5Prism: true,
        vid: videoInfo.videoId,
        playauth: playInfo.playAuth,
      }, ((play: any) => {
        play.play();
        play.fullscreenService.requestFullScreen();
      }));

      player.value.on('cancelFullScreen', () => {
        // eslint-disable-next-line no-restricted-globals
        screen.orientation.unlock();
        player.value.pause();
        player.value.dispose();
      });

      player.value.on('requestFullScreen', () => {
        // eslint-disable-next-line no-restricted-globals
        screen.orientation.lock('landscape');
      });
    };

    onUnmounted(() => {
      player.value.dispose();
    });

    return {
      resDate,
      video,
      activeName,
      openVideo,
      nowVideo,
      videos,
      showJump
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
    jumpService
  }
};
</script>

<style lang="less" scoped>
  .content{
    min-height: 100%;
    background: #f3f4fb;
    overflow: hidden;
    .cell_icon{
      vertical-align: sub;
      color: #3db871;
      font-size: 32px;
    }
    .avatar{
      float: left;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-right: 24px;
      background: url('../../assets/images/sprite.png') no-repeat;
      background-size: 545px auto;
      background-position: -17px -208px;
    }
    .top_text{
      margin: 0 32px;
      font-size: 24px;
      color: #666;
      line-height: 72px;
      height: 72px;
    }
    .cell_group_margin{
      margin-top: 24px;
      &:last-child{
        margin-bottom: 24px;
      }
    }
    .cell_icon_call{
      vertical-align: sub;
      color: #3db871;
      font-size: 48px;
    }
    .flex_content{
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;

    }
    .bg_color{
      background-image: linear-gradient(to bottom, #F0FFF8, #FFFFFF);
      &::after{
        border-bottom: none;
      }
    }
    .studying_icon{
      margin-right: 10px;
      color: #FE8A01;
    }
    .studyed_icon{
      margin-right: 10px;
      color: #3DB871;
    }
    .unstudy_icon{
      margin-right: 10px;
      color: #999999;
    }
  }
  .prism-player{
    position: fixed;
    bottom: -100000px;
  }
</style>
