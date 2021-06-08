import React, { useState } from 'react';

export default ({ handleLogin }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const formstyles = {
    display: 'grid'
  };

  const handleChange = (event) => {
    if (event.target.validity.valid) {
      if (event.target.name === 'email') {
        setEmail(event.target.value);
      } else {
        setPassword(event.target.value)
      }
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email.length > 1 && password.length > 1) {
      let userData = {
        login: true,
        email: email,
        password: password
      }
      handleLogin(userData);
    }
    setPassword('');
    document.getElementById('pass').value = '';
  }

  return (
    <form id="login" style={formstyles}>
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
      <br />
      <button onClick={ event => {handleSubmit(event)}}>Login</button>
    </form>
  );
}