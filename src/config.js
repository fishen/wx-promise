module.exports = class Config {
    constructor({ defaultOptions = {}, promisable = true, before = [], after = [] } = {}) {
        this.defaultOptions = defaultOptions;
        this.promisable = promisable;
        this.before = before;
        this.after = after;
    }

    static merge(config1, config2) {
        if (!config1) return config2;
        if (!config2) return config1;
        return new Config({
            defaultOptions: Object.assign({}, config1.defaultOptions, config2.defaultOptions),
            promisable: config2.promisable,
            before: [...(config1.before || []), ...(config2.before || [])],
            after: [...(config1.after || []), ...(config2.after || [])]
        });
    }
}