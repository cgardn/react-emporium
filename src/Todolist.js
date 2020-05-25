import React from 'react';
import Editlabel from './Editlabel';
import Listitem from './Listitem';
import {StateDispatchContext} from './Todoboard.js';
import { Droppable } from 'react-beautiful-dnd';

const Todolist = (props) => {
  const stateDispatch = React.useContext(StateDispatchContext);
  const [isTitleEdit, setTitleEdit] = React.useState(false);

  const changeItem = (id, newContent) => {
    stateDispatch({
      type: 'UPDATE_TODO_CONTENT',
      itemId: id,
      content: newContent,
    });
  };

  const removeItem = (id) => {
    stateDispatch({
      type: 'REMOVE_TODO',
      listId: props.id,
      itemId: id,
    });
  };

  const handleAdditemClick = () => {
    stateDispatch({
      type: 'ADD_TODO',
      listId: props.id,
    });
  };

  const changeListTitle = (id, content) => {
    stateDispatch({
      type: 'UPDATE_LIST_TITLE',
      listId: props.id,
      newTitle: content,
    });
  };

  const renderedItems = (
    props.list.items.map( (item, index) => (
      <Listitem
        key={item}
        id={item}
        index={index}
        content={props.todoState.items[item].content}
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
      <Droppable droppableId={props.list.id + ''}>
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
