// 页面适配
((doc: Document, win: Window) => {
  const docEl = doc.documentElement;
  const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  const recalc = () => {
    let { clientWidth } = docEl;
    if (!clientWidth) return;
    if (clientWidth > 640) clientWidth = 640;
    if (clientWidth < 320) clientWidth = 320;
    docEl.style.fontSize = `${100 * (clientWidth / 750)}px`;
  };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
