import React from 'react';
import ReactModal from 'react-modal';

export default ({ login, handleLogin } => {

  handleQuit = () => {
    handleLogin({login: false});
  };

  handleSubmit = (event) => {

  };

  return (
    <ReactModal
      isOpen={login === undefined ? true: false}
      onRequestClose={() => handleLogin({login: false})}
      contentLabel={"Login Modal"}
      id={"login"}
      preventScroll={true}>

      <form>
        Email: <input type="email" />
        Password: <input type="password" />
        <button onClick={ event => {handleSubmit(event)}}>Login</button>
        <button onClick={handleQuit}>Continue As Guest</button>
      </form>

    </ReactModal>
  )
})

