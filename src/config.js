module.exports = class Config {
    constructor({ defaultOptions = {}, promisable = true, before = [], after = [], extend } = {}) {
        this.defaultOptions = defaultOptions;
        this.promisable = promisable;
        this.before = before;
        this.after = after;
        this.extend = extend;
    }

    static merge(config1, config2) {
        if (!config1) return config2;
        if (!config2) return config1;
        return new Config({
            defaultOptions: Object.assign({}, config1.defaultOptions, config2.defaultOptions),
            promisable: config2.promisable,
            before: [...(config1.before || []), ...(config2.before || [])],
            after: [...(config1.after || []), ...(config2.after || [])],
            extend: Object.assign({}, config1.extend, config2.extend)
        });
    }

    static canPromisify(config, provider, key) {
        return typeof provider[key] === 'function' && !key.endsWith('Sync') && (!config || config.promisable !== false);
    }
}