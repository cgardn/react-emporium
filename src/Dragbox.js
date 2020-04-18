import React from 'react';

function Dragbox(props) {
  const [pos, setPos] = React.useState([50,50]);
  //const [isDragging, setDragging] = React.useState(false);

  const styles = {
    top: `${pos[0]}px`,
    left: `${pos[1]}px`,
    border: '1px solid black',
    height: '50px',
    width: '100px',
  };

  const handleMouseDown = (e) => {
    //setDragging(true);
  };
  const handleMouseUp = () => {
    //setDragging(false);
  };
  const handleMouseMove = (e) => {
    //if (isDragging === true) {
      //setPos([e.pageY-20, pos[1]]);
    //}
  };
  const handleDrag = (e) => {
    console.log(e);
  };
  const handleDrop = (e) => {
    setPos([e.pageY, e.pageX]);
  };


  return (
    <div
      style={styles}
      draggable="true"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onDrag={handleDrag}
      onDrop={handleDrop}
    >   
    Test
    </div>
  );
};

class List extends React.Component {
  render() {
    return (
      <div>
        <Dragbox />
      </div>
    );
  }
}

class App extends React.Component {

  render() {
    return (
      <div 
        width="100%"
        height="100%"
        onDragOver={ (e) => {e.preventDefault();}}>
        <List />
      </div>
    );
  }
}

export default App;
