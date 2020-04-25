import React from 'react';
import Todoboard from './Todoboard';
import Calendar from './Calendar';

import './App.css';

const App = () => {
  return (
    <div className="app">
      <Calendar />
      <hr style={{width: "90vw"}}/>
      <Todoboard />
    </div>
  );
};

export default App;
