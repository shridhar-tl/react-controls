import React from 'react';
import PropTypes from 'prop-types';
import { ToggleButton } from 'primereact/togglebutton';

function Toggle({ checked = false, field, args, title, className, onChange, ...otherProps }) {

    const changeHandler = React.useCallback((e) => onChange?.(e.value, field, args), [field, args, onChange]);

    return (
        <ToggleButton className={className} onChange={changeHandler} checked={checked} title={title} {...otherProps} />
    );
}

Toggle.propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired
};

export default Toggle;