import $http from '@/assets/js/request';

type ParamsType = {
  [key: string]: string | boolean | number;
}

export function queryLearnReport(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/mainReport/getLearnReport', data).then(res => resolve(res));
  });
}

export function queryLearnReportCount(data: ParamsType) {
  return new Promise(resolve => {
    $http.get('teaching/v1/mainReport/getLearnReportCount').then(res => resolve(res));
  });
}
