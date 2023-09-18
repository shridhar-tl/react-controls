import React from 'react';
import { getPathValue, setPathValue } from 'react-controls/common/utils';

const FormContext = React.createContext({});

const Provider = FormContext.Provider;

function Form({ value: valueObj, field: objectKey, args, errors, schema, children, onChange }) {
    const api = {
        onChange: (val, field, others) => {
            const fieldKey = objectKey ? `${objectKey}.${field}` : field;

            const newValue = setPathValue(valueObj, fieldKey, val);

            onChange(newValue, objectKey, { fieldArgs: others, args });
        },
        getProps: (fieldProps, options) => {
            const { valueFieldProp = 'value' } = options || {};
            const { field, [valueFieldProp]: value } = fieldProps;

            if (!field) {
                return { [valueFieldProp]: value };
            }

            const fieldKey = objectKey ? `${objectKey}.${field}` : field;

            return {
                [valueFieldProp]: getPathValue(valueObj, fieldKey),
                hasError: false,
                errorMessage: ''
            };
        }
    };

    return (<Provider value={api}>{children}</Provider>);
}

export default Form;

export function useUpdate() {
    const form = React.useContext(FormContext);
    return form.onChange;
}

export function connect(Component, options) {
    const { valueFieldProp = 'value' } = options || {};

    return function (props) {
        const form = React.useContext(FormContext);

        if (!form?.getProps || !props.field) {
            return (<Component {...props} />);
        }

        const { field, [valueFieldProp]: inputValue, onChange, ...otherProps } = props;

        const { [valueFieldProp]: value = inputValue, hasError, errorMessage } = form.getProps(props, options);

        otherProps[valueFieldProp] = value;

        const handleChange = React.useCallback((newValue, field, otherArgs) => {
            form?.onChange(newValue, field, otherArgs);
            onChange?.(newValue, field, otherArgs);
        }, [onChange, form]);

        return (<Component
            field={field}
            hasError={hasError}
            errorMessage={errorMessage}
            {...otherProps}
            onChange={handleChange}
        />);
    }
}
