import React, { useState } from 'react';

export default ({ handleLogin }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (event) => {
    if (event.target.validity.valid) {
      if (event.target.name === email) {
        setEmail(event.target.value);
      } else {
        setPassword(event.target.value)
      }
    }
  }

  const handleSubmit = (event) => {
    if (email.length > 1 && password.length > 1) {
      let userData = {
        login: true,
        email: email,
        password: password
      }
      handleLogin(userData);
    }
  }

  return (
    <form id="login">
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
      <button onClick={ event => {handleSubmit(event)}}>Login</button>
    </form>
  );
}