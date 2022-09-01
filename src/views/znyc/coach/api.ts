import $http from '@/assets/js/request';

export function queryBookableDate() {
  return new Promise(resolve => {
    $http.get('teaching/v1/coach/queryBookableDate').then(res => resolve(res));
  });
}

type ParamsType = {
  [key: string]: string | boolean | number;
}
export function queryReserveInfo(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/coach/queryReserveInfo', data).then(res => resolve(res));
  });
}

export function queryReserveInfoBytimeRange(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/coach/queryReserveInfoBytimeRange', data).then(res => resolve(res));
  });
}

export function getTimeRangeByDate(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/holiday/getTimeRangeByDate', data).then(res => resolve(res));
  });
}

export function createAppointRule(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/carRule/createAppointRule', data).then(res => resolve(res));
  });
}

export function queryCarAppointList(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/carRule/carOccupyList', data).then(res => resolve(res));
  });
}

export function deleteCarAppoint(data: ParamsType) {
  return new Promise(resolve => {
    $http.get(`teaching/v1/carRule/delete/appointRule/${data.batchId}`).then(res => resolve(res));
  });
}

export function queryCarAppoint(data: ParamsType) {
  return new Promise(resolve => {
    $http.get(`teaching/v1/carRule/query/appointRule/${data.batchId}`).then(res => resolve(res));
  });
}

export function updateCarAppoint(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/carRule/update/appointRule', data).then(res => resolve(res));
  });
}

export function coachQueryAnalogPhase(data: ParamsType) {
  return new Promise(resolve => {
    $http.get(`teaching/v1/coach/coachQueryAnalogPhase/${data.mobileNoOrIdNo}`).then(res => resolve(res));
  });
}

export function skipAnalogPractice(data: ParamsType) {
  return new Promise(resolve => {
    $http.get(`teaching/v1/coach/skipAnalogPractice/${data.stuId}`).then(res => resolve(res));
  });
}

export function queryAnalogAbleDate() {
  return new Promise(resolve => {
    $http.get('teaching/v1/coach/queryAnalogAbleDate').then(res => resolve(res));
  });
}

export function queryAnalogReserveInfo(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/coach/queryAnalogReserveInfo', data).then(res => resolve(res));
  });
}

export function queryAnalogReserveInfoBytimeRange(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/coach/queryAnalogReserveInfoBytimeRange', data).then(res => resolve(res));
  });
}

export function queryAnalogReserveDetail(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/coach/queryAnalogReserveDetail', data).then(res => resolve(res));
  });
}
