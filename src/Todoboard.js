import React from 'react';
import Todolist from './Todolist';
import {DragDropContext} from 'react-beautiful-dnd';
import {StateDispatchContext} from './stateManager.js';
import './Todoboard.css';

const Todoboard = (props) => {
  const stateDispatch = React.useContext(StateDispatchContext);

  const addList = () => {
    stateDispatch({
      type: 'ADD_LIST',
    });
  };

  const removeList = (listId) => {
    // remove a lists items first to prevent orphaned data
    // - remember items on lists are just id's!
    // - this is not optimal, the reducer calls .map()
    //   on the list once for each item, but good enough
    //   for now
    props.todoState.lists.map( list => {
      if (list.id === listId) {
        list.items.forEach( item => {
          stateDispatch({
            type: 'REMOVE_TODO',
            itemId: item,
          });
        });
      }
      return list
    });
    stateDispatch({type: 'REMOVE_LIST', listId: listId});
  };

  const AddListButton = () => {
    return (
      <span
        className="addListButton"
        onClick={addList}
      >{"+ Add list"}</span>
    );
  };

  const ListContainer = (props) => {
    return (
        <div className={`${props.thisClass}-container`}>
          {props.children}
        </div>
    );
  };

  const onDragEnd = ({source, destination}) => {
    if (source === null || destination === null) return;
    stateDispatch({
      type: 'MOVE_TODO',
      payload: {
        sourceList: source.droppableId,
        sourceIndex: source.index,
        destList: destination.droppableId,
        destIndex: destination.index,
      },
    });
  };

  const renderedItems = (
    props.todoState.lists.map( (list, index) => (
      <Todolist
        thisClass={index <= 6 ? "calendar" : "todo"}
        todoState={props.todoState}
        list={list}
        index={index}
        id={list.id + ''}
        key={list.id}
        canDelete={index <= 6 ? false : true}
        canEditTitle={false}
        onDeleteClick={() => removeList(list.id)}
      />
    ))
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ListContainer 
        thisClass="calendar" 
        key="calendarcontainer"
      >
        {[...renderedItems.slice(0,7)]}
      </ListContainer>
      <hr style={{width: "90vw", color: "#eee"}}/>
      <ListContainer thisClass="todo" key="todolistcontainer">
        {[...renderedItems.slice(7,renderedItems.length)]}
        <AddListButton key="addlistbutton" />
      </ListContainer>
    </DragDropContext>
  )
};

export default Todoboard;
