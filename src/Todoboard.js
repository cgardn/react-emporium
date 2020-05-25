import React from 'react';
import Todolist from './Todolist';
import {DragDropContext} from 'react-beautiful-dnd';
import './Todoboard.css';

const stateReducer = (state, action) => {
  const getId = () => {
    return (state.freeIds.length > 0)
      ? state.freeIds.pop()
      : state.nextId++
  };

  // item management
  switch(action.type) {
    case 'ADD_TODO':
      // add a new todo to the item object and a particular
      //    list, with new ID from getId()
      // listId: id of the list where the new item will be
      //          appended
      console.log("adding todo");
      const newTodo = {
        id: getId(),
        content: "Click to edit",
        isEdit: true,
      }
      return {
        ...state,
        items: {
          ...state.items,
          [newTodo.id]: newTodo
        },
        lists: state.lists.map( list => {
          if (list.id === action.listId) {
            return {
              ...list,
              // just add it to the end of the list for now
              items: list.items.concat(newTodo.id)
            };
          } else {
            return list
          };
        }),
      };
    case 'REMOVE_TODO':
      // remove item from item object and owning list,
      //   put id into freeIds stack
      // listID: list that has this item
      // itemID: the item in question

      // add ID to freeIds stack
      state.freeIds.push(action.itemId);
      // remove item from item object
      delete state.items[action.itemId]
      // remap lists arrays without the deleted itemId
      return {...state, lists: state.lists.map( list => {
        if (list.id === action.listId) {
          return {...list, items: list.items.filter(
            item => item !== action.itemId)}
        } else {
          return list
        }
      })};
    case 'SET_IS_EDIT':
      // turn edit mode on or off for a particular todo
      // itemId: numerical ID of the item in question
      // newState: true or false
      return {...state,
        items: {
          ...state.items,
          [action.itemId]: {
              ...state.items[action.itemId],
              isEdit: action.newState},
        }
      }
    case 'UPDATE_TODO_CONTENT':
      // set new content for a particular todo
      //   whether controlled or uncontrolled
      // itemId: item in question
      // content: new content to set
      return {...state, items: {...state.items, [action.itemId]: {...state.items[action.itemId], content: action.content}}}
  // list management
    case 'ADD_LIST':
      // add a new list, get id from getIds()
      // payload: new list
      const newList = {
        title: "New List",
        id: getId().toString(),
        items: [],
      };
      console.log(state);
      return {...state, lists: [...state.lists, newList]};
    case 'REMOVE_LIST':
      // remove a particular list, put id in freeIds stack
      // listId: numerical ID of the list in question
      state.freeIds.push(action.listId);
      return {...state, lists: state.lists.filter(
        list => list.id !== action.listId)
      };
    case 'SET_LIST_TITLE_IS_EDIT':
      // turn edit mode on or off for a particular list title
      // listId: numerical ID of the list in question
      // newState: true or false
      return {...state,
        lists: state.lists.map( list => {
          if (list.id === action.listId) {
            list.isTitleEdit = action.newState; 
            return list
          } else {
            return list
          }
        }),
      };
    case 'UPDATE_LIST_TITLE':
      // update the title of a particular list
      // listId: numerical ID of the list in question
      // newTitle: updated title
      return {...state, lists: state.lists.map( list => {
        if (list.id === action.listId) {
          return {...list, title: action.newTitle}
        } else {
          return list
        }
      })};
    case 'MOVE_TODO':
      // used for react-beautiful-dnd to actually move the 
      //   items from one list to another
      // sourceList: numerical ID of list where drag began
      // sourceIndex: index of position when drag began
      // destList: numerical ID of list where drag ended
      // destIndex: index of position when drag ended
      let movedItem = state.lists.find(
        list => list.id === action.payload.sourceList
      ).items.splice(
        action.payload.sourceIndex, 1
      );
      return {...state, lists: state.lists.map( list => {
        if (list.id === action.payload.destList) {
          return {
            ...list,
            items: list.items.slice(0,action.payload.destIndex).concat(movedItem).concat(list.items.slice(action.payload.destIndex, list.items.length)),
          }
        } else {
          return list
        }
      })};
    default:
      return state;
  }
}
  


export const ListDispatchContext = React.createContext(null);
export const ItemDispatchContext = React.createContext(null);
export const StateDispatchContext = React.createContext(null);

// Data architecture:
//  Two reducers:
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
//    deleted - hardcoded to off for the weekdays, and
//    on for everything else. May change in the future.
//
//  The board is constructed by referencing both reducers to
//    get the lists and their items, pulling item content out
//    of the item reducer along the way.

/*
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
const initialIdState = {freeIds: [], nextId: 0}
*/

// new unified state object
const initialState = {
  lists: [
    {id:'m', title: "Monday", items: [], isTitleEdit: false},
    {id:'t', title: "Tuesday", items: [], isTitleEdit: false},
    {id:'w', title: "Wednesday", items: [], isTitleEdit: false},
    {id:'r', title: "Thursday", items: [], isTitleEdit: false},
    {id:'f', title: "Friday", items: [], isTitleEdit: false},
    {id:'s', title: "Saturday", items: [], isTitleEdit: false},
    {id:'u', title: "Sunday", items: [], isTitleEdit: false},
  ],
  items: {},
  freeIds: [],
  nextId: 0,
}

const Todoboard = (props) => {
  const [todoState, stateDispatch] = React.useReducer(stateReducer, initialState);

  const [nextItemId, setNextItemId] = React.useState(props.startId || 0);

  const getId = () => {
    const outId = nextItemId;
    setNextItemId(nextItemId + 1);
    return outId;
  };
  /*
  const newList = () => {
    const outList = {
      title: "New List",
      id: getId(),
      items: [],
    };
    return outList;
  };
  */

  const addList = () => {
    stateDispatch({
      type: 'ADD_LIST',
    });
  };

  const removeList = (listId) => {
    // remove a lists items first to prevent orphaned data
    // - remember items on lists are just id's!
    // - this is not optimal, the reducer called .map()
    //   on the list once for each item, but good enough
    //   for now
    todoState.lists.map( list => {
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
    console.log(source, destination);
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
    <StateDispatchContext.Provider value={stateDispatch}>
    <ListContainer thisClass="calendar" key="calendarcontainer">
        {todoState.lists.map( (list, index) => (
          (index <= 6) &&
              <>
              <Todolist
                thisClass={"calendar"}
                todoState={todoState}
                list={list}
                index={index}
                id={list.id + ''}
                key={list.id}
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
        {todoState.lists.length > 0 &&
          <>
          {todoState.lists.map( (list, index) => (
            (index > 6) && 
            <>
             <Todolist
                thisClass={"todo"}
                todoState={todoState}
                list={list}
                index={index}
                id={list.id}
                key={list.id}
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
    </StateDispatchContext.Provider>
    </DragDropContext>
    </>
  )
};

export default Todoboard;
