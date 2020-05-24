import React from 'react';
import Todolist from './Todolist';
import {DragDropContext} from 'react-beautiful-dnd';
import './Todoboard.css';

const listReducer = (state, action) => {
  switch(action.type) {
    case 'ADD_LIST':
      return [ ...state, action.payload ];
    case 'REMOVE_LIST':
      return state.filter(list => list.id !== action.listId);
    case 'UPDATE_LIST_TITLE':
      return state.map( list => {
        if (list.id === action.id) {
          return { ...list, title: action.payload};
        } else {
          return list
        }
      });
    case 'INSERT_TODO':
      // payload: 
      //  - listId: id of list item goes into
      //  - itemId: id of item being inserted
      //  - insertIndex: index to insert item at, or -1 to append
      return state.map( list => {
        if (list.id === action.payload.listId) {
          // return if item already in list, prevents adding
          // multiple times when moving around inside list
          if (list.items.includes(action.payload.itemId)) {
            return list;
          }
          let insertIndex = (action.payload.itemIndex === -1 ? list.items.length : action.payload.itemIndex)
          // bandaid to fix insertIndex arriving as undefined
          if (isNaN(insertIndex)) insertIndex = list.items.length;
          return {...list, items: list.items.slice(0,insertIndex).concat(action.payload.itemId).concat(list.items.slice(insertIndex, list.items.length))}
        } else {
          return list
        }
      });
    case 'MOVE_TODO':
      let movedItem = state.filter( list => list.id === action.payload.sourceList)[0].items.splice(action.payload.sourceIndex,1);
      return state.map( list => {
        if (list.id === action.payload.destList) {
          return {
            ...list,
            items: list.items.slice(0,action.payload.destIndex).concat(movedItem).concat(list.items.slice(action.payload.destIndex, list.items.length)),
          }
        } else {
          return list
        }
      })
    case 'REMOVE_TODO':
      // payload:
      //  - listId: id of list losing the todo
      //  - itemId: id of the item being removed
      //  : should check and make sure there's only one of
      //     the specified id?
      return state.map( list => {
        if (list.id === action.payload.listId) {
          let obj = list.items;
          return {...list, items: obj.filter(
            item => item !== action.payload.itemId),}
        } else {
          return list
        }
      });

    default:
      return state;
  }
};

const itemReducer = (state, action) => {
  let obj = null;
  switch(action.type) {
    case 'ADD_TODO':
      return {...state, [action.payload.id]: action.payload};
    case 'REMOVE_TODO':
      delete state[action.payload.itemId];
      return state;
    case 'UPDATE_TODO_CONTENT':
      obj = state[action.payload.id];
      return {...state, [action.payload.id]: {...obj, content: action.payload.content}};
    default:
      return state;
  }
};

export const ListDispatchContext = React.createContext(null);
export const ItemDispatchContext = React.createContext(null);

// Data architecture:
//  Three reducers:
//  - listReducer: An array of JS Objects
//      - id: Integer, unique within the application
//      - title: String, title of the list
//  - itemReducer: An array of item objects:
//      - id: Integer, unique within the application
//      - content: String, the actual todo-text input by user
//      - isEdit: boolean, controls edit mode on Todos
//
// 
//  There are a handful of properties that don't get stored
//    in the reducer, for example whether a list can be 
//    deleted - this is hardcoded to off for the weekdays, and
//    on for everything else. May change in the future.
//
//  Lists also receive their current number of items as a prop
//    for passing through itemDispatch to set correct item 
//    order (new items are assigned index=listSize) 
//      -> no longer true since switch to arrays of items on lists
//
//  The board is constructed by referencing both reducers to
//    get the lists and their items, pulling item content out
//    of the item reducer along the way.

const initialListState = [
  {id: 'm', title: "Monday", items: []},
  {id: 't', title: "Tuesday", items: []},
  {id: 'w', title: "Wednesday", items: []},
  {id: 'r', title: "Thursday", items: []},
  {id: 'f', title: "Friday", items: []},
  {id: 's', title: "Saturday", items: []},
  {id: 'u', title: "Sunday", items: []},
];

const initialItemState = {};

const Todoboard = (props) => {
  const [lists, listDispatch] = React.useReducer(listReducer, initialListState);
  const [allItems, itemDispatch] = React.useReducer(itemReducer, initialItemState);

  const [nextItemId, setNextItemId] = React.useState(props.startId || 0);

  const getId = () => {
    const outId = nextItemId;
    setNextItemId(nextItemId + 1);
    return outId;
  };
  
  const newList = () => {
    const outList = {
      title: "New List",
      id: getId(),
      items: [],
    };
    return outList;
  };

  const addList = () => {
    const nl = newList();
    listDispatch({type: 'ADD_LIST', listId: nl.id, payload: nl});
  };

  const removeList = (listId) => {
    // remove a lists items first to prevent orphaned data
    // - remember items on lists are just id's!
    lists.map( list => {
      if (list.id === listId) {
        list.items.forEach( item => {
          itemDispatch({
            type: 'REMOVE_TODO',
            payload: {
              itemId: item,
            },
          });
        });
      }
      return list
    });
    listDispatch({type: 'REMOVE_LIST', listId: listId});
  };

  const getListSize = (listId) => {
    return lists[listId].items.length;
  };

  const AddListButton = () => {
    return (
      <button
        className="addListButton"
        onClick={addList}
      >{"+ Add list"}</button>
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
    listDispatch({
      type: 'MOVE_TODO',
      payload: {
        sourceList: source.droppableId,
        sourceIndex: source.index,
        destList: destination.droppableId,
        destIndex: destination.index,
      }
    });
  };

  return (
    <>
    <DragDropContext onDragEnd={onDragEnd}>
    <ListDispatchContext.Provider value={listDispatch}>
    <ItemDispatchContext.Provider value={itemDispatch}>
    <ListContainer thisClass="calendar" key="calendarcontainer">
        {lists.map( (list, index) => (
          (index <= 6) &&
              <>
              <Todolist
                thisClass={"calendar"}
                list={list}
                key={list.id}
                allItems={allItems}
                getId={getId}
                canDelete={false}
                canEditTitle={false}
                onDeleteClick={() => removeList(list.id)}
              />
              </>
        ))}
    </ListContainer>
    <hr style={{width: "90vw"}}/>
    <ListContainer thisClass="todo" key="todolistcontainer">
        {lists.length > 0 &&
          <>
          {lists.map( (list, index) => (
            (index > 6) && 
            <>
             <Todolist
                thisClass={"todo"}
                title={list.title}
                key={list.id}
                id={list.id}
                ownedItems={list.items}
                allItems={allItems}
                getId={getId} 
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
    </ItemDispatchContext.Provider>
    </ListDispatchContext.Provider>
    </DragDropContext>
    </>
  )
};

export default Todoboard;
