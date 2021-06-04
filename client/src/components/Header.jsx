import React from 'react';

// Implement a new best feature!
export default ({ login, handleLogin }) => {

  const header = {
    backgroundColor: '#111111',
    color: '#cccccc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0vw 3vw',
    marginBottom: '3vw'
  }

  return (
    <div style={header} id="top">
      <h1>Catch Phrases</h1>
      {login === true ?
        <div>
          <span onClick={() => handleLogin({login: undefined})}>Sign In</span>
          <span> | </span>
          <span onClick={() => handleLogin({login: undefined})}>Sign Up</span>
        </div>:
        <div>
          <span onClick={() => handleLogin({login: undefined})}>Sign Out</span>
        </div>}
    </div>
  )
}