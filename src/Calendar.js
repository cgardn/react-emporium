import React from 'react';
import './Calendar.css';

// TODO-next steps
//  - eventually make the week display a button that pops
//    out one of those mini-calendars for selecting a week

const utils = {
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

const Day = (props) => {
  return (
    <div className={
      props.today ? "calendar-day calendar-day-today" : "calendar-day"}>
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
      {utils.monthNames[props.weekstart[0]]} {props.weekstart[1]} - {utils.monthNames[props.weekend[0]]} {props.weekend[1]}, {props.year}
    </div>
  );
};

const Weekswitcher = (props) => {
  return (
    <div className="week-switch-container">
      <div
        className="week-switch-button"
        onClick={props.previousWeek}
      >{'\u25C4'}</div>
      <Datedisplay
        month={props.month}
        year={props.year}
        weekstart={props.weekstart}
        weekend={props.weekend}/>
      <button
        onClick={props.handleReturnToToday}
      >Back to current week</button>
      <div
        className="week-switch-button"
        onClick={props.nextWeek}
      >{'\u25BA'}</div>
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
      week.push([date.getDate(), 
        (props.currentDay.getDate() === date.getDate()) &&
         (props.currentDay.getMonth() === date.getMonth())])
      date.setDate(date.getDate()+1);
    }
    return week;
  };

  return (
    <>
    <div className="calendar-container">
      {weekNums(props.displayDay).map( (item, index) => (
        <Day
          key={index+1}
          number={item[0]}
          today={item[1]}
          day={index}
        />
      ))}
    </div>
    </>
  );
};

const Calendar = (props) => {
  const [currentDay] = React.useState(new Date());
  const [displayDay, setDisplayDay] = React.useState(new Date());

  const handlePreviousWeek = () => {
    setDisplayDay(new Date(displayDay.setDate(displayDay.getDate()-7)));
  };

  const handleNextWeek = () => {
    setDisplayDay(new Date(displayDay.setDate(displayDay.getDate()+7)));
  };

  const handleReturnToToday = () => {
    setDisplayDay(new Date(currentDay));
  };

  const getWeekStart = (today) => {
    // returns date object set to beginning of the week
    let thisDate = new Date(today);
    thisDate.setDate(today.getDate()-today.getDay());
    return thisDate;
  };

  const getWeekEnd = (today) => {
    let thisDate = new Date(today);
    thisDate.setDate((thisDate.getDate()-thisDate.getDay())+6);
    return thisDate;
  };

  return (
    <div className="calendar">
    <Weekswitcher
      previousWeek={handlePreviousWeek}
      nextWeek={handleNextWeek}
      handleReturnToToday={handleReturnToToday}
      year={currentDay.getFullYear()}
      weekstart={[
        getWeekStart(displayDay).getMonth(),
        getWeekStart(displayDay).getDate()]}
      weekend={[
        getWeekEnd(displayDay).getMonth(),
        getWeekEnd(displayDay).getDate()]}
    />
    <Week 
      displayDay={displayDay}
      currentDay={currentDay}
      day={displayDay.getDay()}
    />
    </div>
  );
};
export default Calendar;
