import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import TextBox from './TextBox';
import Button from './Button';
import 'bootstrap-daterangepicker/daterangepicker.css';
import './DatePicker.scss';

const labelText = ['This month', 'One month', 'Prev month', 'This week', 'Last 7 days', 'Prev week', 'Prev 2 weeks', 'Last 14 days'];

export function getRange() {
    return {
        'This month': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
        'One month': [moment().subtract(1, 'months').toDate(), moment().toDate()],
        'Prev month': [moment().subtract(1, 'months').startOf('month').toDate(), moment().subtract(1, 'months').endOf('month').toDate()],
        'This week': [moment().startOf('week').toDate(), moment().endOf('week').toDate()],
        'Last 7 days': [moment().subtract(6, 'days').toDate(), moment().toDate()],
        'Prev week': [moment().subtract(1, 'weeks').startOf('week').toDate(), moment().subtract(1, 'weeks').endOf('week').toDate()],
        'Prev 2 weeks': [moment().subtract(2, 'weeks').startOf('week').toDate(), moment().subtract(1, 'weeks').endOf('week').toDate()],
        'Last 14 days': [moment().subtract(13, 'days').toDate(), moment().toDate()],
    };
}

export function getQuickDateValue(quickDate, asMoment) {
    if (quickDate === 0 || quickDate > 0) {
        const dateRange = getRange();
        const key = labelText[quickDate];
        const value = key ? dateRange[key] || [] : [];
        return asMoment ? value.map(d => moment(d)) : value;
    }
}

function DatePicker(props) {
    const dateRange = React.useMemo(getRange, []);
    const { timePicker24Hour, displayFormat } = getDateTimeFormat(props);

    const { value, range } = props;
    const [state, updateState] = React.useState(() => getDateValue(value, range, displayFormat));
    const setState = React.useCallback((newState) => updateState(existing => ({ ...existing, ...newState })), [updateState]);

    const picker = React.useRef();
    const thisRef = React.useRef({ props, state, displayFormat });
    thisRef.current.state = state;
    thisRef.current.props = props;
    thisRef.current.displayFormat = displayFormat;

    const setDateFromProps = React.useCallback(() =>
        setState(getDateValue(value, range, thisRef.current.displayFormat)), [value, range, setState]);
    React.useEffect(() => { setDateFromProps(); }, [setDateFromProps]);


    const onChange = React.useCallback((e, picker) => {
        const { props, displayFormat } = thisRef.current;
        thisRef.current.manuallyEdited = false;
        const { range, field, args } = props;
        let value = picker.startDate;
        let valToPush = value?.toDate();
        let displayDate = "";

        if (range) {
            const { chosenLabel, startDate, endDate } = picker;
            if (startDate && endDate) {
                valToPush = { fromDate: startDate.toDate(), toDate: endDate.toDate() };

                const idx = labelText.indexOf(chosenLabel);
                if (idx >= 0) {
                    valToPush.quickDate = idx;
                }

                displayDate = `${startDate.format(displayFormat)} - ${endDate.format(displayFormat)}`;

                value = [valToPush.fromDate, valToPush.toDate];
            }
        }
        else if (value?.isValid()) {
            displayDate = value.format(displayFormat);
        }

        setState({ value, displayDate });
        props.onChange(valToPush, field, args);
    }, [setState]);


    const setDate = React.useCallback((e) => {
        const { manuallyEdited, props, state, displayFormat } = thisRef.current;

        if (manuallyEdited) {
            let { target: { value } } = e;
            value = value.trim();
            if (!value && props.allowClear === true) {
                onChange(null, { startDate: null });
                return;
            }
            let startDate = moment(value, displayFormat);
            if (!startDate.isValid()) {
                startDate = moment(value);
            }

            if (!startDate.isValid() || startDate.format(displayFormat) !== value) {
                startDate = state.value;
            }

            picker.setStartDate(startDate);
            picker.setEndDate(startDate);

            onChange(null, { startDate });
        } else if (e?.currentTarget && props.onBlur) {
            props.onBlur(e);
        }
    }, [onChange]);

    const onKeyDown = React.useCallback((e) => {
        const { props } = thisRef.current;

        const { keyCode } = e;

        if (keyCode === 13) {
            setDate(e);
        } else if (props.onKeyDown) {
            if (keyCode === 27) {
                setDateFromProps(props);
                thisRef.current.manuallyEdited = false;
            }
            props.onKeyDown(e);
        }
    }, [setDate, setDateFromProps]);

    const dateEdited = React.useCallback(() => thisRef.current.manuallyEdited = true, []);

    const { disabled, style, className, autoFocus } = props;
    const { displayDate } = state;

    return (<div className={classnames('react-bootstrap-daterangepicker-container', className)}>
        <DateRangePicker ref={picker} style={style} className={className}
            disabled={disabled} initialSettings={getPickerSettings({ timePicker24Hour, dateRange, props, state })}
            onApply={onChange}>
            <span>
                <TextBox className="date-range-ctl" value={displayDate}
                    readOnly={range} placeholder={getPlaceholderText(props)} autoFocus={autoFocus}
                    onChange={range ? undefined : dateEdited}
                    onBlur={range ? undefined : setDate}
                    onKeyDown={onKeyDown}
                />
                <Button text icon="fa fa-calendar" className="icon" />
            </span>
        </DateRangePicker>
    </div>);
}

