import React from 'react'
import Editlabel from './Editlabel';

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
  const [contextMenu, setContextMenu] = React.useState([0,0,false]);
  const [isEdit, setIsEdit] = React.useState(true);
  const [isPlaceholder, setIsPlaceholder] = React.useState(false);

  const handleDragStart = (event) => {
    const data = JSON.stringify( {
      itemId: props.id,
      content: props.content
    });
    setIsPlaceholder(true);
    event.dataTransfer.setData('listItem', data);
  };

  const handleDragEnd = (event) => {
    setIsPlaceholder(false);
  };

  if (!isPlaceholder) {
  return (
    <div
      className="list-item"
      draggable={isEdit ? "false" : "true"}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
    </div>
  );
  } else {
    return (
      <div 
        className="list-item-placeholder"
        onDragEnd={handleDragEnd}
      ></div>
    );
  }
};

export default Listitem;
