import React from 'react';
import {render, screen} from '@testing-library/react';
import {getByDisplayValue} from '@testing-library/dom';
import Editlabel from './Editlabel';
import {shallow} from 'enzyme';

it ('renders without crashing', () => {
  const div = document.createElement('div');
  render(<Editlabel />, div);
});

it ('renders content as plain text when isEdit is false', () => {
  const testMessage = "Text Content"

  render(<Editlabel 
    content={testMessage}
    isEdit={false}
  />);
  expect(screen.queryByText(testMessage)).toBeInTheDocument();
});

it ('renders an input form when isEdit is true', () => {
  const div = document.createElement('div');

  render(<Editlabel
    content="test msg"
    isEdit={true}
    />, div);
  expect(screen.getByDisplayValue("test msg")).toBeInTheDocument();
});
