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
      style={{ fontsize: '2rem', }}
      onClick={props.onClick}
    >{"+"}
    </button>
    </>
  );
};

const Listitem = (props) => {
  const {content = "Edit me", ...restProps} = props;
  return (
    <div
      className={`todo-${restProps.id}`}
    >
    <span>{content}</span>
    <button
      className="deleteItemButton"
      style={{ padding: "2px", margin: "0.5rem", border: "thin solid #111" }}
      onClick={props.onClick}
    >
    {"X"}
    </button>
    </div>
  );
};

const Todolist = () => {
  const [listContent, setListContent] = React.useState([]);

  const removeItem = (n) => {
    setListContent(listContent.slice(0,n).concat(listContent.slice(n+1,listContent.length)));
  };

  return (
    <div className="list-body">
      <EditableLabel
        class="new-list-title"
        content="Here's a new list"
        onClick={() => setListContent(listContent.concat("Edit me"))}
      />
  
      {[...listContent.keys()].map(n =>
        <Listitem 
          key={n}
          id={n}
          content={listContent[n]} 
          onClick={ () => removeItem(n) }
        />
      )}
    </div>
  );
};

const utils = {
  range: (min, max) => {
    return Array.from({ length: max-min+1}, (x, i) => min + i)
  },
};


class App extends React.Component {
  render() {
    return (
      <Todolist />
    );
  }
}

export default App;
