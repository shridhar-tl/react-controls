import React from 'react';
import { Dropdown } from 'primereact/dropdown';

function SelectBox(props) {
    const {
        displayField = "label", // ToDo: Once all props are changed to optionLabel, this line has to be removed
        optionLabel = displayField,
        grouped, children,
        value: propValue, dataset, autoSelect,
        ...moreProps
    } = props;

    const [state, setState] = React.useState(getDerivedStateFromProps(props, {}));

    const $this = React.useRef({ props, state });
    $this.current.props = props;
    $this.current.state = state;
    $this.current.setState = setState;

    React.useEffect(() => {
        const newState = getDerivedStateFromProps($this.current.props, $this.current.state);
        if (newState) {
            $this.current.setState(newState);
        }
    }, [propValue, dataset]);

    const onChange = React.useCallback((e) => {
        const { value } = e;
        let subValue = value;

        const defaultValueField = !!value?.value ? 'value' : undefined; // This line is to ensure accidentally using value objects
        const { valueField = defaultValueField, field } = $this.current.props;

        if (valueField && typeof value === "object") {
            subValue = value[valueField];
        }

        $this.current.setState({ value, subValue });
        $this.current.props.onChange(subValue, field);
    }, []);

    const { itemTemplate } = React.useMemo(() => {
        if (grouped) {
            if (children?.length) {
                const itemTemplate = (itm, i) => {
                    if (itm.isGroup) {
                        return children[1](itm.value, i);
                    } else {
                        return children[0](itm, i);
                    }
                };

                return { itemTemplate };
            }
        }

        return {};
    }, [grouped, children]);

    $this.current.autoPick = autoSelect && !propValue && !!dataset;
    $this.current.dataset = dataset;
    $this.current.onChange = onChange;

    React.useEffect(() => {
        if ($this.current.autoPick) {
            $this.current.onChange({ value: $this.current.dataset[0] });
        }
    }, []);

    moreProps.filter = moreProps.filter ?? dataset?.length >= 15;

    return (
        <Dropdown
            appendTo={document.body}
            value={state.value}
            optionLabel={optionLabel}
            options={dataset}
            itemTemplate={itemTemplate}
            {...moreProps}
            onChange={onChange}
        />
    );
}

export default SelectBox;

const emptyValueMapper = ''; // This is to workaround valueField having empty value in dataset

function getDerivedStateFromProps(props, state) {
    const { valueField, grouped, optionGroupChildren = 'items' } = props;
    let { value = null, dataset } = props;
    let { subValue } = state;

    let newState;

    if (dataset !== state.dataset) {
        newState = { ...state };
        newState.dataset = dataset;

        if (valueField) {
            const flatDataset = grouped ? dataset.flatMap((f) => f[optionGroupChildren]) : dataset;
            newState.datasetMap = flatDataset.reduce((obj, f) => {
                let key = f[valueField];

                if (key === '') {
                    key = emptyValueMapper;
                }

                obj[key] = f;

                return obj;
            }, {});
        }
    }

    if (value !== subValue) {
        newState = newState || { ...state };
        subValue = value;
        if ((value || value === "") && (valueField && typeof value === "object")) {
            value = newState.datasetMap[value === '' ? emptyValueMapper : value];
        }
        else if (valueField && valueField !== "value" && typeof value !== "object" && typeof dataset[0] === "object") {
            value = newState.datasetMap[value === '' ? emptyValueMapper : value] || value;
        }

        newState.subValue = subValue;
        newState.value = value;
    }

    return newState;
}