
function handle(options: any, value: any) {
    if (value && typeof value === "object" && "errMsg" in value) {
        value.message = value.errMsg;
        if (options && options.removeErrMsg) {
            delete value.errMsg;
        }
    }
    return value;
}

/**
 * Replace the errMsg field with a more generic one(message).
 * @param options
 */
export function replaceMessage(options?: { removeErrMsg?: boolean }) {
    return {
        resolve(value: any) {
            return handle(options, value);
        },
        reject(error: any) {
            return Promise.reject(handle(options, error));
        },
    };
}
