import React, { useCallback, useState } from 'react';
import { AutoComplete as PrimeAutoComplete } from 'primereact/autocomplete';
import useCustomKeysHandler from '../hooks/useCustomKeysHandler';

function AutoComplete(props) {
    const [suggestions, setSuggestions] = useState([]);
    const {
        // custom props
        onCustomValue,
        displayField = 'label',
        title,
        dataset,
        args,

        // inbuilt props
        onKeyDown,
        field,
        onChange,
        dropdown = true,
        valueField,
        forceSelection = true,

        children,

        ...otherProps
    } = props;

    const itemTemplate = children ? children : (item) => <span>{item[displayField]}</span>

    const handleKeyDown = useCustomKeysHandler(otherProps, { onKeyDown });

    const filterResult = useCallback(({ query }) => {
        if (typeof dataset === "function") {
            const result = dataset(query);
            if (Array.isArray(result)) {
                setSuggestions(result);
            }
            else if (typeof result.then === "function") {
                result.then(setSuggestions);
            }
        }
        // else if (Array.isArray(dataset)) {
        //    // ToDo: need to implement when needed. alternatively suggestion props can be directly used
        //}
    }, [dataset, setSuggestions]);

    const handleChange = useCallback(event => {
        let { value: newValue } = event;

        if (valueField && typeof newValue === 'object' && newValue[valueField]) {
            newValue = newValue[valueField];
        }

        onChange?.(newValue, field, { event, args });
    }, [args, field, onChange, valueField]);

    return (
        <PrimeAutoComplete
            appendTo={document.body}
            itemTemplate={itemTemplate}
            field={displayField}
            tooltip={title}
            suggestions={suggestions}
            dropdown={dropdown}
            forceSelection={forceSelection}
            onChange={handleChange}
            completeMethod={dataset ? filterResult : undefined}
            onKeyDown={handleKeyDown}
            {...otherProps}
        />
    );
}

export default AutoComplete;