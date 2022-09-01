import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router';

const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: '/page_404'
  },
  {
    path: '/',
    redirect: '/page_404'
  },
  {
    path: '/page_404',
    name: 'Page404',
    component: () => import('@/views/404.vue'),
    meta: {
      title: '404',
    }
  },
  {
    path: '/zzb_login',
    name: 'ZzbLogin',
    component: () => import('@/views/zzb/login/index.vue'),
    meta: {
      title: '登录',
    }
  },
  {
    path: '/zzb_take_photo',
    name: 'ZzbTakePhoto',
    component: () => import('@/views/zzb/take_photo/index.vue'),
    meta: {
      title: '拍照',
    }
  },
  {
    path: '/appoint_car',
    name: 'AppointCar',
    component: () => import('@/views/znyc/appoint_car/index.vue'),
    meta: {
      title: '预约学车',
      keepAlive: true
    }
  },
  {
    path: '/learning_progress',
    name: 'LearningProgress',
    component: () => import('@/views/znyc/learning_progress/index.vue'),
    meta: {
      title: '学习进度',
    }
  },
  {
    path: '/my_looking',
    name: 'MyLooking',
    component: () => import('@/views/znyc/my_looking/index.vue'),
    meta: {
      title: '预约练车记录',
    }
  },
  {
    path: '/handbook',
    name: 'Handbook',
    component: () => import('@/views/znyc/handbook/index.vue'),
    meta: {
      title: '使用手册',
    }
  },
  { // 教练端查看预约进度
    path: '/coach/sub_progress',
    name: 'SubProgress',
    component: () => import('@/views/znyc/coach/sub_progress.vue'),
    meta: {
      title: '预约进度',
    }
  },
  { // 教练端查看预约详情
    path: '/coach/sub_detail',
    name: 'SubDetail',
    component: () => import('@/views/znyc/coach/sub_detail.vue'),
    meta: {
      title: '练车信息',
      keepAlive: true
    }
  },
  { // 教练端配置占用预约车辆
    path: '/coach/allocation_car',
    name: 'AllocationCar',
    component: () => import('@/views/znyc/coach/allocation_car.vue'),
    meta: {
      title: '配置车辆'
    }
  },
  { // 教练端车辆占用申请
    path: '/coach/allocation_cell_group',
    name: 'AllocationCellGroup',
    component: () => import('@/views/znyc/coach/allocation_cell_group.vue'),
    meta: {
      title: '车辆占用'
    }
  },
  { // 教练端车辆占用查询
    path: '/coach/allocation_list',
    name: 'AllocationList',
    component: () => import('@/views/znyc/coach/allocation_list.vue'),
    meta: {
      title: '车辆占用查询'
    }
  },
  // 学员端报告
  { // 报告主页面
    path: '/reportList',
    name: 'ReportList',
    component: () => import('@/views/cjbg/reportList/index.vue'),
    meta: {
      title: '练习报告'
    }
  },
  { // 报告详情
    path: '/reportDetail',
    name: 'ReportDetail',
    component: () => import('@/views/cjbg/reportDetail/index.vue'),
    meta: {
      title: '报告主页'
    },
    children: [
      {
        path: '',
        redirect: '/reportDetail/gross'
      },
      {
        path: 'error',
        name: 'Error',
        component: () => import('@/views/cjbg/reportDetail/error.vue'),
        meta: {
          title: '错误解析'
        },
      },
      {
        path: 'gross',
        name: 'Gross',
        component: () => import('@/views/cjbg/reportDetail/gross.vue'),
        meta: {
          title: '总体分析'
        },
      },
      {
        path: 'suggestions',
        name: 'Suggestions',
        component: () => import('@/views/cjbg/reportDetail/suggestions.vue'),
        meta: {
          title: '名师建议'
        },
      },
    ]
  },
  { // 学员端更多错误分析
    path: '/moreError',
    name: 'MoreError',
    component: () => import('@/views/cjbg/reportDetail/moreError.vue'),
    meta: {
      title: '所有错误'
    }
  },
  // 教练端报告
  { // 报告详情
    path: '/coach/reportDetail',
    name: 'CoachReportDetail',
    component: () => import('@/views/cjbg/coach/index.vue'),
    meta: {
      title: '报告详情'
    },
    children: [
      {
        path: '',
        redirect: '/coach/reportDetail/general'
      },
      {
        path: 'general',
        name: 'General',
        component: () => import('@/views/cjbg/coach/general.vue'),
        meta: {
          title: '总体概况'
        },
      },
      {
        path: 'previous',
        name: 'Previous',
        component: () => import('@/views/cjbg/coach/previous.vue'),
        meta: {
          title: '上次练习'
        },
      },
      {
        path: 'history',
        name: 'History',
        component: () => import('@/views/cjbg/coach/history.vue'),
        meta: {
          title: '历史练习'
        },
      },
    ]
  },
  { // 教练端更多错误分析
    path: '/coach/moreError',
    name: 'CoachMoreError',
    component: () => import('@/views/cjbg/coach/moreError.vue'),
    meta: {
      title: '更多错误分析'
    }
  },
  { // 视频播放
    path: '/coach/video',
    name: 'video',
    component: () => import('@/views/cjbg/coach/video.vue'),
    meta: {
      title: ''
    }
  },
  { // 全部学员
    path: '/coach/allStudent',
    name: 'AllStudent',
    component: () => import('@/views/cjbg/coach/allStudent.vue'),
    meta: {
      title: '我的学员'
    }
  },
  { // 主动呼叫列表
    path: '/coach/callList',
    name: 'CallList',
    component: () => import('@/views/zdhj/callList.vue'),
    meta: {
      title: '呼叫列表'
    }
  },
  { // 服务成功
    path: '/coach/serviceSuccess',
    name: 'ServiceSuccess',
    component: () => import('@/views/zdhj/serviceSuccess.vue'),
    meta: {
      title: '服务成功'
    }
  },
  { // 呼叫成功
    path: '/coach/callSuccess',
    name: 'CallSuccess',
    component: () => import('@/views/zdhj/callSuccess.vue'),
    meta: {
      title: '服务成功'
    }
  },
  {
    path: '/appoint_success',
    name: 'AppointSuccess',
    component: () => import('@/views/znyc/appoint_car/appoint_success.vue'),
    meta: {
      title: '预约成功',
    }
  },
  { // (学员端呼叫)教练列表
    path: '/student/callList',
    name: 'StudentCallList',
    component: () => import('@/views/lczx/callList.vue'),
    meta: {
      title: '我的教练'
    }
  },
  { // (学员端)教学视频列表
    path: '/student/videoList',
    name: 'StudentVideoList',
    component: () => import('@/views/lczx/videoList.vue'),
    meta: {
      title: '教学视频'
    }
  },
  { // (教练端)学时管理选择按钮
    path: '/coach/managementCell',
    name: 'coachManagementCell',
    component: () => import('@/views/lczx/managementCell.vue'),
    meta: {
      title: '学时管理'
    }
  },
  { // (教练端)学时管理列表
    path: '/coach/periodManagement',
    name: 'coachPeriodManagement',
    component: () => import('@/views/lczx/periodManagement.vue'),
    meta: {
      title: '学时管理',
      keepAlive: true,
    }
  },
  { // (教练端)资金监管管理列表
    path: '/coach/capitalManagement',
    name: 'coachCapitalManagement',
    component: () => import('@/views/lczx/capitalManagement.vue'),
    meta: {
      title: '资金监管管理',
      keepAlive: true,

    }
  },
  { // (教练端)查询结果
    path: '/coach/searchResult',
    name: 'coachSearchResult',
    component: () => import('@/views/lczx/searchResult.vue'),
    meta: {
      title: '查询结果'
    }
  },
  { // 批复学员
    path: '/coach/approvalList',
    name: 'approvalList',
    component: () => import('@/views/cjbg/coach/approvalList.vue'),
    meta: {
      title: '我的学员'
    }
  },
  {
    path: '/mockLogin',
    name: 'mockLogin',
    component: () => import('@/views/zzb/mockLogin.vue'),
    meta: {
      title: '登录',
    }
  },
  {
    path: '/mockStudent',
    name: 'mockStudent',
    component: () => import('@/views/zzb/mockStudent.vue'),
    meta: {
      title: '学员端',
    }
  },
  {
    path: '/mockCoach',
    name: 'mockCoach',
    component: () => import('@/views/zzb/mockCoach.vue'),
    meta: {
      title: '教练端',
    }
  },
  {
    path: '/map1',
    name: 'map1',
    component: () => import('@/views/maps/map1.vue'),
    meta: {
      title: '教练端',
    }
  },
  {
    path: '/invitation',
    name: 'invitation',
    component: () => import('@/views/ldx/index.vue'),
    meta: {
      title: '邀请有奖',
    }
  },
  {
    path: '/rate',
    name: 'rate',
    component: () => import('@/views/ldx/rate.vue'),
    meta: {
      title: '',
    }
  },
  {
    path: '/preview',
    name: 'preview',
    component: () => import('@/views/ldx/preview.vue'),
    meta: {
      title: '预览',
    }
  },
  {
    path: '/appointSimulator',
    name: 'appointSimulator',
    component: () => import('@/views/znyc/appoint_simulator/index.vue'),
    meta: {
      title: '预约学车',
    }
  },
  {
    path: '/appointList',
    name: 'appointList',
    component: () => import('@/views/znyc/appoint_simulator/list.vue'),
    meta: {
      title: '预约学车',
    }
  },
  {
    path: '/coach/messageList',
    name: 'messageList',
    component: () => import('@/views/xxtz/messageList.vue'),
    meta: {
      title: '服务工单',
    }
  },
  {
    path: '/serviceSupervision',
    name: 'serviceSupervision',
    component: () => import('@/views/xxtz/serviceSupervision.vue'),
    meta: {
      title: '服务监督',
    }
  },
  {
    path: '/map2',
    name: 'map2',
    component: () => import('@/views/maps/map2.vue'),
    meta: {
      title: '教练端',
    }
  },
  {
    path: '/map3',
    name: 'map3',
    component: () => import('@/views/maps/map3.vue'),
    meta: {
      title: '教练端',
    }
  },
  {
    path: '/map4',
    name: 'map4',
    component: () => import('@/views/maps/map4.vue'),
    meta: {
      title: '教练端',
    }
  },
  {
    path: '/invitation',
    name: 'invitation',
    component: () => import('@/views/ldx/index.vue'),
    meta: {
      title: '邀请有奖',
    }
  },
  {
    path: '/invite_ldx',
    name: 'invite_ldx',
    component: () => import('@/views/ldx/banner.vue'),
    meta: {
      title: '海报展示',
    }
  },
  {
    path: '/rate',
    name: 'rate',
    component: () => import('@/views/ldx/rate.vue'),
    meta: {
      title: '',
    }
  },
  // 模拟机预约进度（教练端）
  {
    path: '/coach/simulator_cell_group',
    name: 'simulatorCellGroup',
    component: () => import('@/views/znyc/coach/simulator_cell_group.vue'),
    meta: {
      title: '模拟机教学',
    }
  },
  {
    path: '/coach/simulator_progress',
    name: 'simulatorProgress',
    component: () => import('@/views/znyc/coach/simulator_progress.vue'),
    meta: {
      title: '预约进度',
    }
  },
  {
    path: '/coach/simulator_detail',
    name: 'simulatorDetail',
    component: () => import('@/views/znyc/coach/simulator_detail.vue'),
    meta: {
      title: '练车信息',
      keepAlive: true
    }
  },
  {
    path: '/coach/simulator_search',
    name: 'simulatorSearch',
    component: () => import('@/views/znyc/coach/simulator_search.vue'),
    meta: {
      title: '模拟机查询',
    }
  },
  {
    path: '/coach/simulator_result',
    name: 'simulatorResult',
    component: () => import('@/views/znyc/coach/simulator_result.vue'),
    meta: {
      title: '修改进度',
    }
  },
  {
    path: '/coach/training_cell_group',
    name: 'trainingCellGroup',
    component: () => import('@/views/znyc/theoretical_training/training_cell_group.vue'),
    meta: {
      title: '理论课',
    }
  },
  {
    path: '/coach/training_apply',
    name: 'trainingApply',
    component: () => import('@/views/znyc/theoretical_training/training_apply.vue'),
    meta: {
      title: '理论课申请',
    }
  },
  {
    path: '/coach/training_search',
    name: 'trainingSearch',
    component: () => import('@/views/znyc/theoretical_training/training_search.vue'),
    meta: {
      title: '理论课查询',
    }
  },
  {
    path: '/coach/training_setting',
    name: 'trainingSetting',
    component: () => import('@/views/znyc/theoretical_training/training_setting.vue'),
    meta: {
      title: '其他配置',
    }
  },
  {
    path: '/coach/training_name_list',
    name: 'trainingNameList',
    component: () => import('@/views/znyc/theoretical_training/training_name_list.vue'),
    meta: {
      title: '学员名单',
    }
  },
  {
    path: '/coach/training_sign_list',
    name: 'trainingSignList',
    component: () => import('@/views/znyc/theoretical_training/training_sign_list.vue'),
    meta: {
      title: '扫码签到',
    }
  },
  {
    path: '/training_appoint',
    name: 'trainingAppoint',
    component: () => import('@/views/znyc/theoretical_training/training_appoint.vue'),
    meta: {
      title: '理论课预约',
    }
  },
  {
    path: '/scanCode',
    name: 'scanCode',
    component: () => import('@/views/zzb/scanCode.vue'),
    meta: {
      title: '二维码',
    }
  },
  {
    path: '/test/index',
    name: 'testIndex',
    component: () => import('@/views/test/index.vue'),
    meta: {
      title: '资讯分享',
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
});

export default router;
