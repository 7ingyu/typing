import React from 'react';
import ReactModal from 'react-modal';

export default ({ login, handleLogin }) => {

  const handleQuit = () => {
    handleLogin({login: false});
  };

  const handleSubmit = (event) => {

  };

  const handleCreate = () => {

  };

  return (
    <ReactModal
      isOpen={login === undefined ? true: false}
      onRequestClose={() => handleLogin({login: false})}
      contentLabel={"Login Modal"}
      id="login"
      appElement={document.getElementById('app')}
      preventScroll={true}>

      <form>
        Email: <input type="email" />
        Password: <input type="password" />
        <button onClick={ event => {handleSubmit(event)}}>Login</button>
        <button onClick={handleQuit}>Continue As Guest</button>
      </form>

    </ReactModal>
  );
}

