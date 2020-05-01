import React from 'react';
import ReactDOM from 'react-dom';
import Todoboard from './Todoboard';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Todoboard />, div);
});
