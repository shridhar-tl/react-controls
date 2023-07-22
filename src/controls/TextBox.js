import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useCallback, useEffect, useMemo, useState } from 'react';

function TextBox(props) {
    const {
        field, args, value: passedValue, multiline,
        hasError, errorMessage,
        onChange, onKeyDown,
        ...otherProps
    } = props;
    const [value, setValue] = useState(passedValue || '');

    useEffect(() => { setValue(passedValue || ''); }, [passedValue]);

    const handleChange = useCallback(event => {
        const { target: { value: newValue } } = event;
        setValue(newValue);

        onChange?.(newValue, field, { event, args });

    }, [args, field, onChange, setValue]);

    const hasCustomKeyEvent = useMemo(() =>
        Object
            .keys(otherProps)
            .some(k => k.startsWith('onKey_')),
        []); // eslint-disable-line react-hooks/exhaustive-deps

    let handleKeyDown = onKeyDown;

    if (hasCustomKeyEvent) {
        handleKeyDown = event => {
            const { key } = event;

            if (key && key.length > 1) {
                const func = otherProps[`onKey_${key}`];
                if (func) {
                    func(value);
                }
            }

            if (onKeyDown) {
                onKeyDown(event);
            }
        };
    }

    if (multiline) {
        return (
            <InputTextarea
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                {...otherProps}
            />
        );
    }
    else {
        return (
            <InputText
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                {...otherProps}
            />
        );
    }
}

export default TextBox;
