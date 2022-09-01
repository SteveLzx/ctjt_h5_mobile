// 全局数据绑定
interface GlobalData {
  /* eslint-disable */
  [key: string]: any;
  /* eslint-enable */
}
const globalData: GlobalData = {};

// 给global添加属性
export const setGlobalData = (key: string, val: any) => {
  globalData[key] = val;
};
// 获取global属性
export const getGlobalData = (key: string) => globalData[key] || null;
