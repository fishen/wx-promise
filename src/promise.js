exports.finally = function (cb) {
    return this.then(result => (cb(result), result), error => (cb(error), error));
}

exports.promisify = function (provider, apiName, config = {}) {
    const api = typeof provider === 'function' ? provider : provider[apiName];
    if (typeof api !== 'function') return Promise.reject(new Error("Invalid member name or api provider"));
    config = config || {};
    return function (param) {
        let finalParam;
        let promise = Promise.resolve(param);
        config.before = Array.isArray(config.before) ? config.before : [];
        config.after = Array.isArray(config.after) ? config.after : [];
        const paramPromise = { success: param => finalParam = Object.assign({}, config.defaultOptions, param) };
        const apiPromise = { success: param => new Promise((success, fail) => api(Object.assign({}, param, { success, fail }))) };
        const interceptors = [...config.before, paramPromise, apiPromise, ...config.after];
        const callback = fn => result => typeof fn === 'function' && fn(result, finalParam, apiName);
        interceptors
            .filter(i => i && (i.success || i.fail))
            .forEach(i => promise = promise.then(callback(i.success), callback(i.fail)));
        Object.assign(promise, config.extend);
        return promise;
    }
}