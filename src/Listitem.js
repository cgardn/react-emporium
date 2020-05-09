import React from 'react'
import Editlabel from './Editlabel';

import {ItemDispatchContext} from './Todoboard';

// A single todo item. Editable (with Editlabel), and draggable, onto any <Todolist /> 
//
// props:
//  id: integer, unique on the page, for manipulating in
//        top-level state
//  content: string, the text content of the todo, passed down
//            from top-level state
//  onChange: function ref, passed down to child Editlabel for
//            controlling the input when editing content
//  onDeleteClick: function ref, passed from parent Todolist,
//      for deleting this todo from top-level state

const Itemmenu = (props) => {
  return (
    <button
      className="item-menu"
      autoFocus={true}
      style={{ top: props.posY, left: props.posX }}
      onClick={props.onClick}
      onBlur={props.onBlur}
    >Delete</button>
  );
};

const Listitem = (props) => {
  // State hooks
  const [contextMenu, setContextMenu] = React.useState([0,0,false]);
  const [isEdit, setIsEdit] = React.useState(false);

  // Context consumers
  const itemDispatch = React.useContext(ItemDispatchContext);

  const handleDragStart = (event) => {
    itemDispatch({
      type: 'SET_IS_PLACEHOLDER',
      payload: {
        itemId: props.id,
        isPlaceholder: true}
    });
    props.dragDispatch({
      type: 'SET_DRAGGED_ITEM',
      payload: {item: props.id, index: props.index},
    });
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <>
    <div
      className="list-item"
      draggable={isEdit ? "false" : "true"}
      onDragEnter={handleDragEnter}
      onDragStart={handleDragStart}
    >
      {!props.isPlaceholder &&
    <>
      <Editlabel
        class={"list-item-objects list-item-label"}
        id={props.id}
        content={props.content}
        onChange={props.onChange}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />
      <button
        className="deleteItemButton list-item-objects"
        onClick={event => setContextMenu([event.pageX, event.pageY, !contextMenu[2]])}
      >
      {String.fromCharCode(9899) + ' ' + String.fromCharCode(9899) + ' ' + String.fromCharCode(9899)}
      </button>
      {contextMenu[2] && 
        <Itemmenu
          posX={contextMenu[0]}
          posY={contextMenu[1]}
          onClick={props.onDeleteClick}
          onBlur={event => setContextMenu([0,0,!contextMenu])}
        />
      }
    </>
      }
      {props.isPlaceholder &&
        <div 
          className="list-item-placeholder"
          onDragStart={handleDragStart}
        ></div>
      }
    </div>
    </>
  );
};
    /*
    <div 
      className="list-item-placeholder"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      hidden={!isPlaceholder}
    ></div>
    */

export default Listitem;
