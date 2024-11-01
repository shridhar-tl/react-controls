import React from 'react';
import { getPathValue, setPathValue } from '../../common/utils';

const FormContext = React.createContext({});

const Provider = FormContext.Provider;

function Form(props) {
    const $this = React.useRef({});
    $this.current.props = props;
    const { value: valueObj } = props;

    const api = React.useMemo(() => {
        return {
            onChange: (val, field, others) => {
                const { field: objectKey, args, middleware, onChange } = $this.current.props;

                const fieldKey = objectKey ? `${objectKey}.${field}` : field;

                const newValue = setPathValue(valueObj, fieldKey, middleware ? middleware(val, field, true) : val);

                onChange(newValue, objectKey, { fieldArgs: others, args });
            },
            getProps: (fieldProps, options) => {
                const { field: objectKey, middleware } = $this.current.props;

                const { valueFieldProp = 'value' } = options || {};
                const { field, [valueFieldProp]: value } = fieldProps;

                if (!field) {
                    return { [valueFieldProp]: value };
                }

                const fieldKey = objectKey ? `${objectKey}.${field}` : field;

                return {
                    [valueFieldProp]: getPathValue(valueObj, fieldKey),
                    hasError: false,
                    middleware,
                    errorMessage: ''
                };
            }
        };
    }, [valueObj]);

    return (<Provider value={api}>{props.children}</Provider>);
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
        const $this = React.useRef();
        if (!form?.getProps || !props.field) {
            return (<Component {...props} />);
        }

        const { field, [valueFieldProp]: inputValue, onChange, ...otherProps } = props;

        const { [valueFieldProp]: value = inputValue, hasError, errorMessage, middleware } = form.getProps(props, options);

        $this.current = { middleware, field, onChange, form };

        otherProps[valueFieldProp] = React.useMemo(() => {
            const { middleware, field } = $this.current;
            return middleware ? middleware(value, field, false) : value
        }, [value]);

        const handleChange = React.useCallback((newValue, field, otherArgs) => {
            const { form, onChange } = $this.current;
            form?.onChange(newValue, field, otherArgs);
            onChange?.(newValue, field, otherArgs);
        }, []);

        return (<Component
            field={field}
            hasError={hasError}
            errorMessage={errorMessage}
            {...otherProps}
            onChange={handleChange}
        />);
    }
}
