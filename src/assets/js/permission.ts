// 用户路由拦截判断权限
import router from '@/router/index';
import asyncRoutes from '@/router/async_routes';
import { RouteRecordRaw } from 'vue-router';
import getPageTitle from './get_page_title';
import { setBanBanTitle } from './common';
import { getToken } from './token_cookie';
import filterAsyncRoutes from './generate_routes';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
  }
}

// const whiteList: string[] = ['/', '/login', '/home']; // 权限白名单

// let addRoutesFlag = false;
router.beforeEach(async (to, from, next) => {
  document.title = getPageTitle(to.meta.title);
  setBanBanTitle(to.meta.title as string);
  // const userToken = getToken();

  // if (userToken) {
  //   if (to.path === '/login') { // 有登录进入默认页面
  //     next({ path: '/' });
  //   } else {
  //     if (!addRoutesFlag) { // 只添加一次
  //       // 获取权限路由
  //       const routes: Array<RouteRecordRaw> = filterAsyncRoutes(asyncRoutes, 1);
  //       routes.push({ path: '*', redirect: '/home' });
  //       routes.forEach(item => router.addRoute(item));
  //       addRoutesFlag = true;
  //       next({ path: to.path, replace: true });
  //       return;
  //     }
  //     next();
  //   }
  // } else if (whiteList.includes(to.path)) { // 白名单页面直接跳转
  //   next();
  // } else { // 跳转登录页面
  //   next(`/login?redirect=${to.path}`);
  // }
  next();
});
