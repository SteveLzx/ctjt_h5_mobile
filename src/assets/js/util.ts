// 公用方法

// 手机号码校验
export const mobileReg = /^1(3|4|5|6|7|8|9)\d{9}$/;

// 6位验证码
export const codeReg = /\d{6}$/;

function canvasCompress(image: CanvasImageSource, quality = 0.8) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const width = image.width as number;
  const height = image.height as number;
  canvas.width = width;
  canvas.height = height;
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', quality);
}

function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(',');
  const mime = (arr[0].match(/:(.*?);/) as Array<string>)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n) {
    n -= 1;
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export const compressImg = (file: File) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event: ProgressEvent) => {
    const result = (event.target as FileReader).result as string;
    const imgEl = new Image();
    imgEl.src = result;
    imgEl.onload = () => resolve(dataURLtoFile(canvasCompress(imgEl), file.name));
  };
});

/**
 *
 *
 *  @export
 *  @param {Date} date 日期
 *  @return
 */
export function getYearMonthDay(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = date.getDay();
  const monthCopy = month > 9 ? month : `0${month}`;
  const dayCopy = day > 9 ? day : `0${day}`;
  const yearMonthDay = `${year}-${monthCopy}-${dayCopy}`;
  return {
    year, month, day, weekday, yearMonthDay
  };
}

/**
 *
 * 是否为移动端
 * @export
 * @return
 */
export function isMobile() {
  return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
}

/**
 *
 * 是否为移动端
 * @export
 * @return
 */
export function isIos() {
  const u = navigator.userAgent;
  console.log(u);
  if (u.indexOf('iPhone') > -1 || u.indexOf('iOS') > -1) {
    return true;
  }
  return false;
}
