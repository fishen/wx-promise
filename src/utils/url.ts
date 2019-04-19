export function serializeParams(param: any): string {
    if (!param) { return ""; }
    if (typeof param !== "object") {
        return param.toString();
    } else {
        return Object.keys(param)
            .filter((key) => param[key] !== undefined)
            .map((key) => `${key}=${param[key]}`)
            .join("&");
    }
}

export function join(url = "", params = {}): string {
    const queryString = serializeParams(params);
    if (typeof url !== "string") { url = String(url); }
    if (url.includes("?")) {
        if (url[url.length - 1] === "?") {
            return url + queryString;
        } else {
            return url + "&" + queryString;
        }
    } else {
        return url + "?" + queryString;
    }
}
