<template >
  <div>
    <div class="text_center">map code</div>
    <div>
      <xmp>
        {{`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}px" height="${height}px"
  viewBox="0 0 ${ width} ${height}"
  version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>btnthree</title>
    <g id="训练场1">
      <line x1="${rotateTransList[0][0]}" y1="${rotateTransList[0][1]}" x2="${rotateTransList[1][0]}" y2="${rotateTransList[1][1]}" style="stroke:rgb(99,99,99);stroke-width: 0.2"/>
      <polyline points="
        ${rotateTransList[2][0]},${rotateTransList[2][1]}
        ${rotateTransList[3][0]},${rotateTransList[3][1]}
        ${rotateTransList[4][0]},${rotateTransList[4][1]}
        ${rotateTransList[5][0]},${rotateTransList[5][1]}
        ${rotateTransList[6][0]},${rotateTransList[6][1]}
        ${rotateTransList[7][0]},${rotateTransList[7][1]}"
        style="fill:white;stroke:rgb(99,99,99);stroke-width:0.2"/>
      <line x1="${rotateTransList[0][0]}" y1="${rotateTransList[0][1]}" x2="${rotateTransList[7][0]}" y2="${rotateTransList[7][1]}"
        stroke-dasharray="0.4,0.4" style="stroke:rgb(99,99,99);stroke-width: 0.2"/>
      <line x1="${rotateTransList[1][0]}" y1="${rotateTransList[1][1]}" x2="${rotateTransList[2][0]}" y2="${rotateTransList[2][1]}"
        stroke-dasharray="0.4,0.4" style="stroke:rgb(99,99,99);stroke-width: 0.2"/>
      <line x1="${rotateTransList[3][0]}" y1="${rotateTransList[3][1]}" x2="${rotateTransList[6][0]}" y2="${rotateTransList[6][1]}"
        stroke-dasharray="0.4,0.4" style="stroke:rgb(99,99,99);stroke-width: 0.2"/>
      <text text-anchor="middle" dominant-baseline="central" fill="red" transform="translate(${rotateTransText[0]} ${rotateTransText[1]}) scale(0.15 0.15)">1</text>
    </g>
</svg>
        `}}
      </xmp>
    </div>
<div>第一标准点: {{benchmark}}</div>
<div>第二标准点: {{rotateBenchMark}}</div>

<div>校正角度: {{rotateDeg}}</div>

  </div>
</template>

<script lang="ts">
// 倒车入库，侧方位
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

