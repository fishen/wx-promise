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
    public readonly requestInterceptors: Array<IRequestInterceptor | ((value?: any) => any)> = [];
    public readonly responseInterceptors: Array<IResponseInterceptor | ((value?: any, request?: any) => any)> = [];
}
