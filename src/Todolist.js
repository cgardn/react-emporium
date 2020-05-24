import React from 'react';
import Editlabel from './Editlabel';
import Listitem from './Listitem';
import {ListDispatchContext, ItemDispatchContext} from './Todoboard.js';
import { Droppable } from 'react-beautiful-dnd';

const Todolist = (props) => {
  const listDispatch = React.useContext(ListDispatchContext);
  const itemDispatch = React.useContext(ItemDispatchContext);
  const [isTitleEdit, setTitleEdit] = React.useState(false);

  // assigning props from props.list

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
        listId: props.list.id,
        itemId: id,
      },
    });
    listDispatch({
      type: 'REMOVE_TODO',
      payload: {
        listId: props.list.id,
        itemId: id,
      },
    });
  };

  const handleAdditemClick = () => {
    const newId = props.getId();
    listDispatch({
      type: 'INSERT_TODO',
      payload: {
        listId: props.list.id,
        itemId: newId,
        itemIndex: -1,
      }
    });
    itemDispatch({
      type: 'ADD_TODO',
      payload: {
        id: newId,
      }
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
    props.list.items.map( (item, index) => (
      <Listitem
        key={props.allItems[item].id}
        id={props.allItems[item].id}
        index={index}
        content={props.allItems[item].content}
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
          id={props.list.id}
          content={props.list.title}
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
      <Droppable droppableId={props.list.id}>
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
    <Container thisClass={props.thisClass} key={`listcontainer-${props.list.id}`}>
      <Title key={`listtitle-${props.list.id}`}/>
      <List key={`listcontent-${props.list.id}`}/>
      <AddButton key={`addtodobutton=${props.list.id}`}/>
    </Container>
  );
};

export default Todolist;
