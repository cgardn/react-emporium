import React from 'react';

const EditableLabel = (props) => {
  return (
    <>
    <span 
      className={props.class}
    >{props.content}
    </span>
    <button
      className="addItemButton"
      style={{ fontsize: '2rem' }}
      onClick={props.onClick}
    >{"+"}
    </button>
    </>
  );
};


const Inputbox = (props) => {
  const [content, setContent] = React.useState(props.content);
  
  return (
    <form onSubmit={ event => {
        event.preventDefault()
        props.onSubmit(props.id, content)}}
    >
      <input
        className="editLabel"
        style={{ padding: "2px", margin: "0.5rem", border: "thin solid #111" }}
        onChange={event => setContent(event.target.value)}
        onBlur={event => props.onSubmit(props.id, content)}
        value={content}
      ></input>
    </form>
  );
};

const Staticlabel = (props) => {
  const handleClick = () => {
    console.log(props.id);
    props.onClick(props.id);
  };
  return (
    <span onClick={event => handleClick()}>{props.content}</span>
  );
};

const Listitem = (props) => {
  const {content = "Edit me", ...restProps} = props;

  return (
    <div className={`todo-${restProps.id}`}>
      <Staticlabel id={props.id} onClick={props.onClick} content={content} />
      <button
        className="deleteItemButton"
        style={{ padding: "2px", margin: "0.5rem", border: "thin solid #111" }}
        onClick={props.onDeleteClick}
      >
      {"X"}
      </button>
    </div>
  );
};

const Todolist = () => {
  const [listContent, setListContent] = React.useState([]);
  const [nextItemId, setNextItemId] = React.useState(0);

  const handleInputSubmit = (id, content) => {
    changeItem(content, id);
  };
    
  const handleInputChange = (e) => {
    console.log("changed");
  };

  const changeItem = (newContent, id) => {
    setListContent(listContent.map( (item) => 
      item.id === id 
        ? {id: item.id, content: newContent, isEdit: false}
        : item
    ))
  };

  const handleLabelClick = (id) => {
    setListContent(listContent.map( (item) => 
      item.id === id
        ? {id: item.id, content: item.content, isEdit: true}
        : item
    ))
  };

  const removeItem = (n) => {
    setListContent(listContent.slice(0,n).concat(listContent.slice(n+1,listContent.length)));
  };

  const newItem = (content, isEdit) => {
    const outItem = {
      content: content,
      isEdit: isEdit,
      id: nextItemId,
    };
    setNextItemId(nextItemId + 1);
    return outItem;
  };

  const handleAdditemClick = () => {
    setListContent(listContent.concat(newItem("Edit me", true)));
  };

  return (
    <div className="list-body">
      <EditableLabel
        class="new-list-title"
        content="Here's a new list"
        onClick={() => handleAdditemClick()}
      />
      
      {listContent.map( (item, index) => (
        item.isEdit === true
        ? <Inputbox
            key={item.id}
            id={item.id}
            content={item.content}
            onSubmit={handleInputSubmit}
            onChange={handleInputChange}
          />
        : <Listitem
            key={item.id}
            id={item.id}
            content={item.content}
            onClick={handleLabelClick}
            onDeleteClick={ () => removeItem(index) }
          />
      ))}
      
    </div>
  );
};


class App extends React.Component {
  render() {
    return (
      <Todolist />
    );
  }
}

export default App;
