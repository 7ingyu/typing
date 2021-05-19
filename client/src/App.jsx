import React, { useState, useEffect } from 'react';
import TextArea from './styling/TextArea.jsx';
import Timer from './styling/Timer.jsx';
import axios from 'axios';

export default () => {
  const [timer, setTimer] = useState(30);
  const [timeDisplay, setTimeDisplay] = useState(timer);
  const [btnText, setBtnText] = useState('Start');
  const [timerStarted, setTimerStarted] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [copyText, setCopyText] = useState({});
  const url = 'http://localhost:1234'
  var countdown;

  const getText = () => {
    axios
      .get(`${url}/copy`, {params: {minutes: Math.ceil(timer/60)}})
      .then( res => {
        // let text = {__html: res.data};
        setCopyText(res.data);
      })
      .catch( err => {
        console.log(err);
      });
  };

  const handleTimerChange = () => {
    const min = document.getElementById('minutes').value;
    const sec = document.getElementById('seconds').value;

    if (Math.ceil(timer / 60) !== Math.ceil((min * 60) + sec)) {
      getText();
    }

    setTimer((min * 60) + sec);
  };

  const handleTyping = (event) => {

    setTypedText(event.target.value);

    if (timer > 0 && timerStarted === false) {
      setTimerStarted(true);
      let timeLeft = timer
      countdown = setInterval(() => {
        console.log(timeLeft);
        if (timeLeft > 0) {

          var date = new Date(0);
          date.setSeconds(45); // specify value for SECONDS here
          var timeString = date.toISOString().substr(11, 8);

          console.log(timeString)
          setTimeDisplay(--timeLeft);
        } else {
          event.target.disabled = true;
          clearInterval(countdown);
        }
      }, 1000);
    }
  };

  const handleReset = () => {
    setTimeDisplay(timer);
    setTimerStarted(false);
    let textbox = document.getElementById('typingarea');
    textbox.value = '';
    textbox.disabled = false;
    textbox.focus();
  };

  const createMarkup = () => {
    return {__html: copyText};
  }

  useEffect(() => {
    getText();
  }, []);

  return (
    <div>
      Timer: <Timer
        id="minutes"
        type="number"
        max="15"
        defaultValue="0"
        onChange={handleTimerChange}/>:
      <Timer
        id="seconds"
        type="number"
        max="59"
        defaultValue="30"
        onChange={handleTimerChange}/><br/>
      <div id="copytext" dangerouslySetInnerHTML={createMarkup()}></div>
      <div role="timer">Time Remaining: {timeDisplay}</div>
      <TextArea
        id="typingarea"
        autoFocus
        placeholder="Type here!"
        spellCheck="false"
        onChange={ event => handleTyping(event) } />
      {timeDisplay <= 0 ? <button autoFocus onClick={handleReset}>Restart</button>: null}
    </div>
  );
};