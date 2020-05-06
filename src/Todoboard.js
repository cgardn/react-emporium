import React from 'react';

import Editlabel from './Editlabel';
import Listitem from './Listitem';

import './Todoboard.css';


// TODO-next steps
//
//  IMMEDIATE/CURRENT
//    - working on drag-to-reorder
//      -> placeholder shadow works
//      -> need way to track/update array order
//      -> need to give listitems ondragenter and tie it up
//          to the array order through the main reducer
//
//  - resize the lower lists, they're huge
//    - eventually make them resizeable
//  - make 3-dots on listitems a lot smaller
//    - eventually make them an img so avoid the weird reflow
//  - center the lower lists, but still build from left
//  - make the addItemButtons into inputs that you type into
//  - give addList button a permanent home somewhere
//    - up top in header/toolbar when i get there
//    - possibly floating in lower corner?
//  - reorganize code, remove stuff that doesn't need to be
//    here and compartmentalize things that don't need to
//    know about each other
//    - can probably move drag-and-drop stuff into its own
//      wrapper component
//    - look at main Todoboard component, its huge
//    - code duplication in Todoboard render()
//    - code duplication in Todolist render()
// TODO-bugs
//  - Editlabel inputs are different size than the labels,
//    causing minor reflow when swapping modes
//  - Listitems arent properly re-indexed when moved or
//      deleted
// TODO-things to remember to save when doing backend
//  - list object minus edit states
//  - current nextId for getId

const Todolist = (props) => {
  const listDispatch = React.useContext(ListDispatchContext);
  const itemDispatch = React.useContext(ItemDispatchContext);
  const [isTitleEdit, setTitleEdit] = React.useState(false);

  const handleDragOver = (event) => {
    event.preventDefault();  
    event.stopPropagation();
    itemDispatch({
      type: 'UPDATE_TODO_OWNER',
      itemId: props.draggedItem.id,
      newOwner: props.id,
      index: props.getSize(props.id),
    });
  };

  const changeItem = (id, newContent) => {
    itemDispatch({
      type: 'UPDATE_TODO_CONTENT',
      itemId: id,
      payload: newContent
    });
  };

  const removeItem = (id) => {
    itemDispatch({
      type: 'REMOVE_TODO',
      itemId: id,
    });
  };

  const handleAdditemClick = () => {
    itemDispatch({
      type: 'ADD_TODO',
      payload: {
        id: props.getId(),
        index: props.getSize(props.id),
        belongsTo: props.id,
        content: "Click to edit"}
    });
  };

  const changeListTitle = (id, content) => {
    listDispatch({
      type: 'UPDATE_LIST_TITLE',
      id: id,
      payload: content
    });
  };

  const handleSwapItems = (event) => {
    const data = JSON.parse(event.dataTransfer.getData("listitem"));
    console.log(data);
    /*
    dispatch({
      type: 'SWAP_TODOS',
      overId: data.overId,
      underId: data.underId,
      listId: props.id
    });
    */
  };

  const getTitleEdit = () => {
    if (props.canEditTitle) {
      return [isTitleEdit, setTitleEdit]
    } else {
      return [false, () => {return;}]
    }
  };

  return (
    <>
      <div className={`${props.thisClass}-individual-title`}>
        <Editlabel
          class={"list-item-objects list-item-label"}
          id={props.id}
          content={props.title}
          onChange={changeListTitle}
          isEdit={isTitleEdit}
          setIsEdit={setTitleEdit}
          titleEdit={[isTitleEdit, setTitleEdit]}
        />
      
      {props.canDelete &&
        <button
          className="list-delete-button"
          onClick={props.onDeleteClick}
        >X</button>
      }
      </div>

      <div className={`${props.thisClass}-list`}>
        <div
          className="list-content"
          onDragEnter={event => handleDragOver(event)}
        >
          {props.items.filter( item => item.belongsTo === props.id).sort( (a,b) => (a.index > b.index) ? 1 : -1).map( item => (
            <Listitem
              key={item.id}
              id={item.id}
              index={item.index}
              content={item.content}
              swapItems={handleSwapItems}
              dragDispatch={props.dragDispatch}
              onChange={changeItem}
              onDeleteClick={() => removeItem(item.id)}
            />
          ))}
        </div>
        <button
          className={"addItemButton"}
          style={{ fontsize: '2rem' }}
          onClick={handleAdditemClick}
        >{"+"}</button>
      </div>
    </>
  );
};

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
    case 'SWAP_TODO_ORDER':
      // receives two item ids, swaps their index values
      return state;
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
      return action.payload;
    case 'CLEAR_DRAGGED_ITEM':
      return {};
    default:
      return state;
    }
};

const ListDispatchContext = React.createContext(null);
const ItemDispatchContext = React.createContext(null);

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
//  - dragReducer: holds copy of current dragged item
//      - item: Object, dragged item
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
    });
    
    listDispatch({type: 'REMOVE_LIST', listId: listId});
    
  };

  const getListSize = (listId) => {
    const ownedItems = items.filter( item => item.belongsTo === listId)
    return ownedItems.length;
  };

  return (
    <>
    <ListDispatchContext.Provider value={listDispatch}>
    <ItemDispatchContext.Provider value={itemDispatch}>
    <div className="calendar">
      <div className="calendar-container" >
        {lists.map( (list, index) => (
          (index <= 6) &&
            <div className="calendar-individual" key={list.id}>
              <>
              <Todolist
                thisClass={"calendar"}
                title={list.title}
                key={list.id}
                id={list.id}
                getId={getId}
                items={items}
                getSize={getListSize}
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
        <div className="todo-individual" key={list.id}>
        <>
        <Todolist
          thisClass={"todo"}
          canDelete={true}
          title={list.title}
          key={list.id}
          id={list.id}
          items={items}
          getSize={getListSize}
          getId={getId} 
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
