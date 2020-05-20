import React from 'react';
import Todoboard from './Todoboard';

import './App.css';

class App extends React.Component {

  render() {
    return (
        <div className="app">
          <Todoboard />
        </div>
    );
  }
}

export default App;
