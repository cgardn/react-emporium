import React from 'react';
import './Navbar.css';
import {StateDispatchContext} from './stateManager.js';

const SettingsMenu = (props) => {

  const stateDispatch = React.useContext(StateDispatchContext);

  const [isExportShowing, setIsExportShowing] = React.useState(false);
  const [isImportShowing, setIsImportShowing] = React.useState(false);

  const clearAll = () => {
    if (window.confirm("Clear all? This will erase the entire board!!")) {
      stateDispatch({
        type: 'CLEAR_STATE',
      });
    }
  };

  return (
    <div
      className="settings-menu-overlay"
      onClick={event => {
        console.log("Clicked outside menu")
        props.setSettingsMenuProps([0,0,false])
      }}
    >
    <ul
      className="settings-menu"
      onClick={event => event.stopPropagation()}
      style={{ top: props.posY, left: props.posX }}
    >
      <li 
        className="settings-menu-item"
        onClick={event => {
          setIsExportShowing(true)
          setIsImportShowing(false)
        }}
      >Export</li>
      <li 
        className="settings-menu-item"
        onClick={event => {
          setIsExportShowing(false)
          setIsImportShowing(true)
        }}
      >Import</li>
      <li
        className="settings-menu-item"
        onClick={clearAll}
      >Clear All</li>

    </ul>
      {isExportShowing &&
        <ExportDisplay content={props.todoState}/>
      }
      {isImportShowing &&
        <ImportDisplay setIsImportShowing={setIsImportShowing}/>
      }
    </div>
  );
}

const ExportDisplay = (props) => {
  return (
    <div 
      className="export-display"
    >
      <textarea 
        className="export-content"
        onClick={event => event.stopPropagation()}
        defaultValue={btoa(JSON.stringify(props.content))}
      ></textarea>
      <div className="export-buttons">
        <span>Close</span>
      </div>
    </div>
  );
}

const ImportDisplay = (props) => {
  const stateDispatch = React.useContext(StateDispatchContext);
  const [importData, setImportData] = React.useState("");

  const importClick = (event) => {
    if (window.confirm("Import? This will erase all your current data!!")) {
      stateDispatch({
        type: 'LOAD_NEW_STATE',
        newState: JSON.parse(atob(importData)),
      });
      props.setIsImportShowing(false);
    }
  };

  const cancelClick = () => {
    props.setIsImportShowing(false);
  };

  return (
    <div 
      className="export-display"
    >
      <textarea 
        className="export-content"
        onClick={event => event.stopPropagation()}
        value={importData}
        onChange={event => setImportData(event.target.value)}
      >
      </textarea>
      <div style={{margin: "auto"}} onClick={event => event.stopPropagation()}>
        <span 
          className="export-buttons"
          onClick={cancelClick}
        >Cancel</span>
        <span 
          className="export-buttons"
          onClick={event => importClick(event)}
        >Import</span>
      </div>
    </div>
  );
}
      

const Navbar = (props) => {
  const [settingsMenuProps, setSettingsMenuProps] = React.useState([0,0,false]);

  return(
    <div className="navbar">
      <span
        className="navbar-title navbar-item"
      >List Reactor</span>
      <span
        className="navbar-settings navbar-item"
        onClick={event => setSettingsMenuProps([event.pageX, event.pageY, !settingsMenuProps[2]])}
      >Settings</span>
      {settingsMenuProps[2] &&
        <SettingsMenu
          posX={settingsMenuProps[0]-90}
          posY={settingsMenuProps[1]+10}
          todoState={props.todoState}
          setSettingsMenuProps={setSettingsMenuProps}
        />
      }

    </div>
  );
}

export default Navbar;
