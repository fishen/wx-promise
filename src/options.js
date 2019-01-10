module.exports = class Options {
    constructor({ provider, config, suffix, globalKey, bound = true, integrated = true }) {
        this.provider = provider;
        this.config = config || {};
        this.suffix = suffix || 'Async';
        this.globalKey = globalKey || '$global';
        this.bound = bound;
        this.integrated = integrated;
    }
}