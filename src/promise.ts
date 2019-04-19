import { GlobalPromiseOptions, IApiOptions, IPromiseAllOptions } from "./options";

export const globalOptions: GlobalPromiseOptions = new GlobalPromiseOptions();

export function promisifyAll(options: IPromiseAllOptions) {
    options = Object.assign({
        config: {},
        filter: (name: string) => wx.canIUse(`${name}.success`),
        provider: wx,
        suffix: "Async",
    }, options);
    const { filter, suffix, config, provider } = options;
    Object.keys(options.provider)
        .filter((key) => typeof filter === "function" && filter(key, provider[key]))
        .forEach((key) => {
            const name = `${key}${suffix}`;
            provider[name] = promisify(provider[key], config && config[key]);
        });
}

function toPromise<T = any>(flags: any, interceptors: any[], ...extraParams: any[]): Promise<T> {
    let p: Promise<any> = Promise.resolve();
    interceptors
        .filter((i) => i && (typeof i === "function" || typeof i.resolve === "function"))
        .map((i) => {
            if (typeof i === "function") {
                i = { resolve: i };
            }
            ["resolve", "reject"].forEach((name) => {
                const rawFunc = i[name];
                i[name] = (value: any) => {
                    if (flags.request && Object.keys(flags.request).length > 0) {
                        return rawFunc(value, flags.request, ...extraParams);
                    } else {
                        return rawFunc(value, ...extraParams);
                    }
                };
            });
            return i;
        })
        .forEach((i) => p = p.then(i.resolve, i.reject));
    return p;
}

export function promisify(api: (param?: any) => any, options?: IApiOptions) {
    const opt: IApiOptions = options || {};
    return function(param?: object) {
        const interceptors = [];
        interceptors.push(() => Object.assign({}, opt.default, param));
        interceptors.push(opt.before);
        Array.prototype.push.apply(interceptors, globalOptions.requestInterceptors);
        const flags = { request: undefined };
        interceptors.push((value: any) => flags.request = Object.assign({}, value));
        interceptors.push((r: any) => new Promise((success, fail) => api({ ...r, success, fail })));
        Array.prototype.push.apply(interceptors, globalOptions.responseInterceptors);
        interceptors.push(opt.after);
        return toPromise(flags, interceptors);
    };
}
