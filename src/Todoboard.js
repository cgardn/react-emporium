import React from 'react';
import './Todoboard.css';
import DragItem from './Draggable';

// TODO-next steps
//  - limit number of lists before bumping to next line
//    - CSS issue, next line goes off the page - need to 
//      keep the app to viewport size since the lower-half
//      list area is scrollable, but the whole page is not
//  - work on dragging items around
//    - make calendar days drag targets
//      - also make "list-container" on the days
// TODO-bugs

const Day = (props) => {
  const dispatch = React.useContext(ListDispatchContext);
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragStart = (event) => {
    const data = JSON.parse(event.dataTransfer.getData('listItem'));
    const newData = JSON.stringify( {
      ...data,
      fromListId: props.id,
    });
    event.dataTransfer.setData('listItem', newData);
  };

  const handleDrop = (event) => {
    const data = JSON.parse(event.dataTransfer.getData('listItem'));

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

  return (
    <div
      className="calendar-day"
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
    >
      <div className="calendar-day-name">
        {dayNames[props.day]}
      </div>
      <div className="list-content">
        <>
      {props.items.map( (item, index) => (
        <Listitem
          key={item.id}
          id={item.id}
          content={item.content}
          onChange={changeItem}
          onDeleteClick={() => removeItem(item.id)}
        />
      ))}
        </>
      </div>
    </div>
  );
};

const Week = (props) => {

  return (
    <>
    <div className="calendar-container" >
      {props.lists.map( (item, index) => (
        (index <= 6) &&
        <Day
          key={index}
          day={index}
          items={item.items}
          id={item.id}
        />
      ))}
    </div>
    </>
  );
};

const Itemmenu = (props) => {
  return (
    <button
      className="item-menu"
      autoFocus={true}
      style={{ top: props.posY, left: props.posX }}
      onClick={props.onClick}
      onBlur={props.onBlur}
    >Delete</button>
  );
};


const Editlabel = (props) => {
  // Editable label, a span that replaces itself with an Input box on click
  // - receives content of box or span as a prop
  // - receives id as prop, to be sent back to parent onChange, to change correct list item content
  // - receives function references as props:
  //    + change function for lifting state back up to parent 

  return (
    <>
    {props.isEdit === true
      ? <form 
          onSubmit={event => {
            event.preventDefault()
            props.setIsEdit(false)}
          }
        >
          <input
            className={props.class}
            value={props.content}
            autoFocus={true}
            onFocus={event => event.target.select()}
            onChange={event => props.onChange(props.id, event.target.value)}
            onBlur={event => props.setIsEdit(false)}
          >
          </input>
        </form>
      : <span 
          className={props.class}
          onClick={event => props.setIsEdit(true)}
        >{props.content}</span>
    }
    </>
  );
};

const Listitem = (props) => {
  const [contextMenu, setContextMenu] = React.useState([0,0,false]);
  const [isEdit, setIsEdit] = React.useState(false);

  const handleDragStart = (event) => {
    const data = JSON.stringify( {
      itemId: props.id,
      content: props.content
    });
    event.dataTransfer.setData('listItem', data);
  };

  return (
    <div
      className="list-item"
      draggable={isEdit ? "false" : "true"}
      onDragStart={handleDragStart}
    >
      <Editlabel
        class={"list-item-objects list-item-label"}
        id={props.id}
        content={props.content}
        onChange={props.onChange}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />
      <button
        className="deleteItemButton list-item-objects"
        onClick={event => setContextMenu([event.pageX, event.pageY, !contextMenu[2]])}
      >
      {String.fromCharCode(9899) + String.fromCharCode(9899) + String.fromCharCode(9899)}
      </button>
      {contextMenu[2] && 
        <Itemmenu
          posX={contextMenu[0]}
          posY={contextMenu[1]}
          onClick={props.onDeleteClick}
          onBlur={event => setContextMenu([0,0,!contextMenu])}
        />
      }
    </div>
  );
};

const Todolist = (props) => {
  const dispatch = React.useContext(ListDispatchContext);

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
    <div className="list">
      {props.hasTitle &&
      <div className="title">
        <Editlabel
          class={"list-title"}
          id={props.list.id}
          content={props.list.title}
          onChange={changeListTitle}
        />
        <button
          className="list-delete-button"
          onClick={props.onDeleteClick}
        >X</button>
      </div>
      }
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
      >{"+ Add an item"}</button>
    </div>
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
//const initialListState = [];
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
//  const [days, dayDispatch] = React.useReducer(listReducer, initialDayState);
  const [nextItemId, setNextItemId] = React.useState(0);

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
 /* 
          <Day
            key={index}
            day={index}
            items={item.items}
            id={item.id}
          />
          */
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  return (
    <>
    <ListDispatchContext.Provider value={dispatch}>
    <div className="calendar">
      <div className="calendar-container" >
        {lists.map( (list, index) => (
          (index <= 6) &&
            <div className="calendar-day">
              <>
              <div className="calendar-day-name">
                {dayNames[index]}
              </div>
              <Todolist
                hasTitle={false}
                list={list}
                key={list.id}
                id={list.id}
                getId={getId}
                onDeleteClick={() => removeList(list.id)}
              />
              </>
            </div>
        ))}
      </div>
    </div>
    <hr style={{width: "90vw"}}/>
    <div className="todoboard">
    {lists.length > 0 &&
      <>
      {lists.map( (list, index) => (
        (index > 6) && 
        <Todolist
          hasTitle={true}
          list={list}
          key={list.id}
          id={list.id}
          getId={getId} 
          onDeleteClick={() => removeList(list.id)}
        />
         
      ))}
      </>
    }

    <button
      className="addListButton"
      onClick={addList}
    >{"+ Add another list"}</button>
    </div>
    </ListDispatchContext.Provider>
    </>
  )
};

export default Todoboard;
