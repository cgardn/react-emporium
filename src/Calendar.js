import React from 'react';
import './Calendar.css';

const utils = {
  dayCounts: {
    0: 31,
    1: 28,
    2: 31,
    3: 30,
    4: 31,
    5: 30,
    6: 31,
    7: 31,
    8: 30,
    9: 31,
    10: 30,
    11: 31,
  },
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November',
    'December'
  ],
  thisMonth: () => {
    const d = new Date();
    return d.getMonth();
  },
};

const Monthpicker = (props) => {
  return (
    <form onSubmit={event => {
      props.onMonthSubmit(event.target.value)}}>
      <select
        onChange={event => {
          props.onMonthSubmit(event.target.value)}}
        name="month"
        id="month-select"
        value={props.month}
      >
        {utils.monthNames.map( (item, index) => (
          <option
            key={index+100}
            value={index}
          > {item}
          </option>
        ))};
      </select>
    </form>
  ); 
};

const Day = (props) => {
  return (
    <div className={props.today === props.number ? "calendar-day calendar-day-today" : "calendar-day"}>
      <div className="calendar-day-number">
        {props.number}
      </div>
    </div>
  );
};

const Week = (props) => {
  // receives current day, returns list of <Day /> with 
  // correct numbering (Monday to Sunday)
  //
  // needs to keep monday first and just move the shaded "today" day around currentDay changes on calendar parent
  return (
    <div className="calendar-container">
      {[...Array(7).keys()].map( (item, index) => (
        <Day
          key={index+1}
          number={index+(props.day-3)}
          today={props.day}
        />
      ))}
    </div>
  );
};

const Calendar = (props) => {
  const [month, setMonth] = React.useState(utils.thisMonth);
  const [currentDay, setCurrentDay] = React.useState(10);
  const handleMonthChange = (newMonth) => {
    setMonth(newMonth);
  };
  const handleDayChange = (newDay) => {
    setCurrentDay(newDay);
  };
  const handleSubmit = () => {
    console.log(currentDay);
  };

  return (
    <div className="app">
    <Monthpicker
      onMonthSubmit={handleMonthChange}
      month={month}
    />
    Current Day: {currentDay}
    <form 
      onSubmit={event => {
        event.preventDefault()
        handleSubmit()
      }}
    >
      <input
        onChange={event => {
        handleDayChange(event.target.value)}}
      ></input>
    </form>
    <Week day={currentDay} />
    </div>
  );
};

export default Calendar;
