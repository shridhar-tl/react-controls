import Form, { connect } from "./Form";
import AutoComplete from "../AutoComplete";
import Checkbox from "../Checkbox";
import DatePicker from "../DatePicker";
import MultiSelect from '../MultiSelect';
import MultiValueText from '../MultiValueText';
import RadioButton from "../RadioButton";
import SelectBox from "../SelectBox";
import TextBox from "../TextBox";
import ToggleButton from "../ToggleButton";

export { Form };

export const FormAutoComplete = connect(AutoComplete);
export const FormCheckbox = connect(Checkbox, { valueFieldProp: 'checked' });
export const FormDatePicker = connect(DatePicker);
export const FormMultiSelect = connect(MultiSelect);
export const FormMultiValueText = connect(MultiValueText);
export const FormRadioButton = connect(RadioButton);
export const FormSelectBox = connect(SelectBox);
export const FormTextBox = connect(TextBox);
export const FormToggleButton = connect(ToggleButton, { valueFieldProp: 'checked' });
