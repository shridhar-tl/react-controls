export function toObjectWithKey(array, key) {
    if (!key || !Array.isArray(array)) {
        return array;
    }

    return array.reduce((map, cur) => {
        map[key] = cur;
        return map;
    }, {});
}

export function mapKeys(array, key) {
    if (!key || !Array.isArray(array)) {
        return array;
    }

    return array.map(v => v?.[key]);
}
