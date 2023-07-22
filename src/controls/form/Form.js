import { createContext, useCallback, useContext } from 'react';

const FormContext = createContext({});

const Provider = FormContext.Provider;

function Form({ value: valueObj, field: objectKey, errors, schema, children, onChange }) {
    const api = {
        onChange: (val, field, others) => {
            const fieldKey = objectKey ? `${objectKey}.${field}` : field;

            const newValue = setFieldValue(valueObj, fieldKey, val);

            onChange(newValue, objectKey, { ...others });
        },
        getProps: (fieldProps) => {
            const { field, value } = fieldProps;

            if (!field) {
                return { value };
            }

            const fieldKey = objectKey ? `${objectKey}.${field}` : field;

            return {
                value: getFieldValue(valueObj, fieldKey),
                hasError: false,
                errorMessage: ''
            };
        }
    };

    return (<Provider value={api}>{children}</Provider>);
}

export default Form;

export function connect(Component) {
    return function (props) {
        const { field, value: inputValue, onChange, ...otherProps } = props;
        const form = useContext(FormContext);

        const { value = inputValue, hasError, errorMessage } = form?.getProps(props);

        const handleChange = useCallback((newValue, field, otherArgs) => {
            form?.onChange(newValue, field, otherArgs);
            onChange?.(newValue, field, otherArgs);
        }, [onChange, form]);

        return (<Component
            field={field}
            value={value}
            hasError={hasError}
            errorMessage={errorMessage}
            {...otherProps}
            onChange={handleChange}
        />);
    }
}


function getFieldValue(obj, key) {
    if (!obj && key) {
        return undefined;
    }

    if (!key) {
        return obj;
    }

    if (!key.includes('.')) {
        return obj[key];
    }

    const firstSeparator = key.indexOf('.');
    const curKey = key.substring(0, firstSeparator);
    const subKey = key.substring(firstSeparator + 1);

    return getFieldValue(obj[curKey], subKey);
}

function setFieldValue(obj, key, value) {
    if (!key) {
        return value;
    }

    if (key.includes('.')) {
        const firstSeparator = key.indexOf('.');
        const rootKey = key.substring(0, firstSeparator);
        const subKey = key.substring(firstSeparator + 1);

        if (!obj) {
            obj = {};
        }

        obj = { ...obj, [rootKey]: setFieldValue(obj[rootKey], subKey, value) };

        return obj;
    }

    return { ...obj, [key]: value };
}