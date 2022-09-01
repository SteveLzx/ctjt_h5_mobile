// 校验路由权限的相关方法
import { RouteRecordRaw } from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    roles?: Array<string | number>;
  }
}
/**
 * 通过meta.roles添加路由权限,不配置则为超管
 * @param rolesType number | string
 * @param route Route
 */
function hasPermission(rolesType: number | string, route: RouteRecordRaw): boolean {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(rolesType);
  }
  return true;
}

/**
 * 遍历循环查找权限路由
 * @param routes asyncRoutes
 * @param rolesType number
 */
export default function filterAsyncRoutes(routes: Array<RouteRecordRaw>, rolesType: number | string) {
  const res: Array<RouteRecordRaw> = [];
  routes.forEach(route => {
    const routeConfig = { ...route };
    if (hasPermission(rolesType, routeConfig)) {
      if (routeConfig.children) {
        routeConfig.children = filterAsyncRoutes(routeConfig.children, rolesType);
      }
      res.push(routeConfig);
    }
  });
  return res;
}
