# wxa-promise
Extend WeChat miniprogram's api to surport promise. Please refer to the miniprogram official [:link:documentation](https://developers.weixin.qq.com/miniprogram/dev/api/) for more information.

# Features
* :one: Call WeChat miniprogram's api based on Promise style;
* :two: Can set global default parameter;
* :three: Add interceptors before the api is called;
* :four: Add interceptors after the api is called;
* :five: Built-in common interceptors;
# Installation

>`$ npm install --save wxa-promise`

# Getting started
Call the method *promisifyAll* at the program entry (app.js), It only needs to be called once. It is very important to add an ***Async*** suffix after the currently used method.

:dash:example:
```
import { promisifyAll, promisify } from 'wxa-promise';

// promisify all wx's api
promisifyAll({ provider:wx });
wx.getSystemInfoAsync().then(console.log).catch(console.error);

// promisify single api
promisify(wx.getSystemInfo)().then(console.log).catch(console.error);
```
:eyes:output:
```
{ errMsg: "getSystemInfo:ok", model: "iPhone 6", … }
```
# API

## promisifyAll(options: IPromiseAllOptions) : void
Extend specified provider to convert all matches APIs to promse-style's API, *promisifyAll* should be called at the program entry (such as app.js).

:warning:If the suffix is set to an empty string, the default method will be overridden, please use the empty suffix with caution.

**IPromiseAllOptions**
name|type|required|description|default
---|:--:|:--:|--|---:
provider|Object|Y|api provider|wx
suffix|String|N|api suffix before api call|'Async'
filter|Function|N|filter condition|wx.canIUse(`${name}.success`)
config|Record<string, IApiOptions>|N|api configs|{}
:dash:example:
```
import { promisifyAll } from 'wxa-promise';

// promisify all wx's api
promisifyAll({ provider:wx });
wx.getSystemInfoAsync().then(console.log).catch(console.error);
```
## promisify(api: Function, options?: IApiOptions)
Convert single API to promise-style's API.
* api: a function to be promisify
* options: api configuration options

**IApiOptions**
name|type|required|description|default
---|:--:|:--:|--|---:
default|Object|N|default configuration options|{}
before|Array|N|interceptors before api call|[]
after|Array|N|interceptors after api call|[]
:dash:example:
```
import { promisify } from 'wxa-promise';

// set default value
const showLoading = promisify(wx.showLoading, { default: { title: '' } });
showLoading().catch(console.error);

// set before interceptor to display international text
const lang = 'en';
const interceptor = (param: any) => {
  const i18nTexts = { cancelText: 'Cancel', confirmText: 'Ok' };
  const texts = lang === 'en' ? i18nTexts : {};
  return Object.assign(param, texts);
}
const showModal = promisify(wx.showModal, { before: interceptor });
showModal({ title: 'hello', content: 'world' });
```
:sparkles: *The second parameter of the response interceptor is the request parameter.*
# Set global configuration
Use *globalOptions* to set global common configuration.

:dash:example:
```
import { promisify, globalOptions } from 'wxa-promise';

const replaceMessage = (result: any) => {
    if (result && result.errMsg) {
    result.message = result.errMsg;
    delete result.errMsg;
    }
    return result;
};

globalOptions.responseInterceptors.push({
    resolve: replaceMessage,
    reject: replaceMessage
});

promisify(wx.getSystemInfo)().then(console.log).catch(console.error);
```
:eyes:output(errMsg has been replaced with message):
```
{ message: "getSystemInfo:ok", model: "iPhone 6", … }
```
# Built-in Interceptors
## replaceMessage( options?: { removeErrMsg?: boolean } ) 
* removeErrMsg: Wether to remove the default errMsg parameter.

Replace the errMsg field with a more generic one(message).

:dash:example:
```
import { promisify, globalOptions, interceptors } from 'wxa-promise';

globalOptions.responseInterceptors.push(interceptors.replaceMessage());
const showLoading = promisify(wx.showLoading, { default: { title: '' } });
showLoading().catch(console.error);
```
## To be continued...
# Execution order
:warning:All interceptors should return a valid value for subsequent operations.
1. Execute the global before interceptors in order of addition;
2. Execute the current before interceptor;
3. Merge current parameters with default parameters;
4. Invoke the API with final request parameter which would pass to the after interciptors with **second parameter**;
5. Execute the global after interceptors in order of addition;
6. Execute the current after interceptor;
7. Return final promise;