import $http from '@/assets/js/request';

type ParamsType = {
  [key: string]: string | boolean | number;
}

export function orderFinish(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/call/orderFinish', data).then(res => resolve(res));
  });
}

export function queryVenueCarCodeInfo(data: ParamsType) {
  return new Promise(resolve => {
    $http.post('teaching/v1/call/queryVenueCarCodeInfo', data).then(res => resolve(res));
  });
}
