const promise = require('./src/promise');
const Config = require('./src/config');

if (typeof Promise.prototype.finally !== 'function') {
    Promise.prototype.finally = promise.finally;
}

const COMMON_KEY = '$common';
const SUFFIX = 'Async';

exports.promisifyAll = function (provider, config = {}) {
    if (!provider) return;
    Object.keys(provider)
        .filter(key => typeof provider[key] === 'function' && !key.endsWith('Sync') && (!config[key] || config[key].promisable !== false))
        .forEach(key => {
            const methodName = `${key}${SUFFIX}`;
            const cfg = Config.merge(config[COMMON_KEY], config[key]);
            provider[methodName] = promise.promisify(provider, key, cfg);
        })
}

exports.promisify = function (api, config = {}, name = '') {
    if (typeof api !== 'function') throw new Error("The promisify object must be a function");
    return promise.promisify(api, name, config);
}

exports.ApiConfig = Config;