import React from 'react';
import { Chips } from 'primereact/chips';

function MultiValueText(props) {
    const $this = React.useRef({ props });
    $this.current.props = props;

    const valueChanged = React.useCallback((e) => {
        const { onChange, field, args, clearIfEmpty } = $this.current.props;
        if (clearIfEmpty && !e.value.length) {
            onChange(undefined, field, args);
        } else {
            onChange(e.value, field, args);
        }
    }, []);

    const onBlur = React.useCallback((e) => {
        let item = e.currentTarget.value?.trim();

        const { value: propsValue, minItemLength = 1, useUpperCase = false } = $this.current.props;

        if (!item || item.length < minItemLength) { return; }

        if (useUpperCase) {
            item = item.toUpperCase();
        }

        let value = propsValue || [];

        if (!value.some(v => v.toUpperCase() === item.toUpperCase())) {
            value = [...value, item];
            e.currentTarget.value = "";
            valueChanged({ value });
        }
    }, [valueChanged]);

    const { separator = ",", field, args, minItemLength, useUpperCase, clearIfEmpty, ...others } = props;

    return (<Chips
        separator={separator}
        {...others}
        onBlur={onBlur}
        onChange={valueChanged}
    />);
}

export default MultiValueText;
