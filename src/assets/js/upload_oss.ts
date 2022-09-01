import axios from '@/assets/js/request';

const OSS = require('ali-oss'); // 引入ali-oss

// 环境
const { hostname } = window.location;
let _bucket = 'ctjt-dev';
if (hostname.startsWith('coach-h5.aicar365')) _bucket = 'ctjt-release';
if (hostname.startsWith('coach-h5.test.aicar365')) _bucket = 'ctjt-test';

/** 请求阿里签名 */
function getAliyuncs() {
  return new Promise((resolve, reject) => {
    axios.get('base/v1/oss/sts', {
      params: {
        RoleArn: `acs:ram::1625610608962527:role/oss-${_bucket}`,
        RoleSessionName: `oss-${_bucket}`,
      }
    }).then((res: any) => {
      resolve(res.Credentials);
    }).catch((err) => {
      reject(err);
    });
  });
}

/** 生成uuid */
/* eslint-disable */
export function getUUid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// base64转blob
export function base64ToBlob(base64Data: String) {
  let arr: any = base64Data.split(',');
  const fileType: string = arr[0].match(/:(.*?);/)[1];
  const bstr: any = atob(arr[1]);
  let l: any = bstr.length;
  const u8Arr: any = new Uint8Array(l);
      
  while (l--) {
      u8Arr[l] = bstr.charCodeAt(l);
  }
  return new Blob([u8Arr], {
      type: fileType
  });
};

/** 上传文件 小文件直接上传 */
export function putUploadAliyuncs(file: any, business: string) {
  return new Promise((resolve, reject) => {
    getAliyuncs().then(async (res: any) => {
      const {
        SecurityToken, AccessKeyId, AccessKeySecret
      } = res;
      const client = new OSS({
        region: 'oss-cn-shenzhen',
        accessKeyId: AccessKeyId,
        accessKeySecret: AccessKeySecret,
        stsToken: SecurityToken,
        bucket: `${_bucket}`
      });
      // 生成uuid
      try {
        const _type = 'png';
        const _fileName = `${getUUid()}.${_type}`;
        const result = await client.put(`${business}/${_fileName}`, file);
        resolve(result.name);
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  });
}
