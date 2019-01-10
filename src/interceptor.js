module.exports = class Interceptor {
    constructor(params) {
        if (typeof params === 'function')
            params = { success: params };
        const { success, fail } = params;
        this.success = success;
        this.fail = fail;
    }

    get valid() {
        return [this.success, this.fail].some(fn => typeof fn === 'function');
    }
}