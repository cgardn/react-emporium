import React from 'react';
import Todolist from './Todolist';
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
    default:
      return state;
  }
};

const itemReducer = (state, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return [...state, action.payload];
    case 'REMOVE_TODO':
      // filters out item with specified ID, then remaps 
      //   remaining items' index properties to fill gaps
      return state.filter(item => item.id !== action.itemId).map( (item, index) => {
        return {...item, index: index}
      });
    case 'UPDATE_TODO_CONTENT':
      return state.map( item => {
        if (item.id === action.itemId) {
          return {...item, content: action.payload}
        } else {
          return item
        }
      });
    case 'UPDATE_TODO_INDEX':
      return state.map( item => {
        if (item.id === action.payload.id) {
          return {...item, index: action.payload.index}
        } else {
          return item
        }
      });
    case 'SWAP_TODO_INDEX':
      // receives two item ids, swaps their index values
      // payload: {
      //    hoverIndex: integer index of hovered item
      //    draggedIndex: integer index of dragged item
      //    hoverId: integer ID of hovered item
      //    draggedId: integer ID of dragged item
      //    }
      const draggedIndex = action.payload.draggedIndex;
      return state.map( item => {
        if (item.id === action.payload.draggedId) {
          return {...item, index: action.payload.hoverIndex}
        } else if (item.id === action.payload.hoverId) {
          return {...item, index: draggedIndex}
        } else {
          return item;
        }
      });
    case 'UPDATE_TODO_OWNER':
      return state.map( item => {
        if (item.id === action.itemId) {
          return {...item, belongsTo: action.newOwner}
        } else {
          return item
        }
      });
    default:
      return state;
  }
};

const dragReducer = (state, action) => {
  switch(action.type) {
    case 'SET_DRAGGED_ITEM':
      return {...state, item: action.payload};
    case 'CLEAR_DRAGGED_ITEM':
      return {...state, item: null};
    case 'UPDATE_HOVERED_LIST':
      return {...state, list: action.payload};
    case 'CLEAR_HOVERED_LIST':
      return {...state, list: null}
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
//      - belongsTo: Integer, id of the list that owns this 
//      - content: String, the actual todo-text input by user
//      - index: order placement on the list
//  - dragReducer: Object with info about current drag op
//      - item: Integer, id of currently dragged item
//      - list: Integer, id of currently hovered list
//       
//  
//  * Dragged item information is tracked outside of the 
//    built-in event.dataTransfer object, because the HTML5
//    drag-and-drop spec does not allow dataTransfer to be
//    accessed during a dragOver event. However, I need to 
//    know which item is being dragged over so I can update
//    it's owning list, and index/order in the list, as the
//    user drags the item around - allowing for visual 
//    feedback in the form of a placeholder/shadow item
//    underneath the user's cursor.
// 
//  There are a handful of properties that don't get stored
//    in the reducer, for example whether a list can be 
//    deleted - this is hardcoded off for the weekdays, and
//    on for everything else. May change in the future.
//
//  Lists also receive their current number of items as a prop
//    for passing through itemDispatch to set correct item 
//    order (new items are assigned index=listSize)
//
//  The board is constructed by referencing both reducers to
//    get the lists and their items, pulling item content out
//    of the item reducer along the way.

const initialListState = [
  {id: 'm', title: "Monday"},
  {id: 't', title: "Tuesday"},
  {id: 'w', title: "Wednesday"},
  {id: 'r', title: "Thursday"},
  {id: 'f', title: "Friday"},
  {id: 's', title: "Saturday"},
  {id: 'u', title: "Sunday"},
];

const initialItemState = [];
const initialDragState = {};

const Todoboard = (props) => {
  const [lists, listDispatch] = React.useReducer(listReducer, initialListState);
  const [items, itemDispatch] = React.useReducer(itemReducer, initialItemState);
  const [draggedItem, dragDispatch] = React.useReducer(dragReducer, initialDragState);

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
    };
    return outList;
  };

  const addList = () => {
    const nl = newList();
    listDispatch({type: 'ADD_LIST', listId: nl.id, payload: nl});
  };

  const removeList = (listId) => {
    // remove a lists items first to prevent orphaned data
    items.map( item =>  {
      if (item.belongsTo === listId) {
        itemDispatch({
          type: 'REMOVE_TODO',
          itemId: item.id
        });
      }
      return item;
    });
    
    listDispatch({type: 'REMOVE_LIST', listId: listId});
    
  };

  const getListSize = (listId) => {
    const ownedItems = items.filter( item => item.belongsTo === listId)
    return ownedItems.length;
  };

  const handleDragEnd = (event) => {
    console.log("dragend, bubbled to board");
    console.log("Item: ", draggedItem.item);
    console.log("List: ", draggedItem.list);
    dragDispatch({
      type: 'CLEAR_DRAGGED_ITEM',
    });
    dragDispatch({
      type: 'CLEAR_HOVERED_LIST',
    });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    console.log("dropped, bubbled to board");
    console.log("Item: ", draggedItem.item);
    console.log("List: ", draggedItem.list);
    dragDispatch({
      type: 'CLEAR_DRAGGED_ITEM',
    });
    dragDispatch({
      type: 'CLEAR_HOVERED_LIST',
    });
  };

  const handleDragStart = (event) => {
    console.log("start in board");
  };

  return (
    <>
    <ListDispatchContext.Provider value={listDispatch}>
    <ItemDispatchContext.Provider value={itemDispatch}>
    <div className="calendar">
      <div className="calendar-container" >
        {lists.map( (list, index) => (
          (index <= 6) &&
            <div 
              className="calendar-individual"
              key={list.id}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
            >
              <>
              <Todolist
                thisClass={"calendar"}
                title={list.title}
                key={list.id}
                id={list.id}
                items={items}
                getSize={getListSize}
                getId={getId}
                canDelete={false}
                canEditTitle={false}
                draggedItem={draggedItem}
                dragDispatch={dragDispatch}
                onDeleteClick={() => removeList(list.id)}
              />
              </>
            </div>
        ))}
      </div>
    </div>
    <hr style={{width: "90vw"}}/>
    <div className="todo">
    <div className="todo-container">
    {lists.length > 0 &&
      <>
      {lists.map( (list, index) => (
        (index > 6) && 
        <div 
          className="todo-individual" 
          key={list.id}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
        >
        <>
        <Todolist
          thisClass={"todo"}
          title={list.title}
          key={list.id}
          id={list.id}
          items={items}
          getSize={getListSize}
          getId={getId} 
          canDelete={true}
          canEditTitle={true}
          draggedItem={draggedItem}
          dragDispatch={dragDispatch}
          onDeleteClick={() => removeList(list.id)}
        />
        </>
        </div>
      ))}
      </>
    }

    <button
      className="addListButton"
      onClick={addList}
    >{"+ Add list"}</button>
    </div>
    </div>
    </ItemDispatchContext.Provider>
    </ListDispatchContext.Provider>
    </>
  )
};

export default Todoboard;
