import React from 'react';
import {render, screen} from '@testing-library/react';
import Editlabel from './Editlabel';

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
