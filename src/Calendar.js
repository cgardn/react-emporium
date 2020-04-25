import React from 'react';
import './Calendar.css';

// TODO
//  - need to use Date() to get number of days in a month, to account for leap years
//  - under certain unknown conditions, going back a month with the dropdown only goes to the 1st of that month
//  - <Week/> only knows about the number date of today, and highlights that day on every month
//    -> so if it's April 25th, then when you scroll ahead to May 25th it'll be highlighted too

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
  dayNames: [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ],

  thisMonth: () => {
    const d = new Date();
    return d.getMonth();
  },
};

const Datepicker = (props) => {
  return (
    <form>
      <select 
        onChange={event => props.onYearChange(event.target.value)}
        name="year"
        id="year-select"
        value={props.year}
      >
        {[...Array(3).keys()].map( (item, index) => (
          <option
            key={index+1000}
            value={item + (props.year - 1)}
          >{item + (props.year-1)}
          </option>
        ))};
      </select>
      <select
        onChange={event => props.onMonthChange(event.target.value)}
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
      <select
        onChange={event => props.onDayChange(event.target.value)}
        name="day"
        id="day-select"
        value={props.day}
        selected={props.day}
      >
        {[...Array(utils.dayCounts[props.month]).keys()].map( (item, index) => (
          <option
            key={index+10000}
            value={index+1}
           >{index+1}
          </option>
        ))}
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
      <div className="calendar-day-name">
        {utils.dayNames[props.day]}
      </div>
    </div>
  );
};

const Datedisplay = (props) => {
  return (
    <div className="datedisplay">
      {utils.monthNames[props.month]} {props.date}, {props.year}
    </div>
  );
};

const Weekswitcher = (props) => {
  return (
    <div className="week-switch-container">
    <div className="week-switch-button" onClick={props.previousWeek}>{'\u25C4'}</div>
    <Datedisplay month={props.month} year={props.year} date={props.date} />
    <button onClick={props.handleReturnToToday}>Back to this week</button>
    <div className="week-switch-button" onClick={props.nextWeek}>{'\u25BA'}</div>
    </div>
  );
};

const Week = (props) => {
  // receives current day, returns list of <Day /> with 
  // correct numbering
  
  const weekNums = (dateProp) => {
    // takes today's date number, returns date numbers for this week from Sunday to Saturday, as an array
    //   purpose: use the Date object's functions so month boundaries are handled correctly
    let week = [];
    let date = new Date(dateProp);

    // set day to Sunday before loop
    date.setDate(date.getDate()-date.getDay());
    for (let i=0; i<7;i++) {
      week.push(date.getDate());
      date.setDate(date.getDate()+1);
    }
    return week;
  };

  return (
    <>
    <div className="calendar-container">
      {weekNums(props.dateObj).map( (item, index) => (
        <Day
          key={index+1}
          number={item}
          today={props.todayDate}
          day={index}
        />
      ))}
    </div>
    </>
  );
};

const Calendar = (props) => {
  const [currentDay, setCurrentDay] = React.useState(new Date());
  const [displayDay, setDisplayDay] = React.useState(new Date());

  const handleYearChange = (newYear) => {
    setDisplayDay(new Date(displayDay.setYear(newYear)));
  };

  const handleMonthChange = (newMonth) => {
    setDisplayDay(new Date(displayDay.setMonth(newMonth)));
  };

  const handleDayChange = (newDate) => {
    setDisplayDay(new Date(displayDay.setDate(newDate)));
  };

  const handlePreviousWeek = () => {
    setDisplayDay(new Date(displayDay.setDate(displayDay.getDate()-7)));
  };

  const handleNextWeek = () => {
    setDisplayDay(new Date(displayDay.setDate(displayDay.getDate()+7)));
  };

  const handleReturnToToday = () => {
    setDisplayDay(new Date(currentDay));
  };

  const handleSubmit = () => {
    console.log(currentDay);
  };

  return (
    <div className="calendar">
    <Datepicker
      onYearChange={handleYearChange}
      onMonthChange={handleMonthChange}
      onDayChange={handleDayChange}
      onDateSubmit={handleSubmit}
      year={displayDay.getFullYear()}
      month={displayDay.getMonth()}
      day={displayDay.getDate()}
    />
    <Weekswitcher
      previousWeek={handlePreviousWeek}
      nextWeek={handleNextWeek}
      handleReturnToToday={handleReturnToToday}
      year={currentDay.getFullYear()}
      month={currentDay.getMonth()}
      date={currentDay.getDate()}
    />
    <Week 
      dateObj={displayDay}
      todayDate={currentDay.getDate()}
      day={displayDay.getDay()}
    />
    </div>
  );
};

export default Calendar;
