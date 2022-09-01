import $http from '@/assets/js/request';

type ParamsType = {
  [key: string]: string | boolean | number;
}

export function analogPlaceList() {
  return new Promise(resolve => {
    $http.post('teaching/v1/analogPlaceList').then(res => resolve(res));
  });
}

export function queryStudentProgress() {
  return new Promise(resolve => {
    $http.post('teaching/v1/studentProgress').then(res => resolve(res));
  });
}

export function analogPlaceAdvanceDaysInfo(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/analogPlaceAdvanceDaysInfo', data).then(res => resolve(res));
  });
}

export function analogAppointmentInfo(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/analogAppointmentInfo', data).then(res => resolve(res));
  });
}

export function analogAppoint(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/analogAppoint', data).then(res => resolve(res));
  });
}
