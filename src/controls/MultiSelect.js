import React from 'react';
import { MultiSelect as PMultiSelect } from 'primereact/multiselect';

function MultiSelect(props) {
    const {
        optionLabel = "label",
        grouped, children,
        value, dataset,
        ...moreProps
    } = props;

    const $this = React.useRef({ props });
    $this.current.props = props;

    const onChange = React.useCallback((e) => {
        const { value } = e;
        let subValue = value;

        const defaultValueField = !!value?.value ? 'value' : undefined; // This line is to ensure accidentally using value objects
        const { valueField = defaultValueField, field } = $this.current.props;

        if (valueField && typeof value === "object") {
            subValue = value.map(v => v[valueField]);
        }

        $this.current.props.onChange(subValue, field);
    }, []);

    moreProps.filter = moreProps.filter ?? dataset?.length >= 15;
    moreProps.optionLabel = optionLabel;

    return (
        <PMultiSelect
            appendTo={document.body}
            value={value}

            options={dataset}
            {...moreProps}
            onChange={onChange}
        />
    );
}

export default MultiSelect;
