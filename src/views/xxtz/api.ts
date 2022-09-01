import $http from '@/assets/js/request';

type ParamsType = {
  [key: string]: string | boolean | number;
}

export function queryInfoList(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/eventInfo/eventInfoList', data).then(res => resolve(res));
  });
}

export function updateWorkStatus(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/coach/update/workStatus', data).then(res => resolve(res));
  });
}

export function operateEvent(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/eventInfo/eventOperate', data).then(res => resolve(res));
  });
}

export function queryWorkStatus(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/coach/queryWorkStatus', data).then(res => resolve(res));
  });
}

export function queryCountEventNum(data: ParamsType) {
  return new Promise(resolve => {
    $http.get(`teaching/v1/eventInfo/countEventNum/${data.phaseId}`).then(res => resolve(res));
  });
}

export function eventEvaluateList() {
  return new Promise(resolve => {
    $http.get('teaching/v1/eventInfo/eventEvaluateList').then(res => resolve(res));
  });
}

export function batchOverEvent(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/eventInfo/batchOverEvent', data).then(res => resolve(res));
  });
}
