import { setToken, getToken, removeToken } from '@/assets/js/token_cookie';
import axios from './request';
import jsBridge from './jsBridge';

declare const window: Window & { app: any; getUserInfo: any };
// 获取url的query值
export function getQueryString(name: string) {
  const match = RegExp(`[?&]${name}=([^&]*)`).exec(window.location.href);
  if (match) {
    return decodeURIComponent(match[1].replace(/\+/g, ' '));
  }
  return match;
}

export function getBanBanToken() {
  let token = '';
  try {
    // const banbanToken = window.app.passTokenData();
    // window.app.passTokenData() 斑斑APP获取token方法
    // window.getUserInfo 教练端获取token方法————iOS
    // window.app.passUserInfo() 教练端获取token方法————安卓
    // let banbanTokenObj = (window.app.passTokenData && window.app.passTokenData()) || (window.app.passUserInfo && window.app.passUserInfo()) || window.getUserInfo;
    let banbanTokenObj = jsBridge.callBackHandler('passTokenData') || jsBridge.callBackHandler('passUserInfo') || window.getUserInfo;
    console.log(banbanTokenObj, 'banbanTokenObj');
    // 斑斑返回json字符串  教练端直接返回对象
    if (typeof banbanTokenObj === 'string') {
      banbanTokenObj = JSON.parse(banbanTokenObj);
    }
    token = banbanTokenObj.token;
    setToken(JSON.stringify(banbanTokenObj || ''), 'banbanTokenObj');
  } catch (error) {
    /* eslint-disable */
    const xueyuan = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpblR5cGUiOiJzdHVkZW50IiwiZXhwIjoxNjQwNzIzNDAwLCJ1c2VySWQiOiIyMDIxMDYwMzExMjc0MDN2emdkN3Brc3pra2ZrZ2ZhcGpibmkiLCJpYXQiOjE2MzgxNTE0MjksImp0aSI6IjM5ZmMzOTIwMDNjMzQxYzBiZjJiNzg5MzYyNGYyZDM0In0.UNC3mM1QSm4oxgdRDLAEStpYD3Qwk0xPFlX1BuITFSE';
    const jiaolian = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTcyNDYiLCJjb21wYW55aWQiOiIxNiIsIm1vYmlsZSI6IjE4NTE2MjIyNjkzIiwiSXNBbm9ueW1vdXNVc2VycyI6IlRydWUiLCJuYmYiOjE2Mzc4OTIxNDUsImV4cCI6MTY0MDQ4NDE0NSwiaWF0IjoxNjM3ODkyMTQ1LCJpc3MiOiJjdGwtY29hY2gtbW9iaWxlIiwiYXVkIjoiY3RsLWNvYWNoLW1vYmlsZSJ9.i8CIBuvK-SFdeVvLt9786eMGKZLl96uTN9L3H5rZsg8'
    token = getQueryString('token') || (getToken('banbanTokenObj') && JSON.parse(getToken('banbanTokenObj')).token) || xueyuan;
    if(!getToken('banbanTokenObj')){
      setToken(JSON.stringify({
        appEnv: 0,
        coachApiHost: 'http://app.test.chelizitech.com',
        coachId: 117246,
        coachName: '谭建刚',
        companyId: 16,
        headPhoto: '',
        identityCard: '430224198510024757',
        isAnonymouseUsers: true,
        loginPwd: '123456',

        mobile: '18516222693',
        oldCompanyId: 1,
        organ: 0,
        organId: '44',
        roleId: 5,
        roleName: '智能教练',
        sex: '男',
        stuApiHost: 'http://uat.ctl.chelizitech.com',
        teachSubjectId: '0',
        teachSubjectName: '',
        token: token
      }), 'banbanTokenObj');
    }


    /* eslint-enable */
  }
  return token;
}

export function setBanBanTitle(tit: string) {
  try {
    if (jsBridge.hasNativeMethod('changeTitle')) {
      jsBridge.callBackHandler('changeTitle', { title: tit });
      return;
    }
    if (jsBridge.hasNativeMethod('setPageTitle')) {
      jsBridge.callBackHandler('setPageTitle', { title: tit });
    }
  } catch (error) {
    console.log('setBanBanTitle', error);
  }
}

