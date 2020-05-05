import React from 'react';
import {render, screen} from '@testing-library/react';
import Editlabel from './Editlabel';
import {shallow} from 'enzyme';

it ('renders without crashing', () => {
  const div = document.createElement('div');
  render(<Editlabel />, div);
});

it ('renders the content passed to it', () => {
  const testMessage = "Text Content"

  render(<Editlabel 
    content={testMessage}
    isEdit={false}
  />);
  expect(screen.queryByText(testMessage)).toBeInTheDocument();
});

it ('renders a span when isEdit is false', () => {
  const wrapper = shallow(<Editlabel
    content="test msg"
    isEdit={false} />);
  const out = <span>test msg</span>;
  expect(wrapper.contains(out)).toEqual(true);
});
