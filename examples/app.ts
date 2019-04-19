import { promisify } from 'wxa-promise';

App<any>({
  onLaunch() {

    // set default value
    // const showLoading = promisify(wx.showLoading, { default: { title: '' } });
    // showLoading().catch(console.error);

    // set before interceptor to display international text
    const lang = 'en';
    const interceptor = (param: any) => {
      const texts = lang === 'en' ? ({ cancelText: 'Cancel', confirmText: 'Ok' }) : {};
      return Object.assign(param, texts);
    }
    const showModal = promisify(wx.showModal, { before: interceptor });
    showModal({ title: 'hello', content: 'world' });
  },
})