export function banbanCall(mobile: string) {
  console.log('mobile', mobile);
  try {
    if (jsBridge.hasNativeMethod('callPhone')) {
      jsBridge.callBackHandler('callPhone', { tel: mobile });
      return;
    }
    if (jsBridge.hasNativeMethod('call')) {
      jsBridge.callBackHandler('call', { tel: mobile });
    }
  } catch (error) {
    console.log('banbanCall', error);
  }
}

// 检验从斑斑过来的用户token是否有效
export const verifyLogin = (key?: number) => new Promise(resolve => {
  if (getToken()) {
    resolve();
    return;
  }
  const token = getBanBanToken();
  if (!token) return;
  setToken(token);
  let url = 'teaching/v1/studentVerifyLogin'; // 学员端
  if (key === 1) url = 'teaching/v1/coach/verifyLogin'; // 教练端
  axios.post(url, { userId: getQueryString('userId') || '' }).then((res: any) => {
    setToken(res.userTicket);
    setToken(res.loginName || '', 'loginName');
    setToken(res.loginMobile || '', 'loginMobile');
    resolve(res);
  }).catch(() => removeToken());
});

export function getYMD(key?: number, date?: Date|string) { // 1 获取年月日 2 获取年月日时分秒
  const now = date ? new Date(date.toString().replace(/-/g, '/')) : new Date();
  const year = now.getFullYear();
  let month: number | string = now.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let day: number | string = now.getDate();
  day = day < 10 ? `0${day}` : day;
  if (key === 1) return `${year}-${month}-${day}`;
  let hours: number | string = now.getHours();
  hours = hours < 10 ? `0${hours}` : hours;
  let min: number | string = now.getMinutes();
  min = min < 10 ? `0${min}` : min;
  let seconds: number | string = now.getSeconds();
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${year}-${month}-${day} ${hours}:${min}:${seconds}`;
}

export function getYMDObj(date: any) { // 1 获取年月日 2 获取年月日时分秒
  if (!date) {
    return {};
  }
  const now = new Date(date.toString().replace(/-/g, '/'));
  const year = now.getFullYear();
  let month: number | string = now.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let day: number | string = now.getDate();
  day = day < 10 ? `0${day}` : day;
  let hours: number | string = now.getHours();
  hours = hours < 10 ? `0${hours}` : hours;
  let min: number | string = now.getMinutes();
  min = min < 10 ? `0${min}` : min;
  let seconds: number | string = now.getSeconds();
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  return {
    year,
    month,
    day,
    hours,
    min,
    seconds
  };
}
// 主动呼叫
export function callUser(placeId: string, userInfo: any) {
  try {
    // jsBridge.callBackHandler('callUserByVoiceCall', JSON.stringify({
    //   placeId,
    //   ...userInfo
    // }));

    window.app.callUserByVoiceCall(JSON.stringify({
      placeId,
      ...userInfo
    }));
  } catch (error) {
    console.log('callUser', error);
  }
}

// 主动呼叫
export function getAppVersion(): string {
  let appVersion = '0.0.0';
  try {
    appVersion = jsBridge.callBackHandler('getAppVersion') || '0.0.0';
    // appVersion = (window.app.getAppVersion && window.app.getAppVersion()) || '0.0.0';
  } catch (error) {
    console.log('appVersion', error);
  }
  console.log('appVersion', appVersion);
  return appVersion;
}

export function appShare(obj: any) {
  try {
    console.log(JSON.stringify(obj));
    const {
      title, content, shareUrl, imageUrl, pageCode
    } = obj;
    // window.app.share(title, content, shareUrl, imageUrl, pageCode);
    jsBridge.callBackHandler('share', {
      title, content, shareUrl, imageUrl, pageCode
    });
  } catch (error) {
    console.log('Call', error);
  }
}

// 物理返回
export function goBack() {
  try {
    jsBridge.callBackHandler('returnLastPage');
  } catch (error) {
    console.log('error', error);
  }
}
