import React from 'react';
import Todoboard from './Todoboard';
import {initialState, stateReducer, StateDispatchContext} from './stateManager.js';
import './App.css';

const App = () => {

  // reducer hook for managing state
  const [todoState, stateDispatch] = React.useReducer(stateReducer, JSON.parse(localStorage.getItem('listreactor-state')) || initialState);

  React.useEffect( () => {
    localStorage.setItem('listreactor-state', JSON.stringify(todoState));
  }, [todoState]);

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
