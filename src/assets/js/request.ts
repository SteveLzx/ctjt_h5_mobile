// axios封装
import axios, { AxiosRequestConfig } from 'axios';
import TopTip from '@/components/TopTip';
import { getToken } from './token_cookie';

// 判断什么服务器：
const { domain } = document;
// 生产环境
let publicUrl = domain.includes('aicar24') ? 'https://www.aicar24.com/' : 'https://www.aicar365.com/';
// 开发环境
if (process.env.NODE_ENV === 'development' || document.domain.includes('localhost')) {
  publicUrl = domain.includes('aicar24') ? 'https://www.dev.aicar24.com/' : 'https://www.dev.aicar365.com/';
}
// 测试环境
if (process.env.NODE_ENV === 'test_env' || document.domain.includes('localhost')) {
  publicUrl = domain.includes('aicar24') ? 'https://test.aicar24.com/' : 'https://test.aicar365.com/';
}
// publicUrl = '/api';
// 无网络时发请求提示
let isOnline = true;
window.addEventListener('online', () => {
  isOnline = navigator.onLine;
});
window.addEventListener('offline', () => {
  isOnline = navigator.onLine;
});
interface RequestConfig extends AxiosRequestConfig {
  contentType?: string; // 可能更改的post数据类型
  canRepeat?: boolean;
  token?: string;
}
// 请求链接列表
let pendingAjax: string[] = [];
// 请求拦截
axios.interceptors.request.use(
  (requestConfig: RequestConfig) => {
    const config = requestConfig;
    // 防止重复提交 需要重复提交则传入canRepeat: true
    if (!config.canRepeat) {
      config.cancelToken = new axios.CancelToken(cancel => {
        let requestMsg = '';
        if (config.data && config.data.hasUrl) {
          requestMsg = `${config.url}-${config.method}`;
        } else {
          requestMsg = `${publicUrl + config.url}-${config.method}`;
        }
        if (pendingAjax.includes(requestMsg) || !isOnline) {
          cancel(requestMsg);
        }
        pendingAjax.push(requestMsg);
      });
    }

    // 添加TOKEN
    config.headers.Authorization = getToken((config.data && config.data.token) || '');

    // 设置POST请求数据类型
    config.headers.post['Content-Type'] = config.contentType || 'application/json;charset=utf-8';
    if (config.url && !config.url.startsWith('http') && !config.url.startsWith('../')) {
      config.url = publicUrl + config.url;
      // config.url = config.url + (config.url.indexOf('?') >= 0 ? '&' : '?') + 't=' + new Date().getTime()
    }
    return config;
  },
  err => Promise.reject(err)
);

// 响应拦截
axios.interceptors.response.use(
  response => {
    const requestMsg = `${response.config.url}-${response.config.method}`;
    pendingAjax.splice(pendingAjax.indexOf(requestMsg), 1);
    if (response.status === 200 && response.data.code === 200) {
      return response.data.body;
    }
    TopTip(response.data.msg);
    return Promise.reject(response.data);
  },
  error => {
    const { message } = error;
    if (!isOnline) TopTip('无网络,请稍后重试');
    // 取消重复请求时在请求列表中拿掉
    if (message && pendingAjax.indexOf(message) > -1) {
      pendingAjax.splice(pendingAjax.indexOf(message), 1);
    } else {
      pendingAjax = [];
    }
    const { config } = error;
    // 判断是否配置了重试
    if (!config || !config.retry) return Promise.reject(error);
    if (!config.shouldRetry(error)) {
      return Promise.reject(error);
    }
    // 设置重置次数，默认为0
    config.__retryCount = config.__retryCount || 0;
    // 判断是否超过了重试次数
    if (config.__retryCount >= config.retry) {
      return Promise.reject(error);
    }
    // 重试次数自增
    config.__retryCount += 1;
    // 延时处理
    const backoff = new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, config.retryDelay || 1);
    });
    // 重新发起axios请求
    return backoff.then(() => axios(config));
  }
);

export default axios;
