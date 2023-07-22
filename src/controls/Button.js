import React from 'react';
import { Button as PrimeButton } from 'primereact/button';
import useInterval from '../hooks/useInterval';

function Button(props) {
    const {
        // custom implementations
        type,
        waitFor,
        isLoading,
        spinner = "fa fa-spinner fa-spin",

        // inbuilt props
        severity = type,
        size = "small",
        onClick,

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

    return (<PrimeButton
        severity={severity}
        size={size}
        {...otherProps}
    />);
}

export default Button;
