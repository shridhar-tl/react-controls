import React from 'react';

export default function useCustomKeysHandler(props, { onKeyDown, value }) {
    const hasCustomKeyEvent = React.useMemo(() =>
        Object
            .keys(props)
            .some(k => k.startsWith('onKey_')),
        []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!hasCustomKeyEvent) {
        return onKeyDown;
    }

    return event => {
        const { key } = event;

        if (key && key.length > 1) {
            const func = props[`onKey_${key}`];
            if (func) {
                func(value);
            }
        }

        if (onKeyDown) {
            onKeyDown(event);
        }
    };
}