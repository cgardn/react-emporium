import React from 'react';

const listReducer = (state, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return state.map( list => {
        if (list.id === action.id) {
          return { ...list, items: [...list.items, action.payload]};
        } else {
          return list;
        }
      });
    case 'REMOVE_TODO':
      return state.map( list => {
        if (list.id === action.listId) {
          return { ...list, items: list.items.filter( item => item.id !== action.itemId)}
        } else {
          return list;
        }
      });
    case 'UPDATE_TODO':
      return state.map( list => {
        if (list.id === action.listId) {
          return {...list, items: list.items.map( item => {
            if (item.id === action.itemId) {
              return {...item, content: action.payload}
            } else {
              return item
            }
          })};
        } else {
          return list;
        }});
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
    default:
      return state;
  }
};

const initialListState = [
  {id: 'm', items: []},
  {id: 't', items: []},
  {id: 'w', items: []},
  {id: 'r', items: []},
  {id: 'f', items: []},
  {id: 's', items: []},
  {id: 'u', items: []},
];

export const Todoboardstate = () => {
  const [lists, dispatch] = React.useReducer(listReducer, initialListState);
  const [nextItemId, setNextItemId] = React.useState(0);

  const getId = () => {
    const outId = nextItemId;
    setNextItemId(nextItemId + 1);
    return outId;
  };
};

export default Todoboardstate;
