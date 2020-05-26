import React from 'react';
import {useCallback} from 'react';

const Editlabel = (props) => {
  // Editable label, a span that replaces itself with an Input box+form on click
  // props:
  //  id: integer, unique to the app state for manipulating 
  //      the label inside state object
  //  content: string, displayed text on the label
  //  class: for setting className (CSS styles)
  //  isEdit: bool, true if in editable input state, false if
  //          plain text span
  //  setIsEdit: function ref for setting isEdit on parent
  //  onChange: function ref for controlling input on parent
  //            state

  const callbackRef = useCallback(inputBox => {
    if (inputBox) {
      inputBox.focus();
    }
  }, []);

  return (
    <>
    {props.isEdit === true
      ? <form 
          onSubmit={event => {
            event.preventDefault()
            props.setIsEdit()
          }}
        >
          <input
            className={props.className}
            value={props.content}
            ref={callbackRef}
            onChange={event => props.onChange(props.id, event.target.value)}
            onBlur={event => props.setIsEdit()}
          >
          </input>
        </form>
      : <span 
          className={props.className}
          onClick={event => props.setIsEdit()}
        >{props.content}</span>
    }
    </>
  );
};

export default Editlabel;
