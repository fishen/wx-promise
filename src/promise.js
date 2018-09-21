exports.finally = function (callback) {
    const resolve = result => this.constructor.resolve(callback(result));
    return this.then(
        result => resolve(result).then(() => result),
        result => resolve(result).then(() => { throw result; })
    );
}

exports.promisify = function (api, config = {}) {
    if (typeof api !== 'function') return Promise.reject(new Error("the argument api must be a function"));
    return function (param) {
        let finalParam;
        let promise = Promise.resolve(param);
        config.before = Array.isArray(config.before) ? config.before : [];
        config.after = Array.isArray(config.after) ? config.after : [];
        const paramPromsie = { success: param => finalParam = Object.assign({}, config.defaultOptions, param) };
        const apiPromsie = { success: param => new Promise((success, fail) => api(Object.assign({}, param, { success, fail }))) };
        const interceptors = [...config.before, paramPromsie, apiPromsie, ...config.after];
        const callback = fn => result => fn && fn(result, finalParam);
        interceptors
            .filter(i => i && (i.success || i.fail))
            .forEach(i => promise = promise.then(callback(i.success), callback(i.fail)));
        return promise;
    }
}