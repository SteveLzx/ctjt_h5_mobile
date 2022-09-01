import $http from '@/assets/js/request';

type ParamsType = {
  [key: string]: string | boolean | number;
}

export function queryMistakes(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/generalOverview/mistakeItems', data).then(res => resolve(res));
  });
}

export function queryGeneral(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/generalOverview/info', data).then(res => resolve(res));
  });
}

export function queryHistory(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/generalOverview/selectHistoryExerciseInfo', data).then(res => resolve(res));
  });
}

export function queryProjectLevel(data: ParamsType) {
  return new Promise(resolve => {
    $http.get(`teaching/v1/generalOverview/getProjectLevelList/${data.userId}`).then(res => resolve(res));
  });
}

export function queryPrevious(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/generalOverview/selectLastTrainingReport', data).then(res => resolve(res));
  });
}

export function queryAllStudent(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/banban/getAiStudentInfo', data).then(res => resolve(res));
  });
}

export function getStudentsApproval(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/banban/getAiStudentsApproval', data).then(res => resolve(res));
  });
}
