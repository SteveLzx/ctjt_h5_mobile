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
    <g id="训练场17">
      <polyline points="
        ${rotateTransList[0][0]},${rotateTransList[0][1]}
        ${rotateTransList[1][0]},${rotateTransList[1][1]}
        ${rotateTransList[2][0]},${rotateTransList[2][1]}
        ${rotateTransList[3][0]},${rotateTransList[3][1]}
        ${rotateTransList[4][0]},${rotateTransList[4][1]}
      " style="fill:white;stroke:rgb(99,99,99);stroke-width:0.2;"/>
      <polyline points="
        ${rotateTransList[5][0]},${rotateTransList[5][1]}
        ${rotateTransList[6][0]},${rotateTransList[6][1]}
        ${rotateTransList[7][0]},${rotateTransList[7][1]}
        ${rotateTransList[8][0]},${rotateTransList[8][1]}
        ${rotateTransList[9][0]},${rotateTransList[9][1]}
      " style="fill:white;stroke:rgb(99,99,99);stroke-width:0.2;"/>
      <line x1="${rotateTransList[1][0]}" y1="${rotateTransList[1][1]}" x2="${rotateTransList[8][0]}" y2="${rotateTransList[8][1]}"
        stroke-dasharray="0.4,0.4" style="stroke:rgb(99,99,99);stroke-width: 0.2"/>
      <line x1="${rotateTransList[4][0]}" y1="${rotateTransList[4][1]}" x2="${rotateTransList[5][0]}" y2="${rotateTransList[5][1]}"
        stroke-dasharray="0.4,0.4" style="stroke:rgb(99,99,99);stroke-width: 0.2"/>
      <polygon points="
        ${rotateTransList[2][0]},${rotateTransList[2][1]}
        ${rotateTransList[3][0]},${rotateTransList[3][1]}
        ${rotateTransList[6][0]},${rotateTransList[6][1]}
        ${rotateTransList[7][0]},${rotateTransList[7][1]}
      " style="fill:rgb(99,99,99);stroke:rgb(99,99,99);stroke-width: 0.2"/>
      <text text-anchor="middle" dominant-baseline="central" fill="red" transform="translate(${rotateTransText[0]} ${rotateTransText[1]}) scale(0.15 0.15)">17</text>
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
// 坡道
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

    const pointList = [
      [
        9927.169, 9994.368
      ], [
        9928.736, 10001.314
      ], [
        9928.902, 10002.049
      ], [
        9928.947, 10002.252
      ], [
        9929.053, 10002.721
      ], [
        9925.634, 10003.658
      ], [
        9925.493, 10003.044
      ], [
        9925.453, 10002.869
      ], [
        9925.311, 10002.257
      ],
      [
        9923.712, 9995.332
      ]
    ];

    const getLength = ([x1, y1]: any, [x2, y2]: any) => {
      const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      console.log('length', length, [x1, y1], [x2, y2]);
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

    // 顶点数组
    const vertexList = [
      [pointList[0][0], pointList[0][1]],
      [pointList[4][0], pointList[4][1]],
      [pointList[5][0], pointList[5][1]],
      [pointList[9][0], pointList[9][1]],
    ];
    const centerX = (vertexList[0][0] + vertexList[2][0]) / 2;
    const centerY = (vertexList[0][1] + vertexList[2][1]) / 2;

    const center = [Math.round(centerX * 1000) / 1000, Math.round(centerY * 1000) / 1000];

    const textX = (pointList[0][0] + pointList[5][0]) / 2;
    const textY = (pointList[0][1] + pointList[5][1]) / 2;

    const text = [Math.round(textX * 1000) / 1000, Math.round(textY * 1000) / 1000];

    const width = 2 * getLength(vertexList[1], vertexList[2]);
    const height = 2 * getLength(vertexList[0], vertexList[1]);
    const BoxList = getBoxList(vertexList, center);
    const benchmark = getBenchmark(BoxList, center);

    const rotateDeg = getRotateDeg(vertexList[0], vertexList[1]);

    const boxPointList = getTransList(pointList, benchmark);
    const transBoxList = getTransList(BoxList, benchmark);
    const transCenter = getTransPoint(center, benchmark);

    const rotatePointList = boxPointList.map((p: any) => rotatePoint(p, rotateDeg));
    const rotateBoxList = transBoxList.map((p: any) => rotatePoint(p, rotateDeg));
    const rotateCenter = rotatePoint(transCenter, rotateDeg);

    const rotateBenchMark = getBenchmark(rotateBoxList, rotateCenter);
    console.log(1111144);
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
