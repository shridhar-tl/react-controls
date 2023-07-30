import Form, { connect } from "./Form";
import AutoComplete from "../AutoComplete";
import TextBox from "../TextBox";

export { Form };
export const FormAutoComplete = connect(AutoComplete);
export const FormTextBox = connect(TextBox);