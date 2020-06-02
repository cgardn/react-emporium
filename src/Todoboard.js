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
      <div className={props.thisClass}>
        <div className={`${props.thisClass}-container`}>
          {props.children}
        </div>
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

  return (
    <>
    <DragDropContext onDragEnd={onDragEnd}>
    <ListContainer thisClass="calendar" key="calendarcontainer">
        {props.todoState.lists.map( (list, index) => (
          (index <= 6) &&
              <>
              <Todolist
                thisClass={"calendar"}
                todoState={props.todoState}
                list={list}
                index={index}
                id={list.id + ''}
                key={list.id}
                canDelete={false}
                canEditTitle={false}
                onDeleteClick={() => removeList(list.id)}
              />
              </>
        ))}
    </ListContainer>
    <hr style={{width: "90vw"}}/>
    <ListContainer thisClass="todo" key="todolistcontainer">
        {props.todoState.lists.length > 0 &&
          <>
          {props.todoState.lists.map( (list, index) => (
            (index > 6) && 
            <>
             <Todolist
                thisClass={"todo"}
                todoState={props.todoState}
                list={list}
                index={index}
                id={list.id}
                key={list.id}
                canDelete={true}
                canEditTitle={true}
                onDeleteClick={() => removeList(list.id)}
             />
            </>
          ))}
          </>
        }
        <AddListButton key="addlistbutton" />
    </ListContainer>
    </DragDropContext>
    </>
  )
};

export default Todoboard;
