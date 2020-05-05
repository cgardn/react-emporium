import React from 'react';
import {render, screen} from '@testing-library/react';
import Listitem from './Listitem';

// TODO test deleting a Listitem
// TODO test rendering text passed into props

it ('renders without crashing', () => {
  const div = document.createElement('div');
  render(<Listitem />, div);
});
