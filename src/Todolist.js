import React from 'react';
import Editlabel from './Editlabel';
import Listitem from './Listitem';
import {ListDispatchContext, ItemDispatchContext} from './Todoboard.js';
import { Droppable } from 'react-beautiful-dnd';

const Todolist = (props) => {
  const listDispatch = React.useContext(ListDispatchContext);
  const itemDispatch = React.useContext(ItemDispatchContext);
  const [isTitleEdit, setTitleEdit] = React.useState(false);

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

  const renderedItems = (
    props.ownedItems.map( (item, index) => (
      <Listitem
        key={props.allItems[item].id}
        id={props.allItems[item].id}
        index={index}
        content={props.allItems[item].content}
        isPlaceholder={props.allItems[item].isPlaceholder}
        onChange={changeItem}
        onDeleteClick={() => removeItem(item)}
      />
    ))
  );

  const Container = (props) => {
    return (
      <div className={`${props.thisClass}-individual`}>
        {props.children}
      </div>
    );
  };

  const Title = () => {
    return (
      <div className={`${props.thisClass}-individual-title`}>
        <Editlabel
          className={"list-item-objects list-item-label"}
          id={props.id}
          content={props.title}
          onChange={changeListTitle}
          isEdit={isTitleEdit}
          setIsEdit={setTitleEdit}
        />
      {props.canDelete &&
        <button
          className="list-delete-button"
          onClick={props.onDeleteClick}
        >X</button>
      }
      </div>
    );
  };

  const List = () => {
    
    return (
      <Droppable droppableId={props.id}>
        { (provided) => (
          <div 
            ref={provided.innerRef} 
            {...provided.droppableProps}
            className={`${props.thisClass}-list`}
          >
            {renderedItems}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  const AddButton = () => {
    return (
      <button
        className={"addItemButton"}
        style={{ fontsize: '2rem' }}
        onClick={handleAdditemClick}
      >{"+"}</button>
    );
  };

  return (
    <Container thisClass={props.thisClass}>
      <Title />
      <List />
      <AddButton />
    </Container>
  );
};

export default Todolist;
