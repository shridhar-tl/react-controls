import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'primereact/checkbox';

function InputCheckbox({ inputId, checked = false, field, args, label, title, className = "", onChange, ...otherProps }) {
    const uId = React.useId();
    const chkId = inputId || (label ? `chk_${uId}` : undefined);

    const changeHandler = React.useCallback((e) => onChange?.(e.checked, field, args), [field, args, onChange]);

    return (
        <span className={`span-cb ${className}`}>
            <Checkbox inputId={chkId} onChange={changeHandler} checked={checked}
                tooltip={title} tooltipOptions={{ appendTo: document.body, position: 'top' }}
                {...otherProps} />
            {label && <label htmlFor={chkId} className="chk-label">{label}</label>}
        </span>
    );
}

InputCheckbox.propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string
};

export default InputCheckbox;