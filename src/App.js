import { useState } from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { Button } from './controls';
import { Form, FormAutoComplete, FormSelectBox, FormTextBox } from './controls/form';
import DndProvider, { Sortable } from './controls/drag-drop';
import './App.css';

const stateList = [
  { value: 'ap', label: 'Andhra Pradash' },
  { value: 'arp', label: 'Arunachal Pradash' },
  { value: 'jk', label: 'Jammy & Kashmir' },
  { value: 'ka', label: 'Karnataka' },
  { value: 'kr', label: 'Kerala' },
  { value: 'mp', label: 'Madhya Pradesh' },
  { value: 'mr', label: 'Maharastra' },
  { value: 'tn', label: 'Tamil Nadu' },
];

function App() {
  const [profile, setProfile] = useState({ address: { streetName: 'test street' } });

  return (
    <div className="App">
      <div>
        {JSON.stringify(profile, null, 2)}
      </div>

      <br /><br /><br />

      <Form value={profile} field='address' onChange={setProfile} schema={addressSchema} >
        <FormTextBox field='streetName' multiline />
        <FormTextBox field='city' onKey_Enter={() => alert('Enter pressed')} />
        <FormAutoComplete field='state'
          dataset={q => stateList.filter(s => s.label.toLowerCase().includes(q.toLowerCase()))}
          onKey_Enter={() => alert('Enter pressed')} />
        <FormSelectBox field='ungroupedStates' dataset={stateList} />

        <Button label="Waiting" waitFor={10} />
        <Button label="Loading" isLoading />
      </Form>
      <DndProvider>
        <SortableExample1 />
        <SortableExample2 />
      </DndProvider>
    </div>
  );
}

const sortableExampleStyles = { float: 'left', margin: '25px' };

function SortableExample1() {
  const [items, setItems] = useState([
    { id: 1, text: 'Human', type: 'Living' },
    { id: 2, text: 'Crow', type: 'Living' },
    { id: 3, text: 'Zebra', type: 'Living' },
    { id: 4, text: 'Fish', type: 'Living' },
    { id: 5, text: 'Tortoise', type: 'Living' },
  ]);

  return (<div style={sortableExampleStyles}>
    <h2>Living things only</h2>
    <Sortable items={items} accept="Living" onChange={setItems}>
      {(item) => (<div className="sortable-item">{item.text}</div>)}
    </Sortable>
  </div>);
}

function SortableExample2() {
  const [items, setItems] = useState([
    { id: 6, text: 'Car', type: 'NonLiving' },
    { id: 7, text: 'Airplane', type: 'NonLiving' },
    { id: 8, text: 'Bike', type: 'NonLiving' },
    { id: 9, text: 'Ship', type: 'NonLiving' },
    { id: 10, text: 'Pearl', type: 'NonLiving' },
  ]);

  return (<div style={sortableExampleStyles}>
    <h2>Any objects</h2>
    <Sortable
      items={items}
      accept={["Living", "NonLiving"]}
      onChange={setItems}
      useDragRef
    >
      {(item, i, { dragRef }) => (<div className="sortable-item">
        <span ref={dragRef}>::: &nbsp;</span>
        {item.text}
      </div>)}
    </Sortable>
  </div>);
}

const addressSchema = {
  streetName: {
    changeTrigger: 'change', // blur
    validations: {
      trigger: 'change', //blur
      // Applicable for numeric
      range: [],
      rangeMessage: '',

      // For everything
      required: true,
      requiredMessage: '',

      // For text box and numeric field only
      regexValidator: '',
      regexMessage: '',

      validator: function () {

      },
      customErrorMessage: ''
    }
  }
};

export default App;
