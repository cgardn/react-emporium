import React from 'react';

const DragParent = (props) => {

  const dispatch = React.useContext(props.dispatchContext);

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

  return (
    <div>
      {props.children}
    </div>
  );
};

const DragItem = (props) => {
  const handleDragStart = (event) => {
    const data = JSON.stringify(props.item);
    event.dataTransfer.setData('listItem', data);
  };
  return (
    <div 
      draggable="true"
      onDragStart={handleDragStart}
    >
      {props.children}
    </div>
  );
};
