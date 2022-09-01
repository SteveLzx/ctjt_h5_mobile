<template >
  <div class="video_content">
    <!-- <video
      id="video"
      class="video"
      controls="controls"
      v-if="video"
      :src="video"
      poster="none"
      autoplay
      webkit-playsinline="true"
      playsinline="true"
      x5-video-player-type="h5"
      x5-video-player-fullscreen="true"
      x-webkit-airplay="true"
      preload="true"
    ></video> -->
    <!-- <div id="dplayer"></div> -->
    <!-- <video id="video" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="none">
    </video> -->
        <!-- <video-player class="video-player vjs-custom-skin"
                      ref="videoPlayer"
                      :playsinline="true"
                      :options="playerOptions">
        </video-player> -->

  </div>
    请先复位，再开始

    <div id="myChart123" :style="{width: '100%', height: '50%'}"></div>
    <div class="font_change" @click="change">开始</div>
    <div class="font_change" @click="reset">复位</div>

    <div id="myChart" :style="{width: '100%', height: '50%'}"></div>

    <!-- <img :style="{width: '6rem',height: '6rem'}" src="../../../assets/images/cjbg/map.svg" alt="" srcset=""> -->

</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  verifyLogin, setBanBanTitle, getYMD, getQueryString
} from '@/assets/js/common';
import { getToken } from '@/assets/js/token_cookie';
import {
  Tabbar,
  TabbarItem
} from 'vant';
import DPlayer from 'dplayer';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import * as echarts from 'echarts';
import axios, { AxiosRequestConfig } from 'axios';
import $ from 'jquery';
import test from './test';

