import React from 'react';
import './App.css';

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
  const [isEdit, setIsEdit] = React.useState(false);

  return (
    <>
    {isEdit === true
      ? <form 
          onSubmit={event => {
            event.preventDefault()
            setIsEdit(false)}
          }
        >
          <input
            className={props.class}
            value={props.content}
            autoFocus={true}
            onChange={event => props.onChange(props.id, event.target.value)}
            onBlur={event => setIsEdit(false)}
          >
          </input>
        </form>
      : <span 
          className={props.class}
          onClick={event => setIsEdit(true)}
        >{props.content}</span>
    }
    </>
  );
};

const Listitem = (props) => {
  const [contextMenu, setContextMenu] = React.useState([0,0,false]);

  return (
    <div
      className="list-item"
    >
      <Editlabel
        class={"list-item-objects list-item-label"}
        id={props.id}
        content={props.content}
        onChange={props.onChange}
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
  const [listContent, setListContent] = React.useState([]);
  const [listTitle, setListTitle] = React.useState("New List");

  const changeItem = (id, newContent) => {
    setListContent(listContent.map( (item) => 
      item.id === id 
        ? {id: item.id, content: newContent}
        : item
    ))
  };

  const removeItem = (n) => {
    setListContent(listContent.slice(0,n).concat(listContent.slice(n+1,listContent.length)));
  };

  const newItem = (content) => {
    return {
      content: content,
      id: props.getId(),
    };
  };

  const handleAdditemClick = () => {
    setListContent(listContent.concat(newItem("Click to edit", true)));
  };

  const changeListTitle = (id, content) => {
    setListTitle(content);
  };

  return (
    <div className="list">
      <div className="title">
        <Editlabel
          class={"list-title"}
          id={props.id}
          content={listTitle}
          onChange={changeListTitle}
        />
      </div>
      {listContent.length > 0 &&
      <div className="list-content">
        {listContent.map( (item, index) => (
          <Listitem
            key={item.id}
            id={item.id}
            content={item.content}
            onChange={changeItem}
            onDeleteClick={() => removeItem(index)}
          />
        ))}
      </div>
      }
      
        <button
          className={"addItemButton"}
          style={{ fontsize: '2rem' }}
          onClick={event => handleAdditemClick()}
        >{"+ Add an item"}</button>
    </div>
  );
};

const Board = (props) => {
  const [lists, setLists] = React.useState([]);
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
    };
    return outList;
  };

  const addList = () => {
    setLists(lists.concat(newList()));
  };
  
  return (
    <>
    {lists.length > 0 &&
      <>
      {lists.map( (list) => (
        <Todolist
          key={list.id}
          id={list.id}
          getId={getId} 
        />
      ))}
      </>
    }

    <button
      className="addListButton"
      onClick={addList}
    >{"+ Add another list"}</button>
    </>
  );
};

const App = () => {
  return (
    <Board />
  );
};

export default App;
