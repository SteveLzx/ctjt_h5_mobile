// 获取页面标题
const title = '';

export default function getPageTitle(pageTitle?: string): string {
  if (pageTitle) {
    return `${pageTitle} ${title}`;
  }
  return `${title}`;
}
