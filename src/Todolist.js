import React from 'react';
import Editlabel from './Editlabel';
import Listitem from './Listitem';
import {ListDispatchContext, ItemDispatchContext} from './Todoboard.js';

const Todolist = (props) => {
  const listDispatch = React.useContext(ListDispatchContext);
  const itemDispatch = React.useContext(ItemDispatchContext);
  const [isTitleEdit, setTitleEdit] = React.useState(false);

  const handleDragEnter = (event) => {
    event.preventDefault();  
    event.stopPropagation();
    props.dragDispatch({
      type: 'UPDATE_HOVERED_LIST',
      payload: props.id,
    });
    itemDispatch({
      type: 'UPDATE_TODO_OWNER',
      itemId: props.draggedItem.item,
      newOwner: props.id,
      index: props.getSize(props.id),
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const changeItem = (id, newContent) => {
    itemDispatch({
      type: 'UPDATE_TODO_CONTENT',
      itemId: id,
      payload: newContent
    });
  };

  const removeItem = (id) => {
    itemDispatch({
      type: 'REMOVE_TODO',
      itemId: id,
    });
  };

  const handleAdditemClick = () => {
    itemDispatch({
      type: 'ADD_TODO',
      payload: {
        id: props.getId(),
        index: props.getSize(props.id),
        belongsTo: props.id,
        content: "Click to edit"}
    });
  };

  const changeListTitle = (id, content) => {
    listDispatch({
      type: 'UPDATE_LIST_TITLE',
      id: id,
      payload: content
    });
  };

  const handleSwapItems = (event) => {
    const data = JSON.parse(event.dataTransfer.getData("listitem"));
    console.log(data);
    /*
    dispatch({
      type: 'SWAP_TODOS',
      overId: data.overId,
      underId: data.underId,
      listId: props.id
    });
    */
  };

  const getTitleEdit = () => {
    if (props.canEditTitle) {
      return [isTitleEdit, setTitleEdit]
    } else {
      return [false, () => {return;}]
    }
  };

  return (
    <>
      <div className={`${props.thisClass}-individual-title`}>
        <Editlabel
          class={"list-item-objects list-item-label"}
          id={props.id}
          content={props.title}
          onChange={changeListTitle}
          isEdit={isTitleEdit}
          setIsEdit={setTitleEdit}
          titleEdit={[isTitleEdit, setTitleEdit]}
        />
      
      {props.canDelete &&
        <button
          className="list-delete-button"
          onClick={props.onDeleteClick}
        >X</button>
      }
      </div>

      <div 
        className={`${props.thisClass}-list`}
      >
        <div
          className="list-content"
          onDragEnter={event => handleDragEnter(event)}
          onDragOver={handleDragOver}
        >
          {props.items.filter( item => item.belongsTo === props.id).sort( (a,b) => (a.index > b.index) ? 1 : -1).map( item => (
            <Listitem
              key={item.id}
              id={item.id}
              index={item.index}
              content={item.content}
              swapItems={handleSwapItems}
              dragDispatch={props.dragDispatch}
              onChange={changeItem}
              onDeleteClick={() => removeItem(item.id)}
            />
          ))}
        </div>
        <button
          className={"addItemButton"}
          style={{ fontsize: '2rem' }}
          onClick={handleAdditemClick}
        >{"+"}</button>
      </div>
    </>
  );
};

export default Todolist;
