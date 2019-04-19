import { promisify, confirmCancelPromise } from 'wxa-promise';


App<any>({
  onLaunch() {
    // set before interceptor to display international text
    const lang = 'en';
    const interceptor = (param: any) => {
      const texts = lang === 'en' ? ({ cancelText: 'Cancel', confirmText: 'Ok' }) : {};
      return Object.assign(param, texts);
    }
    const showModal = promisify(wx.showModal, { before: interceptor });
    confirmCancelPromise(showModal({ title: 'hello', content: 'world' }))
    .confirm(() => console.log('ok'))
    .cancel(() => console.log('cancel'));
},
})