import React from 'react';

export default function useInterval(callback, interval, max) {
    const intervalRef = React.useRef(null);
    const callbackRef = React.useRef(callback);
    const maxRef = React.useRef(max);

    React.useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    React.useEffect(() => {
        maxRef.current = max;
    }, [max]);

    React.useEffect(() => {
        const clearInterval = () => {
            if (intervalRef.current === null) {
                return;
            }

            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        const tick = () => {
            maxRef.current -= interval;
            callbackRef.current({ remaining: maxRef.current });

            if (maxRef.current < interval) {
                clearInterval();
            }
        }

        if (typeof interval === 'number' && interval > 0 && (!maxRef.current || maxRef.current > interval)) {
            intervalRef.current = window.setInterval(tick, interval * 1000);
            return clearInterval;
        }
    }, [interval]);

    return intervalRef;
}