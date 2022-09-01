import $http from '@/assets/js/request';

type ParamsType = {
  [key: string]: string | boolean | number;
}

export function queryTeachingVideo() {
  return new Promise(resolve => {
    $http.post('teaching/v1/video/queryTeachingVideo').then(res => resolve(res));
  });
}

export function queryVideoPlayAuth(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/video/queryVideoPlayAuth', data).then(res => resolve(res));
  });
}

export function queryPlaceDuty(data: ParamsType) {
  return new Promise(resolve => {
    $http.get(`teaching/v1/queryPlaceDuty/${data.venueId}`).then(res => resolve(res));
  });
}

export function queryStudentStudyFund(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/study/queryStudentStudyFund', data).then(res => resolve(res));
  });
}

export function queryStudyHoursList(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/study/queryStudyHoursList', data).then(res => resolve(res));
  });
}

export function submitFundSupervisionStatus(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/study/submitFundSupervisionStatus', data).then(res => resolve(res));
  });
}

export function queryCarTime(data: ParamsType) {
  return new Promise(resolve => {
    $http.get(`teaching/v1/study/queryCarTime/${data.userId}`).then(res => resolve(res));
  });
}

export function submitUpdateCarTime(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/study/submitUpdateCarTime', data).then(res => resolve(res));
  });
}

export function queryNeedStudyTimeConf(data: ParamsType) {
  return new Promise(resolve => {
    $http.get(`teaching/v1/study/queryNeedStudyTimeConf/${data.trainingPlaceId}`).then(res => resolve(res));
  });
}
