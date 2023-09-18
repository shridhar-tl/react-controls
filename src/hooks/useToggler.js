import React from 'react';

function useToggler(defaultValue) {
    const [value, setValue] = React.useState(defaultValue ?? true);
    const toggle = React.useCallback(() => setValue((val) => !val), [setValue]);

    return [value, toggle, setValue];
}

export default useToggler;
