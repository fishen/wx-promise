export class ConfirmCancelPromise<T> extends Promise<T> {
    public static from<T>(promise: Promise<T>): ConfirmCancelPromise<T> {
        return new ConfirmCancelPromise(function(resolve, reject) {
            return promise.then(resolve, reject);
        });
    }
    public comfirm(fn: () => any): ConfirmCancelPromise<T> {
        const p = this.then((value: any) => (value && value.cancel ? fn() : value));
        return ConfirmCancelPromise.from(p);
    }
    public cancel(fn: () => any): ConfirmCancelPromise<T> {
        const p = this.then((value: any) => (value && value.confirm ? fn() : value));
        return ConfirmCancelPromise.from(p);
    }
}
