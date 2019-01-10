const Interceptor = require('./interceptor');

exports.finally = function (cb) {
    return this.then(result => (cb(result), result), error => (cb(error), error));
}

exports.promisify = function (provider, fnName, config = {}) {
    const api = typeof provider === 'function' ? provider : provider[fnName];
    if (typeof api !== 'function') return Promise.reject(new Error("Invalid member name or api provider"));
    config = config || {};
    return function (param) {
        let finalParam;
        config.before = Array.isArray(config.before) ? config.before : [];
        config.after = Array.isArray(config.after) ? config.after : [];
        const paramPromise = param => finalParam = Object.assign({}, config.defaultOptions, param);
        const apiPromise = param => new Promise((success, fail) => api(Object.assign({}, param, { success, fail })));
        const interceptors = [...config.before, paramPromise, apiPromise, ...config.after];
        const cb = fn => result => fn(result, finalParam, fnName);
        let promise = interceptors
            .map(i => new Interceptor(i))
            .filter(i => i.valid)
            .reduce((p, i) => p.then(cb(i.success), cb(i.fail)), Promise.resolve(param));
        Object.assign(promise, config.extend);
        return promise;
    }
}