import React, { useState } from 'react';
import ReactModal from 'react-modal';
import NewUser from './NewUser.jsx';
import Signin from './Signin.jsx';
import FakeLink from './../styling/FakeLink.jsx';

export default ({ login, handleLogin }) => {

  const [newUser, setNewUser] = useState(false);

  const handleQuit = () => {
    handleLogin({login: false});
  };

  return (
    <ReactModal
      isOpen={login === undefined ? true: false}
      onRequestClose={() => handleLogin({login: false})}
      contentLabel={"Login Modal"}
      appElement={document.getElementById('app')}
      preventScroll={true}>
      {newUser ?
        <><h1>Create An Account</h1>
        <NewUser handleLogin={handleLogin}/>
        <FakeLink onClick={() => setNewUser(false)}>Sign In</FakeLink>
        <span> | </span>
        <FakeLink onClick={handleQuit}>Continue As Guest</FakeLink>
        </>:
        <>
        <h1>Sign In</h1>
        <Signin handleLogin={handleLogin}/>
        <FakeLink onClick={() => setNewUser(true)}>Create An Account</FakeLink>
        <span> | </span>
        <FakeLink onClick={handleQuit}>Continue As Guest</FakeLink>
        </>
      }

    </ReactModal>
  );
}

