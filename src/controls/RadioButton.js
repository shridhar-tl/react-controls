import React from 'react';
import { RadioButton as RButton } from 'primereact/radiobutton';

function RadioButton(props) {
    const cmpId = React.useId();
    const inputId = props.inputId || cmpId;

    const onChange = (e) => {
        const { defaultValue, field, args } = props;
        props.onChange?.(defaultValue, field, args);
    };

    const { name, value, defaultValue, className, label, title, disabled } = props;
    const checked = defaultValue === value;

    return (
        <span className={`ja-radio ${className || ""}`} title={title}>
            <RButton inputId={inputId} name={name} onChange={onChange} checked={checked} disabled={disabled} />
            {label && <label htmlFor={inputId}>{label}</label>}
        </span>
    );
}

export default RadioButton;
