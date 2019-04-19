type ConfirmCancelPromise<T = any> = Promise<T> & {
    cancel: (fn: (param: T) => any) => ConfirmCancelPromise<T>,
    confirm: (fn: (param: T) => any) => ConfirmCancelPromise<T>,
};

export function confirmCancelPromise<T = any>(promise: Promise<T>): ConfirmCancelPromise {
    const thisP: any = promise;
    thisP.cancel = function(fn: (param: T) => any): ConfirmCancelPromise {
        const p: ConfirmCancelPromise = this.then((value: any) => (value && value.cancel ? fn(value) : value));
        p.confirm = this.confirm;
        return p;
    };
    thisP.confirm = function(fn: (param: T) => any): ConfirmCancelPromise {
        const p: ConfirmCancelPromise = this.then((value: any) => (value && value.confirm ? fn(value) : value));
        p.cancel = this.cancel;
        return p;
    };
    return thisP;
}
