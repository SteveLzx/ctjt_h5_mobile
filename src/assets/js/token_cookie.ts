// token存取
const TokenKey = 'kjjp_token';

export function getToken(key?: string) {
  return sessionStorage.getItem(key || TokenKey) || '';
}

export function setToken(token: string, key?: string) {
  sessionStorage.setItem(key || TokenKey, token);
}

export function removeToken(key?: string) {
  sessionStorage.removeItem(key || TokenKey);
}
