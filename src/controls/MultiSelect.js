import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';

function SelectBox(props) {
    const {
        displayField = "label", multiselect, group, children,
        value: propValue, dataset: ds, autoSelect,
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
    }, [propValue, ds]);

    const onChange = React.useCallback((e) => {
        const { value } = e;
        let subValue = value;

        const { multiselect, valueField = 'value', field } = $this.current.props;

        if (valueField && typeof value === "object") {
            if (multiselect) {
                subValue = value.map(v => v[valueField]);
            }
            else {
                subValue = value[valueField];
            }
        }

        $this.current.setState({ value, subValue });
        $this.current.props.onChange(subValue, field);
    }, []);

    const { groupedDataset } = $this.current.state;

    const { dataset, itemTemplate } = React.useMemo(() => {
        let dataset = ds;

        if (group) {
            dataset = groupedDataset;
            if (children?.length) {
                const itemTemplate = (itm, i) => {
                    if (itm.isGroup) {
                        return children[1](itm.value, i);
                    } else {
                        return children[0](itm, i);
                    }
                };

                return { itemTemplate, dataset };
            }
        }

        return { dataset };
    }, [ds, group, groupedDataset, children]);

    const { value } = state;

    $this.current.autoPick = autoSelect && !propValue && !!dataset;
    $this.current.dataset = dataset;
    $this.current.onChange = onChange;

    React.useEffect(() => {
        if ($this.current.autoPick) {
            $this.current.onChange({ value: $this.current.dataset[0] });
        }
    }, []);

    const filter = dataset && dataset.length >= 15;

    if (multiselect) {
        return (
            <MultiSelect
                appendTo={document.body}
                value={value}
                optionLabel={displayField}
                options={dataset}
                filter={filter}
                {...moreProps}
                onChange={onChange}
            />
        );
    }
    else {
        return (
            <Dropdown
                appendTo={document.body}
                value={value}
                optionLabel={displayField}
                options={dataset}
                filter={filter}
                itemTemplate={itemTemplate}
                {...moreProps}
                onChange={onChange}
            />
        );
    }
}

export default SelectBox;

function getDerivedStateFromProps(props, state) {
    const { valueField, multiselect, group, displayField } = props;
    let { value = null, dataset } = props;
    let { subValue } = state;

    let newState;

    if (group && dataset !== state.dataset) {
        newState = { ...state };
        newState.dataset = dataset;
        const groupedDataset = [];

        dataset.forEach(grp => {
            const grpWrap = { isGroup: true, value: grp };
            if (displayField) {
                grpWrap[displayField] = "";
            }
            groupedDataset.push(grpWrap);
            grp.items.forEach(itm => groupedDataset.push(itm));
        });

        newState.groupedDataset = groupedDataset;
        dataset = groupedDataset;
    }

    if (value !== subValue) {
        newState = newState || { ...state };
        subValue = value;
        if ((value || (!multiselect && value === "")) && (valueField && typeof value === "object")) {
            if (multiselect) {
                value = dataset.filter(d => value.indexOf(d[valueField]) >= 0);
            }
            else {
                value = dataset.filter(d => d[valueField] === value)[0];
            }
        }
        else if (valueField && valueField !== "value" && typeof value !== "object" && typeof dataset[0] === "object") {
            if (!multiselect) {
                value = dataset.filter(d => d[valueField] === value)[0] || value;
            }
        }

        newState.subValue = subValue;
        newState.value = value;
    }

    return newState;
}