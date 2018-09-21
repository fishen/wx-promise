const promise = require('./src/promise');
const Config = require('./src/config');

if (typeof Promise.prototype.finally !== 'function') {
    Promise.prototype.finally = promise.finally;
}

const COMMON_KEY = '$common';
const SUFFIX = 'Async';

exports.promisifyAll = function (wx, config = {}) {
    if (!wx) return;
    Object.keys(wx)
        .filter(key => typeof wx[key] === 'function'&& !key.endsWith('Sync') && (!config[key] || config[key].promisable !== false))
        .forEach(key => {
            const methodName = `${key}${SUFFIX}`;
            const cfg = Config.merge(config[COMMON_KEY], config[key]);
            wx[methodName] = promise.promisify(wx[key], cfg);
        })
}

exports.ApiConfig = Config;