// TODO known issues:
//  - since the timeout is being cleaned and reset on every click, each click begins the "current
//    second" over again. This has the effect of extending the timer beyond 10 seconds. If the timer
//    shows as 7 second, you could have as little as 6.0001 seconds remaining, but clicking any button
//    regenerates the timer at 7.0 seconds again, effectively adding time. You can see this in action
//    by clicking several buttons in a row rapidly, which will make the timer appear to pause and
//    not tick down.

import React from 'react';
import {useState, useEffect} from 'react';
import './StarmatchGame.css';

const PlayNumber = (props) => (
  <button
    className="number"
    style={{ backgroundColor: colors[props.buttonStatus] }}
    onClick={ () => {
      props.onClick(props.number, props.buttonStatus);
    }}
  >
      {props.number}
  </button>
);

const StarsDisplay = (props) => (
  <>
    {utils.range(1, props.count).map(starId => 
      <div className="star" key={starId} />
    )}
  </>
);

const PlayAgain = props => (
  <div className="game-done">
    <div 
      className="message"
      style={{ color: props.gameStatus === 'lost' ? 'red' : 'green' }} 
    >
      {props.gameStatus === 'lost' ? 'Game Over' : 'Nice'}
    </div>
    <button onClick={props.onClick}>Play Again</button>
  </div>
);

// Custom Hook, a stateful function for managing state
//   - start the name with 'use' to follow hook naming convention
const useGameState = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1,9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);
  // setInterval runs the given function at specified interval
  //  - until you manually clear it with clearInterval
  // setTimeout runs the given function only once
  //  - we can use it here in React because useEffect triggers every time
  //    the component is rendered or re-rendered, and since the component is
  //    re-rendered on every change, the Timeout is reset every time it triggers.
  useEffect(() => {
    if (secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout( () => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      // useEffect can return a function, which will be invoked whenever this component is
      //   about to be unmounted and re-rendered
      //   - it is important to clean up after your effects whenever you use them
      return () => clearTimeout(timerId);
    } 
  });

  const setGameState = (newCandidateNums) => {
   if (utils.sum(newCandidateNums) !== stars) {
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(
        n => !newCandidateNums.includes(n)
      );
      // redraw number of stars (from what's available)
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  }

  return { stars, availableNums, candidateNums, secondsLeft, setGameState };
};

const Game = (props) => {

  const {
    stars,
    availableNums,
    candidateNums,
    secondsLeft,
    setGameState,
  } = useGameState();
  
  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  const gameStatus = availableNums.length === 0
    ? 'won'
    : secondsLeft === 0 ? 'lost' : 'active'


  const numberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return 'used';
    }
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? 'wrong' : 'candidate';
    }
    return 'available';
  };
  
  const onNumberClick = (number, currentStatus) => {
    // based on current status of clicked number, what is the new status?  
    // currentStatus -> newStatus
    if (gameStatus !== 'active' || currentStatus === 'used') {
      return;
    }
    const newCandidateNums = 
      currentStatus === 'available' 
        ? candidateNums.concat(number)
        : candidateNums.filter(cn => cn !== number);
    setGameState(newCandidateNums);
  }
    

  return (
    <div className="game">
      <div className="help">
        Pick one or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== 'active' ? (
            <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus} />
          ) : (
            <StarsDisplay count={stars} />
          )}
        </div>
        <div className="right">
          {utils.range(1, 9).map(number =>
            <PlayNumber
              key={number}
              buttonStatus={numberStatus(number)}
              number={number}
              onClick={onNumberClick}
            />
          )}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
}

const StarMatch = () => {
  const [gameId, setGameId] = useState(1);
  return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)} />;
};

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math stuff, this is an object full of functions
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max
  range: (min, max) => Array.from({ length: max - min + 1}, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max,
  //   pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

class StarmatchGame extends React.Component {
  render() {
    return (
      <StarMatch />
    );
  }
}

export default StarmatchGame;
