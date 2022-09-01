import $http from '@/assets/js/request';

type ParamsType = {
  [key: string]: string | boolean | number;
}
export function addTheoryTime(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/theory/addTheoryTime', data).then(res => resolve(res));
  });
}

export function queryTheoryTimes() {
  return new Promise(resolve => {
    $http.post('teaching/theory/queryTheoryTimes').then(res => resolve(res));
  });
}

export function deleteTheoryTime(data: ParamsType) {
  return new Promise(resolve => {
    $http.get(`teaching/theory/deleteTheoryTime/${data.id}`).then(res => resolve(res));
  });
}

export function theoryBasicsConfig(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/theory/theoryBasicsConfig', data).then(res => resolve(res));
  });
}

export function updateTheoryTime(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/theory/updateTheoryTime', data).then(res => resolve(res));
  });
}

export function queryTheoryAppointConfig(data: ParamsType) {
  return new Promise(resolve => {
    $http.get(`teaching/theory/queryTheoryAppointConfig/${data.id}`).then(res => resolve(res));
  });
}

export function queryTheoryBasicsConfig() {
  return new Promise(resolve => {
    $http.post('teaching/theory/queryTheoryBasicsConfig').then(res => resolve(res));
  });
}
export function queryTheoryStuAppointInfo(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/theory/queryTheoryStuAppointInfo', data).then(res => resolve(res));
  });
}
export function queryTheoryNoAppointInfo(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/theory/queryTheoryNoAppointInfo', data).then(res => resolve(res));
  });
}

export function queryTheoryAppoint() {
  return new Promise(resolve => {
    $http.post('teaching/theory/queryTheoryAppoint').then(res => resolve(res));
  });
}

export function queryTheoryWeekAppointDate() {
  return new Promise(resolve => {
    $http.post('teaching/theory/queryTheoryWeekAppointDate').then(res => resolve(res));
  });
}

export function queryTheoryPlace() {
  return new Promise(resolve => {
    $http.post('teaching/theory/queryTheoryPlace').then(res => resolve(res));
  });
}

export function queryStudentProgress() {
  return new Promise(resolve => {
    $http.post('teaching/v1/studentProgress').then(res => resolve(res));
  });
}

export function theoryPlaceAdvanceDaysInfo(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/theory/theoryPlaceAdvanceDaysInfo', data).then(res => resolve(res));
  });
}

export function theoryAppointTimeLoad(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/theory/theoryAppointTimeLoad', data).then(res => resolve(res));
  });
}

export function theoryAppoint(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/theory/theoryAppoint', data).then(res => resolve(res));
  });
}

export function theorySignInBanner() {
  return new Promise(resolve => {
    $http.post('teaching/theory/theorySignInBanner').then(res => resolve(res));
  });
}
