import $http from '@/assets/js/request';

type ParamsType = {
  [key: string]: string | boolean | number;
}

export function queryMistakes(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/mainReport/mistakeItems', data).then(res => resolve(res));
  });
}

export function queryProjectLevel(data: ParamsType) {
  return new Promise(resolve => {
    $http.get(`teaching/v1/generalOverview/getProjectLevelList/${data.userId}`).then(res => resolve(res));
  });
}

export function queryFocusData(data: ParamsType) {
  return new Promise(resolve => {
    $http.get(`teaching/v1/mainReport/selectFocusData/${data.appointId}`).then(res => resolve(res));
  });
}

export function queryFollowUpAdvise(data: ParamsType) {
  return new Promise(resolve => {
    $http.get(`teaching/v1/mainReport/selectFollowUpAdvise/${data.appointId}`).then(res => resolve(res));
  });
}

export function queryMistakeAnalysis(data: ParamsType) {
  return new Promise(resolve => {
    $http.get(`teaching/v1/mainReport/queryMistakeAnalysis/${data.appointId}`).then(res => resolve(res));
  });
}

export function queryLogList(data: ParamsType) {
  return new Promise(resolve => {
    $http.get(`teaching/v1/totalityAnalysis/queryLoginAndLoginoutListByDate/${data.appointId}`).then(res => resolve(res));
  });
}

export function queryPracticeInfo(data: ParamsType) {
  return new Promise(resolve => {
    $http.get(`teaching/v1/totalityAnalysis/queryPracticeInfoListByDate/${data.appointId}`).then(res => resolve(res));
  });
}

export function queryUpgrade(data: ParamsType) {
  return new Promise(resolve => {
    $http.get(`teaching/v1/totalityAnalysis/queryUpgradeListByDate/${data.appointId}`).then(res => resolve(res));
  });
}
