import React from 'react';
import './Todoboard.css';

// TODO-next steps
//  - limit number of lists before bumping to next line
//    - CSS issue, next line goes off the page - need to 
//      keep the app to viewport size since the lower-half
//      list area is scrollable, but the whole page is not
//  - resize the lower lists, they're huge
//  - make 3-dots on listitems a lot smaller
//  - center the lower lists also
//  - make the addItemButtons into inputs that you type into
//  - make the addList button larger, or in it's own place
//    - possibly move up to header-toolbar when I get to that
//  - reorganize code, remove stuff that doesn't need to be
//    here and compartmentalize things that don't need to
//    know about each other
//    - can probably move drag-and-drop stuff into its own
//      wrapper component
//    - look at main Todoboard component, its huge
// TODO-bugs


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
  const [isEdit, setIsEdit] = React.useState(true);

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
      {String.fromCharCode(9899) + ' ' + String.fromCharCode(9899) + ' ' + String.fromCharCode(9899)}
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
    <div className={props.thisClass}>
      {props.hasTitle &&
      <div className="title">
        <Editlabel
          class={""}
          id={props.list.id}
          content={props.list.title}
          onChange={changeListTitle}
          isEdit={isTitleEdit}
          setIsEdit={setTitleEdit}
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
      >{"+"}</button>
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

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  return (
    <>
    <ListDispatchContext.Provider value={dispatch}>
    <div className="calendar">
      <div className="calendar-container" >
        {lists.map( (list, index) => (
          (index <= 6) &&
            <div className="calendar-individual" key={index+1000}>
              <>
              <div className="calendar-individual-title">
                {dayNames[index]}
              </div>
              <Todolist
                thisClass={"calendar-list"}
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
    <div className="todo-container">
    {lists.length > 0 &&
      <>
      {lists.map( (list, index) => (
        (index > 6) && 
        <div className="todo-individual" key={index+100}>
        <>
        <div className="todo-individual-title">
          {list.title}
        </div>
        <Todolist
          thisClass={"todo-list"}
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
