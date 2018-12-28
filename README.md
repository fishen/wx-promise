# wx-promise-all
Extend WeChat miniprogram's api to surport promise by adding an **Async** suffix. Please refer to the miniprogram official [documentation](https://developers.weixin.qq.com/miniprogram/dev/api/) for more information.

# Features
* Call WeChat miniprogram's api based on Promise style;
* Add the *finally* method extension to the Promise;
* Can set global default parameter;
* Overload miniprogram's api.
* Add interceptors before the api is called;
* Add interceptors after the api is called;
* Extend global miniprogram's api.
# Installation

>`$ npm install --save wx-promise-all`

# Getting started
Call the method *promisifyAll* at the program entry (app.js), It only needs to be called once. It is very important to add an ***Async*** suffix after the currently used method.
```
// app.js
import { promisifyAll } from 'wx-promise-all';
promisifyAll(wx);
wx.getSystemInfoAsync().then(console.log).catch(console.error);
```
output:
```
{ errMsg: "getSystemInfo:ok", model: "iPhone 6", … }
```
# Configurations

name|type|description|default
---|:--:|:--:|---:
defaultOptions|Object|default configuration options|{}
promisable|Boolean|can the api be promiseify|true
before|Array|interceptors before api call|[]
after|Array|interceptors after api call|[]
extend|Object|extend promise|{}

Please set **promisable** to false if the api does not support asynchronous mode.
# API
> **promisifyAll(wx : object, config : { string : ApiConfig }) : void**

* wx: WeChat miniprogram's api provider
* config: api configuration options
    * $common: global configuration options
    * apiName: specific api name

***
# Promise.prototype.finally
The *finally* method is always called, either correctly or unexpectedly.
```
wx.showLoadingAsync()
    .then(()=>wx.requestAsync({url:'http://www.baidu.com'}))
    .then(console.log)
    .catch(console.error)
    .finally(wx.hideLoadingAsync)
```
output:
```
{data:"<!DOCTYPE html>↵<html class=""><!--STATUS OK--><he…ript><div id="bgContainer" ></div></body></html>", header: {…}, statusCode: 200, message: "request:ok"}
```
# Set global common configuration
Use *$common* to set global common configuration.
```
import { promisifyAll, ApiConfig } from 'wx-promise-all';

const replaceMessage = (result, param) => {
    if (result && result.errMsg) {
        result.message = result.errMsg;
        delete result.errMsg;
    }
    return result;
};
promisifyAll(wx, {
    $common: new ApiConfig({
        // replace errorMsg with message field.
        after: [{ success: replaceMessage, fail: replaceMessage }]
    })
);
wx.getSystemInfoAsync().then(console.log).catch(console.error);
```
output:
```
{ message: "getSystemInfo:ok", model: "iPhone 6", … }
```
# Set global default parameter
Use *defaultOptions* to set default parameters.
```
import { promisifyAll } from 'wx-promise-all';

promisifyAll(wx, {
    showModal:{
        // set default parameters for showModal
        defaultOptions: {
            title: 'default title',
            cancelColor: '#ff0000',
            confirmColor: '#00ff00',
        },
    }
);
```

# Overload global api
Use the *before* interceptors to modify the request parameters to implement method overloading.
```
import { promisifyAll, ApiConfig } from 'wx-promise-all';

promisifyAll(wx, {
    navigateTo: new ApiConfig({
        // overload navigateTo
        before: [{ success: p => typeof p === 'string' ? { url: p } : p }]
    })
);
// The following two ways are the same effect
wx.navigateToAsync({ url : 'path' });
wx.navigateToAsync('path');
```
# Complex example
Compatible with different versions of the cancellation method, and collect formId.

>It is worth mentioning that the second parameter can be used to get the request parameters in after interceptors.
```
import { promisifyAll, ApiConfig } from 'wx-promise-all';

const replaceMessage = (result, param) => {
    if (result && result.errMsg) {
        result.message = result.errMsg;
        delete result.errMsg;
    }
    return result;
};

promisifyAll(wx, {
    $common: new ApiConfig({
        // replace errorMsg with message field.
        after: [{ success: replaceMessage, fail: replaceMessage }]
    }),
    requestPayment: new ApiConfig({
        after: [{
            success: (data, param) => {
                // Compatible with different versions of the cancellation method
                if (data.message === 'requestPayment:cancel') {
                    // add cancel field to determine if it has been cancelled
                    data.cancel = true;
                    return Promise.reject(data);
                } else {
                    // get request parameters from sencond parameter
                    const formId = param.package;
                    // collectFormId(formId);
                    return data;
                }
            },
            fail: error => {
                if (error.message === 'requestPayment:fail cancel') {
                    error.cancel = true;
                }
                return Promise.reject(error);
            }
        }]
    }),
    // don't need promisify
    stopRecord: new ApiConfig({ promisable:false })
);
```

