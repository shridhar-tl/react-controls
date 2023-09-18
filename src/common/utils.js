export function getPathValue(obj, path) {
    if (!path || !obj) { return obj; }

    let value = obj[path];
    if (!value) {
        const paths = path.split(".");
        if (paths.length > 1) {
            value = paths.reduce((val, path) => (val || undefined) && val[path], obj);
        }
    }

    return value;
}

export function setPathValue(obj, path, value) {
    if (!path && !obj) { return value; }
    obj = obj || {};

    const result = Array.isArray(obj) ? [...obj] : { ...obj };

    if (path.includes('.')) {
        const idx = path.indexOf('.');
        const root = path.substring(0, idx);
        const sub = path.substring(idx + 1);

        result[root] = setPathValue(obj[root], sub, value);
    } else {
        result[path] = value;
    }

    return result;
}
