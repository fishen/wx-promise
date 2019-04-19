declare module "wxa-promise/src/options" {
    export interface IRequestInterceptor {
        resolve: (value?: any) => any;
        reject?: (error?: any) => any;
    }
    export interface IResponseInterceptor {
        resolve: (value?: any, request?: any) => any;
        reject?: (error?: any, request?: any) => any;
    }
    export interface IPromiseAllOptions {
        provider: Record<string, any>;
        suffix?: string;
        filter?: (name: string, api: (param?: any) => any) => boolean;
        config?: Record<string, IApiOptions>;
    }
    export interface IApiOptions {
        default?: object;
        before?: IRequestInterceptor | ((value?: any) => any);
        after?: IResponseInterceptor | ((value?: any, request?: any) => any);
    }
    export class GlobalPromiseOptions {
        readonly requestInterceptors: Array<IRequestInterceptor | ((value?: any) => any)>;
        readonly responseInterceptors: Array<IResponseInterceptor | ((value?: any, request?: any) => any)>;
    }
}
declare module "wxa-promise/src/promise" {
    import { GlobalPromiseOptions, IApiOptions, IPromiseAllOptions } from "wxa-promise/src/options";
    export const globalOptions: GlobalPromiseOptions;
    export function promisifyAll(options: IPromiseAllOptions): void;
    export function promisify(api: (param?: any) => any, options?: IApiOptions): (param?: object) => Promise<any>;
}
declare module "wxa-promise/src/interceptors/replaceMessage" {
    /**
     * Replace the errMsg field with a more generic one(message).
     * @param options
     */
    export function replaceMessage(options?: {
        removeErrMsg?: boolean;
    }): {
        resolve(value: any): any;
        reject(error: any): any;
    };
}
declare module "wxa-promise/src/interceptors/index" {
    export { replaceMessage } from "wxa-promise/src/interceptors/replaceMessage";
}
declare module "wxa-promise/src/confirmCancelPromise" {
    export class ConfirmCancelPromise<T> extends Promise<T> {
        static from<T>(promise: Promise<T>): ConfirmCancelPromise<T>;
        comfirm(fn: () => any): ConfirmCancelPromise<T>;
        cancel(fn: () => any): ConfirmCancelPromise<T>;
    }
}
declare module "wxa-promise" {
    export { promisify, promisifyAll, globalOptions } from "wxa-promise/src/promise";
    import * as interceptors from "wxa-promise/src/interceptors/index";
    export { interceptors };
    export { ConfirmCancelPromise } from "wxa-promise/src/confirmCancelPromise";
}