export default {
  setup() {
    const { name } = useRoute();
    // http://localhost:8089/coach/video?src=https://file.test.aicar365.com/linshi/01%E5%85%B3%E4%BA%8E%E6%99%BA%E8%83%BD%E6%95%99%E7%BB%83.mp4

    const video = ref(getQueryString('src'));
    // 登录后没有姓名则无权提交
    const authFlag = ref(true);
    const myChart: any = ref({});
    const myChart1: any = ref({});

    const num: any = ref(5);
    // 校验登录后查询教练场地信息
    verifyLogin(1).then(async () => {
      if (!getToken('loginName')) { // 登录后没有姓名则无权限
        authFlag.value = false;
      }
    });
    const change = () => {
      let counter = 0;

      const option: any = {
        title: {
          text: 'Visit Route',
          left: 'center',
          bottom: 10
        },
        tooltip: {},
        geo: {
          map: 'MacOdrum-LV5-floorplan-web',
          zoom: 2,
          center: [50, 100],
        },
        series: [
        ]
      };
      const timer = setInterval(() => {
        if (counter >= test.length - 1) {
          clearInterval(timer);
        } else {
          console.log(test[counter], test[counter].direction + 90);
          option.series = [
            {
              type: 'scatter',
              geoIndex: 0,
              name: 'Route',
              coordinateSystem: 'geo',
              emphasis: {
                label: {
                  show: false
                }
              },
              markPoint: {
                data: [{
                  name: '1',
                  coord: [test[counter].easternposition as unknown as number - 9900, test[counter].northwardposition as unknown as number - 9900],
                  // eslint-disable-next-line max-len
                  symbol: 'path://M87.1667 3.8333L80.5.5h-60l-6.6667 3.3333L.5 70.5v130l10 10h80l10 -10v-130zM15.5 190.5l15 -20h40l15 20zm75 -65l-15 5v35l15 15zm-80 0l15 5v35l-15 15zm65 0l15 -5v-40l-15 20zm-50 0l-15 -5v-40l15 20zm 65,-55 -15,25 c -15,-5 -35,-5 -50,0 l -15,-25 c 25,-15 55,-15 80,0 z',
                  symbolRotate: Number(test[counter].direction) + 180,
                  symbolSize: [8, 20],
                  animationDuration: 200,
                  animation: true,
                  animationDurationUpdate: 200
                }]
              }
            }
          ];
          counter += 1;
          myChart.value.setOption(option);

          const getTransPoint = ([x1, y1]: any, [x, y]: any) => [Math.round((x1 - x) * 1000) / 1000, Math.round((y1 - y) * 1000) / 1000];
          const rotatePoint = ([x, y]: any, deg: any) => {
            const MathDeg = (deg * Math.PI) / 180;
            const pointX = x * Math.cos(MathDeg) - y * Math.sin(MathDeg);
            const pointY = x * Math.sin(MathDeg) + y * Math.cos(MathDeg);
            return [Math.round(pointX * 1000) / 1000, Math.round(pointY * 1000) / 1000];
          };
          const transText = getTransPoint([test[counter].easternposition, test[counter].northwardposition], [9930.269, 9984.151]);
          const rotateText = rotatePoint(transText, 12.90155568536224);
          const rotateTransText = getTransPoint(rotateText, [0, 0]);
          console.log(888888, test[counter].direction, 103.28636977454244);
          const option1 = {
            title: {
              text: 'Visit Route',
              left: 'center',
              bottom: 10
            },
            tooltip: {},
            geo: {
              map: 'maps',
              zoom: 2,
              // center: [10, 10],
            },
            series: [
              {
                type: 'scatter',
                geoIndex: 0,
                name: 'Route',
                coordinateSystem: 'geo',
                emphasis: {
                  label: {
                    show: false
                  }
                },
                markPoint: {
                  data: [{
                    name: '1',
                    coord: rotateTransText,
                    // eslint-disable-next-line max-len
                    symbol: 'path://M87.1667 3.8333L80.5.5h-60l-6.6667 3.3333L.5 70.5v130l10 10h80l10 -10v-130zM15.5 190.5l15 -20h40l15 20zm75 -65l-15 5v35l15 15zm-80 0l15 5v35l-15 15zm65 0l15 -5v-40l-15 20zm-50 0l-15 -5v-40l15 20zm 65,-55 -15,25 c -15,-5 -35,-5 -50,0 l -15,-25 c 25,-15 55,-15 80,0 z',
                    symbolRotate: Number(test[counter].direction) - 12.90155568536224 + 180,
                    symbolSize: [30, 70],
                    animation: false
                  }]
                }
              }
            ]
          };
          myChart1.value.setOption(option1);
        }
      }, 200);
    };

    const reset = () => {
      const option: any = {
        title: {
          text: 'Visit Route',
          left: 'center',
          bottom: 10
        },
        tooltip: {},
        geo: {
          map: 'MacOdrum-LV5-floorplan-web',
          zoom: 2,
          center: [50, 100],
        },
        series: [
        ]
      };
      option.series = [
        {
          type: 'scatter',
          geoIndex: 0,
          name: 'Route',
          coordinateSystem: 'geo',
          emphasis: {
            label: {
              show: false
            }
          },
          markPoint: {
            data: [{
              name: '1',
              coord: [test[0].easternposition as unknown as number - 9900, test[0].northwardposition as unknown as number - 9900],
              // eslint-disable-next-line max-len
              symbol: 'path://M87.1667 3.8333L80.5.5h-60l-6.6667 3.3333L.5 70.5v130l10 10h80l10 -10v-130zM15.5 190.5l15 -20h40l15 20zm75 -65l-15 5v35l15 15zm-80 0l15 5v35l-15 15zm65 0l15 -5v-40l-15 20zm-50 0l-15 -5v-40l15 20zm 65,-55 -15,25 c -15,-5 -35,-5 -50,0 l -15,-25 c 25,-15 55,-15 80,0 z',
              symbolRotate: Number(test[0].direction) + 180,
              symbolSize: [8, 20],
              animation: false,
            }]
          }
        }
      ];
      myChart.value.setOption(option);

      const getTransPoint = ([x1, y1]: any, [x, y]: any) => [Math.round((x1 - x) * 1000) / 1000, Math.round((y1 - y) * 1000) / 1000];
      const rotatePoint = ([x, y]: any, deg: any) => {
        const MathDeg = (deg * Math.PI) / 180;
        const pointX = x * Math.cos(MathDeg) - y * Math.sin(MathDeg);
        const pointY = x * Math.sin(MathDeg) + y * Math.cos(MathDeg);
        return [Math.round(pointX * 1000) / 1000, Math.round(pointY * 1000) / 1000];
      };
      const transText = getTransPoint([test[0].easternposition, test[0].northwardposition], [9930.269, 9984.151]);
      const rotateText = rotatePoint(transText, 12.90155568536224);
      const rotateTransText = getTransPoint(rotateText, [0, 0]);
      console.log(888888, test[0].direction, 103.28636977454244);
      const option1 = {
        title: {
          text: 'Visit Route',
          left: 'center',
          bottom: 10
        },
        tooltip: {},
        geo: {
          map: 'maps',
          zoom: 2,
          // center: [10, 10],
        },
        series: [
          {
            type: 'scatter',
            geoIndex: 0,
            name: 'Route',
            coordinateSystem: 'geo',
            emphasis: {
              label: {
                show: false
              }
            },
            markPoint: {
              data: [{
                name: '1',
                coord: rotateTransText,
                // eslint-disable-next-line max-len
                symbol: 'path://M87.1667 3.8333L80.5.5h-60l-6.6667 3.3333L.5 70.5v130l10 10h80l10 -10v-130zM15.5 190.5l15 -20h40l15 20zm75 -65l-15 5v35l15 15zm-80 0l15 5v35l-15 15zm65 0l15 -5v-40l-15 20zm-50 0l-15 -5v-40l15 20zm 65,-55 -15,25 c -15,-5 -35,-5 -50,0 l -15,-25 c 25,-15 55,-15 80,0 z',
                symbolRotate: Number(test[0].direction) - 12.90155568536224 + 180,
                symbolSize: [30, 70],
                animation: false
              }]
            }
          }
        ]
      };
      myChart1.value.setOption(option1);
    };

    onMounted(() => {
      const chartDom: HTMLElement = document.getElementById('myChart123') as HTMLElement;
      myChart.value = echarts.init(chartDom);
      let option: any;

      $.get(
        // `${ROOT_PATH}/data/asset/geo/MacOdrum-LV5-floorplan-web.svg`,
        require('../../../assets/images/cjbg/map.svg')
      ).then((svg: any) => {
        // [47, 91]  100 200 6 6
        echarts.registerMap('MacOdrum-LV5-floorplan-web', { svg });
        option = {
          title: {
            text: 'Visit Route',
            left: 'center',
            bottom: 10
          },
          tooltip: {},
          geo: {
            map: 'MacOdrum-LV5-floorplan-web',
            zoom: 2,
            center: [40, 73.838],
          },
          series: [
            {
              type: 'scatter',
              geoIndex: 0,
              name: 'Route',
              coordinateSystem: 'geo',
              emphasis: {
                label: {
                  show: false
                }
              },
              markPoint: {
                data: [{
                  name: '1',
                  coord: [48, 94],
                  // eslint-disable-next-line max-len
                  symbol: 'path://M87.1667 3.8333L80.5.5h-60l-6.6667 3.3333L.5 70.5v130l10 10h80l10 -10v-130zM15.5 190.5l15 -20h40l15 20zm75 -65l-15 5v35l15 15zm-80 0l15 5v35l-15 15zm65 0l15 -5v-40l-15 20zm-50 0l-15 -5v-40l15 20zm 65,-55 -15,25 c -15,-5 -35,-5 -50,0 l -15,-25 c 25,-15 55,-15 80,0 z',
                  symbolRotate: 13,
                  symbolSize: [6, 16],
                  animation: false
                }]
              }
            }
          ]
        };
        myChart.value.setOption(option);
      });

      const chartDom1: HTMLElement = document.getElementById('myChart') as HTMLElement;
      myChart1.value = echarts.init(chartDom1);
      let option1: any;

      $.get(
        // `${ROOT_PATH}/data/asset/geo/MacOdrum-LV5-floorplan-web.svg`,
        require('../../../assets/images/cjbg/maps.svg')
      ).then((svg: any) => {
        // [47, 91]  100 200 6 6
        echarts.registerMap('maps', { svg });
        option1 = {
          title: {
            text: 'Visit Route',
            left: 'center',
            bottom: 10
          },
          tooltip: {},
          geo: {
            map: 'maps',
            zoom: 2,
            // center: [10, 10],
          },
          series: [
            {
              type: 'scatter',
              geoIndex: 0,
              name: 'Route',
              coordinateSystem: 'geo',
              emphasis: {
                label: {
                  show: false
                }
              },
              markPoint: {
                data: [{
                  name: '1',
                  coord: [10, 10],
                  // eslint-disable-next-line max-len
                  symbol: 'path://M87.1667 3.8333L80.5.5h-60l-6.6667 3.3333L.5 70.5v130l10 10h80l10 -10v-130zM15.5 190.5l15 -20h40l15 20zm75 -65l-15 5v35l15 15zm-80 0l15 5v35l-15 15zm65 0l15 -5v-40l-15 20zm-50 0l-15 -5v-40l15 20zm 65,-55 -15,25 c -15,-5 -35,-5 -50,0 l -15,-25 c 25,-15 55,-15 80,0 z',
                  symbolRotate: 13,
                  symbolSize: [8, 20],
                  animation: false
                }]
              }
            }
          ]
        };
        myChart1.value.setOption(option1);
      });

      window.onresize = function () { // 自适应大小
        myChart.value.resize();
        myChart1.value.resize();
      };
    });

    return {
      authFlag,
      video,
      change,
      reset
    };
  },
  components: {

  },
};

</script>

<style lang="less" scoped>
.video_content{

  .video{
    width: 100%;
  }
}
.demo{
    display: inline-block;
    width: 600px;
    height: 338px;
    text-align: center;
    line-height: 100px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }
  .font_change{
    font-family: "站酷快乐体2016修订版";
  }
</style>
