const dsBridge = require('dsbridge');

declare const window: Window & { app: any; getUserInfo: any };
export default {
  /**
     * 前端查询app方法是否存在
     * @param {string} name app方法名
     */
  hasNativeMethod(name: any) {
    // 查询方法是否存在
    const hasNativeMethod = dsBridge.hasNativeMethod(`app.${name}`);
    const hasNativeOldMethod = window.app ? window.app[name] : '';

    return hasNativeMethod || hasNativeOldMethod;
  },

  /**
     * 前端调用app的方法
     * @param {string} name app方法名
     * @param {Object} data 携带参数
     */
  callBackHandler(name: any, data: any = {}) {
    console.log('name', name, data);
    // 查询方法是否存在
    const hasNativeMethod = dsBridge.hasNativeMethod(`app.${name}`);
    console.log('hasNativeMethod', hasNativeMethod);

    if (hasNativeMethod) {
      return dsBridge.call(`app.${name}`, data);
    }
    // 兼容老版本存留
    const arr: any = [];

    try {
      if (data) {
        Object.keys(data).forEach(res => {
          arr.push(data[res]);
        });
      }
      console.log(111, name);
      // eslint-disable-next-line no-nested-ternary
      return window.app ? (window.app[name] ? window.app[name](...arr) : '') : '';
    } catch (e) {
      console.log(e);
    }
    return '';
  },
  /**
     * app调用前端方法
     * @param {string} name 前端方法名
     * @param {function} callback 回调方法,接收app传递的数据,并返回数据给app
     */
  registerHandler(name: any, callback: any) {
    dsBridge.register(name, callback);

    // 兼容老版本存留
    window[name] = callback;
  }
};
