import React, { useState } from 'react';

export default ({ handleLogin }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const formstyles = {
    display: 'grid'
  };

  const handleChange = (event) => {
    if (event.target.validity.valid) {
      if (event.target.name === 'email') {
        setEmail(event.target.value);
      } else if (event.target.name === 'password') {
        setPassword(event.target.value);
      } else {
        setUsername(event.target.value);
      }
    }
  }

  const handleSubmit = (event) => {
    if (email.length > 1 && password.length > 1 && username.length > 1) {
      let userData = {
        login: true,
        email: email,
        password: password,
        username: username
      }
      handleLogin(userData);
    }
  }

  return (
    <form id="signup" style={formstyles}>
      Username: <input
        name="user"
        type="text"
        id="newusername"
        required
        pattern="^[^\s].+[^\s]$"
        maxLength="20"
        onChange={event => {handleChange(event)}}/>
      Email: <input
        name="email"
        type="email"
        id="signinemail"
        required
        onChange={event => {handleChange(event)}}/>
      Password: <input
        name="password"
        type="password"
        id="pass"
        required
        onChange={event => {handleChange(event)}}/>
      <br/>
      <button onClick={ event => {handleSubmit(event)}}>Create An Account</button>
    </form>
  );
}