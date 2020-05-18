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
    listDispatch({
      type: 'INSERT_TODO',
      payload: {
        listId: props.id,
        itemId: props.draggedItem.item,
        insertIndex: -1
      }
    });
    if (props.draggedItem.list !== props.id) {
      listDispatch({
        type: 'REMOVE_TODO',
        payload: {
          listId: props.draggedItem.list,
          itemId: props.draggedItem.item,
        },
      });
    }
    props.dragDispatch({
      type: 'UPDATE_HOVERED_LIST',
      payload: props.id,
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const changeItem = (id, newContent) => {
    itemDispatch({
      type: 'UPDATE_TODO_CONTENT',
      payload: {id: id, content: newContent}
    });
  };

  const removeItem = (id) => {
    itemDispatch({
      type: 'REMOVE_TODO',
      payload: {
        listId: props.id,
        itemId: id,
      },
    });
    listDispatch({
      type: 'REMOVE_TODO',
      payload: {
        listId: props.id,
        itemId: id,
      },
    });
  };

  const handleAdditemClick = () => {
    listDispatch({
      type: 'INSERT_TODO',
      payload: {
        listId: props.id,
        itemId: props.getId(),
        itemIndex: -1,
      }
    });
    itemDispatch({
      type: 'ADD_TODO',
      payload: {
        id: props.getId(),
        content: "Click to edit",
        isPlaceholder: false}
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
    console.log("swap items");
  };

  const getOwnedItems = () => {
    return props.ownedItems;
  };

  const renderedItems = (
    getOwnedItems().map( item => (
          <Listitem
            key={props.allItems[item].id}
            id={props.allItems[item].id}
            index={props.allItems[item].index}
            content={props.allItems[item].content}
            isPlaceholder={props.allItems[item].isPlaceholder}
            swapItems={handleSwapItems}
            dragDispatch={props.dragDispatch}
            onChange={changeItem}
            onDeleteClick={() => removeItem(item)}
          />
    ))
  );

  return (
    <div 
      style={{height: "100%"}}
      onDragEnter={event => handleDragEnter(event)}
      onDragOver={handleDragOver}
    >
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
        >
        {renderedItems}
        </div>
        <button
          className={"addItemButton"}
          style={{ fontsize: '2rem' }}
          onClick={handleAdditemClick}
        >{"+"}</button>
      </div>
    </div>
  );
};

export default Todolist;
