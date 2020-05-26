import React from 'react';
import Todoboard from './Todoboard';
import {initialState, stateReducer, StateDispatchContext} from './stateManager.js';
import './App.css';

const App = () => {

  const [todoState, stateDispatch] = React.useReducer(stateReducer, initialState);

  const Container = (props) => {
    return (
      <StateDispatchContext.Provider value={stateDispatch}>
        <div className="app">
          {props.children}
        </div>
      </StateDispatchContext.Provider>
    );
  };

  return (
    <Container>
      <Todoboard todoState={todoState} />
    </Container>
  );
}

export default App;