export default {
  setup() {
    const { name } = useRoute();
    // http://localhost:8089/coach/video?src=https://file.test.aicar365.com/linshi/01%E5%85%B3%E4%BA%8E%E6%99%BA%E8%83%BD%E6%95%99%E7%BB%83.mp4

    const video = ref(getQueryString('src'));
    // 登录后没有姓名则无权提交
    const authFlag = ref(true);
    const myChart: any = ref({});

    // 倒库1
    // const pointList = [
    //   [
    //     9980.482, 9997.980
    //   ], [
    //     9966.564, 10005.569
    //   ], [
    //     9969.842, 10011.569
    //   ], [
    //     9975.724, 10008.349
    //   ], [
    //     9978.259, 10012.891
    //   ], [
    //     9980.409, 10011.741
    //   ], [
    //     9977.895, 10007.202
    //   ], [
    //     9983.773, 10003.984
    //   ]
    // ];

    // 倒库2
    // const pointList = [
    //   [
    //     9903.560, 10049.699
    //   ], [
    //     9918.328, 10044.011
    //   ], [
    //     9915.786, 10037.627
    //   ], [
    //     9909.544, 10040.059
    //   ], [
    //     9907.607, 10035.248
    //   ], [
    //     9905.366, 10036.111
    //   ], [
    //     9907.272, 10040.931
    //   ], [
    //     9900.989, 10043.362
    //   ]
    // ];

    // 倒库3
    // const pointList = [
    //   [
    //     9961.328, 10010.357
    //   ], [
    //     9969.043, 10024.231
    //   ], [
    //     9975.056, 10020.911
    //   ], [
    //     9971.788, 10015.079
    //   ], [
    //     9976.351, 10012.585
    //   ], [
    //     9975.208, 10010.451
    //   ], [
    //     9970.607, 10012.936
    //   ], [
    //     9967.345, 10007.080
    //   ]
    // ];

    // 倒库4
    // const pointList = [
    //   [
    //     9978.946, 10020.870
    //   ], [
    //     9992.844, 10013.206
    //   ], [
    //     9989.505, 10007.184
    //   ], [
    //     9983.639, 10010.418
    //   ], [
    //     9981.120, 10005.875
    //   ], [
    //     9978.979, 10007.060
    //   ], [
    //     9981.477, 10011.592
    //   ], [
    //     9975.610, 10014.822
    //   ]
    // ];

    // 倒库5
    // const pointList = [
    //   [
    //     9998.012, 10008.384
    //   ], [
    //     9990.321, 9994.485
    //   ], [
    //     9984.311, 9997.791
    //   ], [
    //     9987.557, 10003.655
    //   ], [
    //     9983.010, 10006.168
    //   ], [
    //     9984.195, 10008.329
    //   ], [
    //     9988.749, 10005.805
    //   ], [
    //     9991.972, 10011.692
    //   ]
    // ];

    // 倒库6
    // const pointList = [
    //   [
    //     9894.001, 10060.302
    //   ], [
    //     9908.748, 10054.561
    //   ], [
    //     9906.121, 10048.226
    //   ], [
    //     9899.897, 10050.699
    //   ], [
    //     9897.903, 10045.880
    //   ], [
    //     9895.649, 10046.736
    //   ], [
    //     9897.614, 10051.578
    //   ], [
    //     9891.373, 10053.967
    //   ]
    // ];

    // 侧方7
    // const pointList = [
    //   [
    //     9946.503, 10032.002
    //   ], [
    //     9934.558, 10038.245
    //   ], [
    //     9936.199, 10041.431
    //   ], [
    //     9940.168, 10039.339
    //   ], [
    //     9941.342, 10041.559
    //   ], [
    //     9948.394, 10037.870
    //   ], [
    //     9947.192, 10035.677
    //   ], [
    //     9948.137, 10035.170
    //   ]
    // ];

    // 侧方8
    // const pointList = [
    //   [
    //     9912.837, 10052.998
    //   ], [
    //     9925.357, 10048.140
    //   ], [
    //     9924.091, 10044.827
    //   ], [
    //     9919.544, 10046.548
    //   ], [
    //     9918.622, 10044.290
    //   ], [
    //     9911.260, 10047.128
    //   ], [
    //     9912.230, 10049.381
    //   ], [
    //     9911.441, 10049.703
    //   ]
    // ];

    // 侧方9
    // const pointList = [
    //   [
    //     9920.093, 10036.984
    //   ], [
    //     9932.432, 10032.090
    //   ], [
    //     9931.214, 10028.797
    //   ], [
    //     9926.773, 10030.513
    //   ], [
    //     9925.904, 10028.219
    //   ], [
    //     9918.598, 10031.021
    //   ], [
    //     9919.403, 10033.341
    //   ], [
    //     9918.663, 10033.614
    //   ]
    // ];

    // 侧方22
    const pointList = [
      [
        9954.565, 10011.465
      ], [
        9962.043, 10024.920
      ], [
        9965.152, 10023.250
      ], [
        9962.811, 10019.006
      ], [
        9965.003, 10017.825
      ], [
        9961.174, 10010.911
      ], [
        9958.986, 10012.098
      ], [
        9957.698, 10009.762
      ]
    ];

    const getLength = ([x1, y1]: any, [x2, y2]: any) => {
      const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      console.log('length', length);
      return Math.round(length * 1000) / 1000;
    };

    const getBoxList = (list: any, [x, y]: any) => list.map(([x1, y1]: any) => {
      const px = x1 + (x1 - x);
      const py = y1 + (y1 - y);
      return [Math.round(px * 1000) / 1000, Math.round(py * 1000) / 1000];
    });

    const rotatePoint = ([x, y]: any, deg: any) => {
      const MathDeg = (deg * Math.PI) / 180;
      const pointX = x * Math.cos(MathDeg) - y * Math.sin(MathDeg);
      const pointY = x * Math.sin(MathDeg) + y * Math.cos(MathDeg);
      return [Math.round(pointX * 1000) / 1000, Math.round(pointY * 1000) / 1000];
    };

    const getTransList = (list: any, [x, y]: any) => list.map(([x1, y1]: any) => [Math.round((x1 - x) * 1000) / 1000, Math.round((y1 - y) * 1000) / 1000]);

    const getTransPoint = ([x1, y1]: any, [x, y]: any) => [Math.round((x1 - x) * 1000) / 1000, Math.round((y1 - y) * 1000) / 1000];

    const getRotateDeg = ([x1, y1]: any, [x2, y2]: any) => {
      // [x1, y1]: center, [x2, y2]: text
      const tan = (y2 - y1) / (x2 - x1);
      const deg = (360 * Math.atan(tan)) / (2 * Math.PI);
      if (x2 >= x1 && y2 >= y1) {
        console.log(1);
        return 180 + 90 - deg;
      }
      if (x2 >= x1 && y2 < y1) {
        console.log(2);
        return 270 - deg;
      }
      if (x2 < x1 && y2 >= y1) {
        console.log(3);
        return 90 - deg;
      }
      if (x2 < x1 && y2 < y1) {
        console.log(4);
        return 90 - deg;
      }
      return 90 - deg;
    };

    const getBenchmark = (list: any, [x, y]: any) => {
      const filterList = list.filter(([x1, y1]: any) => x > x1 && y > y1);
      console.log(filterList, list, [x, y]);
      return filterList[0];
    };

    const vertex3X = pointList[7][0] + pointList[5][0] - pointList[6][0];
    const vertex3Y = pointList[7][1] + pointList[5][1] - pointList[6][1];

    const vertex4X = pointList[2][0] + pointList[4][0] - pointList[3][0];
    const vertex4Y = pointList[2][1] + pointList[4][1] - pointList[3][1];

    // 顶点数组
    const vertexList = [
      [pointList[0][0], pointList[0][1]],
      [pointList[1][0], pointList[1][1]],
      [Math.round(vertex4X * 1000) / 1000, Math.round(vertex4Y * 1000) / 1000],
      [Math.round(vertex3X * 1000) / 1000, Math.round(vertex3Y * 1000) / 1000],
    ];

    const centerX = (vertexList[0][0] + vertexList[2][0]) / 2;
    const centerY = (vertexList[0][1] + vertexList[2][1]) / 2;

    const center = [Math.round(centerX * 1000) / 1000, Math.round(centerY * 1000) / 1000];

    const textX = (pointList[0][0] + pointList[2][0]) / 2;
    const textY = (pointList[0][1] + pointList[2][1]) / 2;

    const text = [Math.round(textX * 1000) / 1000, Math.round(textY * 1000) / 1000];

    const width = 2 * getLength(vertexList[0], vertexList[1]);
    const height = 2 * getLength(vertexList[0], vertexList[3]);
    const BoxList = getBoxList(vertexList, center);
    const benchmark = getBenchmark(BoxList, center);

    const rotateDeg = getRotateDeg(center, text);

    const boxPointList = getTransList(pointList, benchmark);
    const transBoxList = getTransList(BoxList, benchmark);
    const transCenter = getTransPoint(center, benchmark);

    const rotatePointList = boxPointList.map((p: any) => rotatePoint(p, rotateDeg));
    const rotateBoxList = transBoxList.map((p: any) => rotatePoint(p, rotateDeg));
    const rotateCenter = rotatePoint(transCenter, rotateDeg);

    const rotateBenchMark = getBenchmark(rotateBoxList, rotateCenter);

    const rotateTransList = getTransList(rotatePointList, rotateBenchMark);

    const transText = getTransPoint(text, benchmark);
    const rotateText = rotatePoint(transText, rotateDeg);
    const rotateTransText = getTransPoint(rotateText, rotateBenchMark);

    console.log('pointList', pointList);
    console.log('vertexList', vertexList);
    console.log('center', center);
    console.log('text', text);

    console.log('width', width);
    console.log('height', height);
    console.log('boxPointList', boxPointList);
    console.log('rotateDeg', rotateDeg);
    console.log('rotateBoxList', rotateBoxList);
    console.log('rotateBenchMark', rotateBenchMark);
    console.log('rotateCenter', rotateCenter);
    console.log('rotatePointList', rotatePointList);

    console.log('transCenter', transCenter);
    console.log('benchmark', benchmark);

    // const direction;
    return {
      rotateTransList,
      width,
      height,
      rotateTransText,
      // rotatePointList,
      rotateBenchMark,
      benchmark,
      rotateDeg,
      // rotateText
    };
  },
  components: {

  },
};

</script>

<style lang="less" scoped>
.text_center{
  text-align: center;
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
