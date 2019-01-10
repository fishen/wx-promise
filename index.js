const promise = require('./src/promise');
const Config = require('./src/config');
const Options = require('./src/options');
const Interceptor=require('./src/interceptor');

if (typeof Promise.prototype.finally !== 'function') {
    Promise.prototype.finally = promise.finally;
}

exports.promisifyAll = function (opts) {
    const options = new Options(opts || {});
    const { provider, config, integrated } = options;
    if (!provider) return;
    return Object.keys(provider)
        .reduce((result, key) => {
            const promisable = Config.canPromisify(config[key], provider, key);
            if (promisable) {
                const cfg = Config.merge(config[options.globalKey], config[key]);
                const fn = promise.promisify(provider, key, cfg);
                const methodName = `${key}${options.suffix}`;
                result[methodName] = fn;
                options.bound && (provider[methodName] = fn);
            }
            integrated && (result[key] = provider[key]);
            return result;
        }, {});
}

exports.promisify = function (api, config = {}, name = '') {
    if (typeof api !== 'function') throw new Error("The promisify object must be a function");
    return promise.promisify(api, name, config);
}

exports.PromiseOptions = Options;

exports.ApiConfig = Config;

exports.ApiInterceptor=Interceptor;