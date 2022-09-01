import { createApp } from 'vue';
import TopTips from './index.vue';

export default (text: string) => {
  const tip = createApp(TopTips, { text });

  if (!document.getElementById('toptip')) {
    const div = document.createElement('div');
    div.id = 'toptip';
    document.body.appendChild(div);
    tip.mount('#toptip');
    const timer = setTimeout(() => {
      clearTimeout(timer);
      document.body.removeChild(div);
    }, 1500);
  }
};
