import React from 'react';
import './LoginButton.css'
import {StateDispatchContext} from './stateManager.js';

const LoginBox = (props) => {

  const [email, setUserEmail] = React.useState("");
  const [pwd, setUserPwd] = React.useState("");
  const [mode, setMode] = React.useState('login');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(mode);
    console.log(`Email: ${email} \nPwd: ${pwd}`);
  };

  return (
    <div 
      className="menu-overlay"
      onClick={event => {
        props.setIsLoginShowing(false);
      }}
    >
      <ul
        className="settings-menu"
        onClick={event => {
          event.stopPropagation();
        }}
        style={{ top: props.position.top+35, left: props.position.left-20 }}
      >
        {mode == 'login' && <span>Login</span>}
        {mode == 'signup' && <span>Sign Up</span>}
        <form onSubmit={handleSubmit} className="loginBox-form">
          <label>Email: </label>
          <input 
            type="text" 
            name="userEmail"
            onChange={e => setUserEmail(e.target.value)}
          ></input>
          <br />
          <label>Password: </label>
          <input 
            type="password" 
            name="userPassword"
            onChange={e => setUserPwd(e.target.value)}
          ></input>
          <br />
        <div className="loginBox-buttons">
          {mode === 'login' &&
            <input className="submitButton" type="submit" value="Login"></input>
          }
          {mode === 'login' &&
            <a href="" 
              className="switchButton"
              onClick={e => {
                e.preventDefault();
                setMode('signup');
              }}
            >Sign Up</a>
          }
          {mode === 'signup' &&
            <a href=""
              className="switchButton"
              onClick={e => {
                e.preventDefault();
                setMode('login');
              }}
            >Login</a>
          }
          {mode === 'signup' &&
            <input className="submitButton" type="submit" value="Sign Up"></input>
          }
        </div>
        </form> 
      </ul>
    </div>
  );
}

const LoginButton = () => {

  const stateDispatch = React.useContext(StateDispatchContext);
  const [isLoginShowing, setIsLoginShowing] = React.useState(false);
  const [boxPosition, setBoxPosition] = React.useState({top: 0, left: 0});

  return (
    <div
      className="navbar-item navbar-settings"
    >

      <span
        onClick={event => {
          setIsLoginShowing(!isLoginShowing);
          setBoxPosition({
            top: event.target.offsetTop,
            left: event.target.offsetLeft,
          });
        }}
      >Login</span>

      {isLoginShowing &&
        <LoginBox
          setIsLoginShowing={setIsLoginShowing}
          position={boxPosition}
        />
      }

    </div>
  );
}


export default LoginButton;
