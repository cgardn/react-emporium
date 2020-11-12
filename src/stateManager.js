import React from 'react';

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


export const stateReducer = (state, action) => {
  const getId = () => {
    return (state.freeIds.length > 0)
      ? state.freeIds.pop()
      : state.nextId++
  };

  // item management
  switch(action.type) {

    case 'LOAD_NEW_STATE':
      // replace current state with new state object
      //   used when importing (manually or from backend) or
      //   wiping a fresh board
      // newState: object holding new state
      return action.newState;

    case 'CLEAR_STATE':
      // wipe state and replace with empty initialState
      return initialState;

    case 'ADD_TODO':
      // add a new todo to the item object and a particular
      //    list, with new ID from getId()
      // listId: id of the list where the new item will be
      //          appended
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

export const initialState = {
  lists: [
    {id:'m',title:"Monday", items: [], isTitleEdit:false},
    {id:'t',title:"Tuesday", items: [], isTitleEdit:false},
    {id:'w',title:"Wednesday", items: [], isTitleEdit:false},
    {id:'r',title:"Thursday", items: [], isTitleEdit:false},
    {id:'f',title:"Friday", items: [], isTitleEdit:false},
    {id:'s',title:"Saturday", items: [], isTitleEdit:false},
    {id:'u',title:"Sunday", items: [], isTitleEdit:false},
  ],
  items: {},
  freeIds: [],
  nextId: 0,
}

export const StateDispatchContext = React.createContext(null);
