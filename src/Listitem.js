import React from 'react'
import Editlabel from './Editlabel';
import {Draggable} from 'react-beautiful-dnd';
import {StateDispatchContext} from './Todoboard.js';

// A single todo item. Editable (with Editlabel), and draggable, onto any <Todolist /> 
//
// props:
//  id: integer, unique on the page, for manipulating in
//        top-level state
//  itemObject: the item object that contains this Todo's 
//      id, content, and isEdit status
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

  // Context consumers
  const stateDispatch = React.useContext(StateDispatchContext);

  // assigning props
  const isEdit = props.itemObject.isEdit;
  const setIsEdit = (id, newState) => {
    stateDispatch({
      type: "SET_IS_EDIT",
      itemId: props.id,
      newState: !props.itemObject.isEdit,
    });
  };

  const DeleteButton = () => {
    return (
        <button
          className="deleteItemButton list-item-objects"
          onClick={event => setContextMenu([event.pageX, event.pageY, !contextMenu[2]])}
        >
        {String.fromCharCode(9899) + ' ' + String.fromCharCode(9899) + ' ' + String.fromCharCode(9899)}
        </button>
    );
  };

  const Container = (props) => {
    return (
      <Draggable 
        key={props.id}
        draggableId={props.id.toString()} 
        index={parseInt(props.index)}
      >
        {(provided) => (
          <div 
            className="list-item" 
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {props.children}
          </div>
        )}
      </Draggable>
    );
  };

  return (
      <Container id={props.id} index={parseInt(props.index)}>
        <Editlabel
          className={"list-item-objects list-item-label"}
          id={props.id}
          content={props.itemObject.content}
          isEdit={props.itemObject.isEdit}
          onChange={props.onChange}
          setIsEdit={setIsEdit}
        />
        <DeleteButton />
        {contextMenu[2] && 
          <Itemmenu
            posX={contextMenu[0]}
            posY={contextMenu[1]}
            onClick={props.onDeleteClick}
          onBlur={event => setContextMenu([0,0,!contextMenu])}
          />
        }
      </Container>
  );
};

export default Listitem;
