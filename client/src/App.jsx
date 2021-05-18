import React, { useState } from 'react';

const App = () => {
  const [timer, setTimer] = useState('10');
  const [timeDisplay, setTimeDisplay] = useState(timer);
  const [btnText, setBtnText] = useState('Start');
  const [timerStarted, setTimerStarted] = useState(false);
  const [typedText, setTypedText] = useState('');
  var countdown;

  const handleTyping = (event) => {

    setTypedText(event.target.value);

    if (timer > 0 && timerStarted === false) {
      setTimerStarted(true);
      let timeLeft = timer
      countdown = setInterval(() => {
        console.log(timeLeft);
        if (timeLeft > 0) {
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
  }

  // Refactor to 00:00 time remaining if possible
  return (
    <div>
      <div role="timer">Seconds Remaining: {timeDisplay}</div>
      <textarea
        id="typingarea"
        rows="10"
        cols="100"
        autoFocus
        placeholder="Type here!"
        spellCheck="false"
        onChange={ event => handleTyping(event) } />
      {timeDisplay <= 0 ? <button autoFocus onClick={handleReset}>Restart</button>: null}
    </div>
  );
};

export default App;