export default DatePicker;


function getDateValue(value, range, displayFormat) {
    const newState = { displayDate: "" };

    if (value) {
        if (range) {
            if (typeof value === "object") {
                if (value.quickDate >= 0) {
                    value = getQuickDateValue(value.quickDate, true);
                } else {
                    value = typeof value === "object" && value.fromDate ? [moment(value.fromDate), moment(value.toDate) || null] : [];
                }

                newState.value = value;
                if (value[0] && value[1]) {
                    newState.displayDate = `${value[0].format(displayFormat)} - ${value[1].format(displayFormat)}`;
                }
            }
        }
        else {
            newState.value = moment(value);
            newState.displayDate = newState.value.format(displayFormat);
        }
    }
    else if (range) {
        newState.value = [];
    }

    return newState;
}

function getDateTimeFormat(props) {
    let timeFormat = DatePicker.defaultTimeFormat || " hh:mm tt";
    const timePicker24Hour = timeFormat.indexOf("tt") === -1;
    timeFormat = timeFormat.replace("tt", "A").replace(".ss", "").replace(":ss", "");
    const displayFormat = props.dateFormat || `DD-MMM-YYYY${props.showTime ? timeFormat : ""}`;

    return { timePicker24Hour, displayFormat };
}

function getPlaceholderText(props) {
    const { multiselect, range } = props;
    let { placeholder } = props;

    //var selectionMode = "single";
    if (multiselect === true) {
        //selectionMode = "multiple";
        placeholder = placeholder || "Select one or more date";
    }
    else if (range === true) {
        //selectionMode = "range";
        placeholder = placeholder || "Select a date range";
    }

    return placeholder || "Select a date";
}


function getPickerSettings({
    dateRange, timePicker24Hour,
    props: { showTime, range, },
    state: { value }
}) {
    const defaultProps = {
        showDropdowns: true,
        timePicker: showTime || false,
        alwaysShowCalendars: false,
        maxSpan: 6,
        autoApply: true,
        linkedCalendars: false,
        autoUpdateInput: false
    };

    let result = null;

    if (range) {
        result = {
            ...defaultProps,
            startDate: value[0],
            endDate: value[1],
            ranges: dateRange,
            singleDatePicker: false,
            showCustomRangeLabel: true,
        };
    } else {
        result = {
            ...defaultProps,
            singleDatePicker: true,
            startDate: value,
            endDate: value,
            timePicker24Hour,
        };
    }

    return result;
}