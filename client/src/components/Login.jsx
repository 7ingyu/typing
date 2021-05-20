import React, { useState } from 'react';
import ReactModal from 'react-modal';
import NewUser from './NewUser.jsx';
import Signin from './Signin.jsx';
import FakeLink from './../styling/FakeLink.jsx';

export default ({ login, loginWarning, handleLogin }) => {

  const [newUser, setNewUser] = useState(false);

  const overlay = {

  };

  const content = {
    maxWidth: '350px',
    width: '95vw',
    left: '50%',
    transform: 'translateX(-50%)',
    top: '5%'
  };

  const bottom = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }

  const warning = {
    height: '1.5em',
    fontWeight: '300',
    color: 'red',
    textAlign: 'center'
  }

  const handleQuit = () => {
    handleLogin({login: false});
  };

  return (
    <ReactModal
      isOpen={login === undefined ? true: false}
      onRequestClose={() => handleLogin({login: false})}
      contentLabel={"Login Modal"}
      appElement={document.getElementById('app')}
      preventScroll={true}
      style={{ overlay: overlay, content: content }}>
      {newUser ?
        <><h1>Sign Up</h1>
        <NewUser handleLogin={handleLogin}/>
        <div style={warning}>{loginWarning}</div>
        <div style={bottom}><FakeLink onClick={() => setNewUser(false)}>Sign In</FakeLink>
        <span> | </span>
        <FakeLink onClick={handleQuit}>Continue As Guest</FakeLink></div>
        </>:
        <>
        <h1>Sign In</h1>
        <Signin handleLogin={handleLogin}/>
        <div style={warning}>{loginWarning}</div>
        <div style={bottom}><FakeLink onClick={() => setNewUser(true)}>Create An Account</FakeLink>
        <span> | </span>
        <FakeLink onClick={handleQuit}>Continue As Guest</FakeLink></div>
        </>
      }

    </ReactModal>
  );
}

