import React from 'react';
import { Chips } from 'primereact/chips';

function MultiValueText(props) {
    const $this = React.useRef({ props });
    $this.current.props = props;

    const valueChanged = React.useCallback((e) => {
        const { onChange, field, args } = $this.current.props;
        onChange(e.value, field, args);
    }, []);

    const onBlur = React.useCallback((e) => {
        let item = e.currentTarget.value?.trim();

        const { value: propsValue, minItemLength = 1, useUpperCase = false, onChange } = $this.current.props;

        if (!item || item.length < minItemLength) { return; }

        if (useUpperCase) {
            item = item.toUpperCase();
        }

        let value = propsValue || [];

        if (!value.some(v => v.toUpperCase() === item.toUpperCase())) {
            value = [...value, item];
            e.currentTarget.value = "";
            onChange(value);
        }
    }, []);

    const { value, placeholder } = $this.current.props;

    return (<Chips value={value} onChange={valueChanged} placeholder={placeholder} onBlur={onBlur} separator="," />);
}

export default MultiValueText;
