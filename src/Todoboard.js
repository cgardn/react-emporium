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
//      -> need to give listitems ondragover and tie it up
//          to the array order through the main reducer
//
//  - resize the lower lists, they're huge
//    - eventually make them resizeable
//  - make 3-dots on listitems a lot smaller
//    - eventually make them an img so avoid the weird reflow
//  - center the lower lists also, but still build from left
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
// TODO-bugs
//  - Editlabel inputs are different size than the labels,
//    causing minor reflow when swapping modes
// TODO-things to remember to save when doing backend
//  - list object minus edit states
//  - current nextId for getId

const Todolist = (props) => {
  const dispatch = React.useContext(ListDispatchContext);
  const [isTitleEdit, setTitleEdit] = React.useState(false);

  const handleDragOver = (event) => {
    event.preventDefault();  
  };

  const handleDrop = (event) => {
    const data = JSON.parse(event.dataTransfer.getData("listItem"));

    if (data.fromListId === props.id) {
      console.log("same list, cancel drop");
      return;
    };
    dispatch({
      type: 'ADD_TODO',
      id: props.id,
      payload: {id: data.itemId, content: data.content}
    });
    dispatch({
      type: 'REMOVE_TODO',
      listId: data.fromListId,
      itemId: data.itemId,
    });
  };

  const handleDragStart = (event) => {
    const data = JSON.parse(event.dataTransfer.getData('listItem'));
    const newData = JSON.stringify( {
      ...data,
      fromListId: props.id,
    });
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData('listItem', newData);
  };

  const changeItem = (id, newContent) => {
    dispatch({
      type: 'UPDATE_TODO',
      listId: props.id,
      itemId: id,
      payload: newContent
    });
  };

  const removeItem = (id) => {
    dispatch({type: 'REMOVE_TODO', listId: props.id, itemId: id});
  };

  const newItem = (content) => {
    return {
      content: content,
      id: props.getId(),
    };
  };

  const handleAdditemClick = () => {
    const ni = newItem("Click to edit");
    dispatch({type: 'ADD_TODO', id: props.id, payload: ni});
  };

  const changeListTitle = (id, content) => {
    dispatch({
      type: 'UPDATE_LIST_TITLE',
      id: id,
      payload: content
    });
  };

  return (
    <>
      <div className={`${props.thisClass}-individual-title`}>
      {props.canEditTitle ?
        <Editlabel
          class={"list-item-objects list-item-label"}
          id={props.list.id}
          content={props.title}
          onChange={changeListTitle}
          isEdit={isTitleEdit}
          setIsEdit={setTitleEdit}
        />
      : 
        <Editlabel
          class={"list-item-objects list-item-label"}
          id={props.list.id}
          content={props.title}
          onChange={changeListTitle}
          isEdit={false}
          setIsEdit={() => {return;}}
        />
      }
      
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
          onDragStart={handleDragStart}
          onDragOver={event => handleDragOver(event)}
          onDrop={handleDrop}
        >
          {props.list.items.map( (item, index) => (
            <Listitem
              key={item.id}
              id={item.id}
              content={item.content}
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

const ListDispatchContext = React.createContext(null);
const initialListState = [
  {id: 'm', items: []},
  {id: 't', items: []},
  {id: 'w', items: []},
  {id: 'r', items: []},
  {id: 'f', items: []},
  {id: 's', items: []},
  {id: 'u', items: []},
];

const Todoboard = (props) => {
  const [lists, dispatch] = React.useReducer(listReducer, initialListState);
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
      items: []
    };
    return outList;
  };

  const addList = () => {
    const nl = newList();
    dispatch({type: 'ADD_LIST', listId: nl.id, payload: nl});
  };

  const removeList = (listID) => {
    dispatch({type: 'REMOVE_LIST', listId: listID, payload: null});
  };

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  return (
    <>
    <ListDispatchContext.Provider value={dispatch}>
    <div className="calendar">
      <div className="calendar-container" >
        {lists.map( (list, index) => (
          (index <= 6) &&
            <div className="calendar-individual" key={list.id}>
              <>
              <Todolist
                thisClass={"calendar"}
                hasTitle={false}
                list={list}
                title={dayNames[index]}
                key={list.id}
                id={list.id}
                getId={getId}
                canDelete={false}
                canEditTitle={false}
                onDeleteClick={() => removeList(list.id)}
              />
              </>
            </div>
        ))}
      </div>
    </div>
    <hr style={{width: "90vw"}}/>
    <div className="todo-container">
    {lists.length > 0 &&
      <>
      {lists.map( (list, index) => (
        (index > 6) && 
        <div className="todo-individual" key={list.id}>
        <>
        <Todolist
          thisClass={"todo"}
          hasTitle={false}
          canDelete={true}
          list={list}
          title={list.title}
          key={list.id}
          id={list.id}
          getId={getId} 
          canEditTitle={true}
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
    </ListDispatchContext.Provider>
    </>
  )
};

export default Todoboard;
