import React from 'react';
import ReactDOM from 'react-dom';
const {useState} = require('react');

function Button(props) {
  const handleClick = () => props.onClickFunction(props.increment);
  return (
    <button onClick={handleClick}>
      +{props.label}
    </button>
  );
}

function Display(props) {
  return (
    <div>{props.message}</div>
  );
}

function App() {

  const [counter, setCounter] = useState(0);
  const [metalCounter, setMetalCounter] = useState(10);
  const incrementCounter = (incrementValue) => setCounter(counter+incrementValue);
  const incrementMetalCounter = (incrementValue) => setMetalCounter(metalCounter+incrementValue);
  const resetCounter = (incrementValue) => setCounter(0);
  const resetMetalCounter = (incrementValue) => setMetalCounter(0);

  return (
    <>
      Coins
      <Display message={counter}/>
      <Button onClickFunction={incrementCounter} increment={1} label="1" />
      <Button onClickFunction={incrementCounter} increment={5} label="5" />
      <Button onClickFunction={incrementCounter} increment={10} label="10" />
      <Button onClickFunction={incrementCounter} increment={100} label="100" />
      <br/>
      <Button onClickFunction={resetCounter} label="Reset Coins" />
      <br/>
      Metal
      <Display message={metalCounter}/>
      <Button onClickFunction={incrementMetalCounter} increment={1} label="1" />
      <Button onClickFunction={incrementMetalCounter} increment={5} label="5" />
      <Button onClickFunction={incrementMetalCounter} increment={10} label="10" />
      <Button onClickFunction={incrementMetalCounter} increment={100} label="100" />
      <br/>
      <Button onClickFunction={resetMetalCounter} label="Reset Metal" />
    </>
  );
}

export default App;
