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

const Calendar = (props) => {
  const [month, setMonth] = React.useState(utils.thisMonth);
  const handleMonthChange = (newMonth) => {
    setMonth(newMonth);
  };
  return (
    <>
    <Monthpicker
      onMonthSubmit={handleMonthChange}
      month={month}
    />
    <div className="calendar-container">

    {[...Array(utils.dayCounts[month]).keys()].map( (item, index) => (
      <div className="calendar-day" key={index}>
        {index+1}
      </div>
    ))}
    </div>
    </>
  );
};

export default Calendar;
