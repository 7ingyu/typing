import React, { useState } from 'react';

const App = () => {
  const [timer, setTimer] = useState('10');
  const [timeDisplay, setTimeDisplay] = useState(timer);
  const [btnText, setBtnText] = useState('Start');
  const [timerStarted, setTimerStarted] = useState(false);

  const handleTyping = (event) => {
    if (timer > 0 && timerStarted === false) {
      setTimerStarted(true);
      let timeLeft = timer
      var countdown = setInterval(() => {
        console.log(timeLeft);
        if (timeLeft >= 0) {
          setTimeDisplay(timeLeft--);
        } else {
          event.target.setAttribute("disabled", true);
        }
      }, 1000);
    }
  };

  const handleReset = () => {
    setTimeDisplay(timer);
    clearInterval(countdown);
  }

  // Refactor to 00:00 time remaining if possible
  return (
    <div>
      <div role="timer">Seconds Remaining: {timeDisplay}</div>
      <textarea
        rows="10"
        cols="100"
        autoFocus
        placeholder="Type here!"
        spellCheck="false"
        onChange={ event => handleTyping(event) } />
      {timeDisplay === 0 ? <button onClick={handleReset}>Restart</button>: null}
    </div>
  );
};

export default App;