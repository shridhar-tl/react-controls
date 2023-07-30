import React from 'react';
import classNames from 'classnames';
import { Button as PrimeButton } from 'primereact/button';
import useInterval from '../hooks/useInterval';
import './Button.scss';

function Button(props) {
    const {
        // custom implementations
        type,
        waitFor,
        isLoading,
        spinner = "fa fa-spinner fa-spin",

        // inbuilt props
        severity = type,
        size = "xs",

        ...otherProps
    } = props;

    const [{ remaining }, setResult] = React.useState({ remaining: waitFor });
    useInterval(setResult, 1, waitFor);

    if (remaining) {
        otherProps.disabled = true;
        otherProps.label += ` (${remaining})`;
    }

    if (isLoading) {
        otherProps.icon = spinner;
    }

    if (size === 'xs') {
        otherProps.className = classNames(otherProps.className, 'p-button-xs')
    }

    return (<PrimeButton
        severity={severity}
        size={size}
        {...otherProps}
    />);
}

export default Button;
