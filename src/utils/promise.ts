function addMessage(callback: (params: any) => void) {
    return function(res: any) {
        if (res.errMsg) {
            res.message = res.errMsg;
        }
        callback(res);
    };
}

const apiOptions = new Map<string, any>();

/**
 * 设置指定的API的全局配置
 * @options options API配置参数,键为API名称, 例：'wx.request'
 */
export function setApiOptions(options: Record<string, object | ((request: object) => object)>) {
    if (options && typeof options === "object") {
        Object.keys(options).forEach((key) => apiOptions.set(key, options[key]));
    }
}

/**
 * 将微信小程序API转换为promise风格类型的接口
 * @param api 指定的API
 * @param name API名称
 * @param args API参数
 */
export function promisify<T = any>(api: (params: any) => void, name: string, ...args: any[]): Promise<T> {
    if (typeof api !== "function") { return Promise.reject(new Error("invalid promisable function")); }
    return new Promise(((resolve, reject) => {
        let params = Object.assign({}, ...args, {
            fail: addMessage(reject),
            success: addMessage(resolve),
        });
        let options: any = apiOptions.get(name);
        if (typeof options === "function") {
            options = options(params);
        } else {
            params = Object.assign({}, options, params);
        }
        console.log(name, params);
        api(params);
    }));
}
